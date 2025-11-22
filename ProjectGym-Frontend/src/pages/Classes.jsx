import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Classes() {
  const [classes, setClasses] = useState([])
  const [activities, setActivities] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)

  const { user } = useAuth()

  // Estado para el formulario
  const [formData, setFormData] = useState({
    idActividad: '',
    idEntrenador: '',
    fechaHora: '',
    cupoMaximo: ''
  })

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('🔄 Cargando datos...')
      
      const [classesData, activitiesData, trainersData] = await Promise.all([
        api.getClasses(),
        api.getActivities(),
        api.getTrainers()
      ])
      
      // DEBUG DETALLADO - Ver TODOS los campos de cada clase
      console.log('🔍 DEBUG - Estructura completa de clases:')
      classesData.forEach((clase, index) => {
        console.log(`Clase ${index + 1}:`, {
          idClase: clase.idClase,
          cupoMaximo: clase.cupoMaximo,
          cuposDisponibles: clase.cuposDisponibles,
          fechaHora: clase.fechaHora,
          idActividad: clase.idActividad,
          // Mostrar todos los campos disponibles
          todosLosCampos: Object.keys(clase)
        })
      })
      
      setClasses(classesData)
      setActivities(activitiesData)
      setTrainers(trainersData)
      
      console.log('✅ Datos cargados exitosamente')
      
    } catch (err) {
      setError('Error cargando datos: ' + err.message)
      console.error('❌ Error details:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calcular disponibilidad - VERSIÓN CORREGIDA
  const getAvailableSpots = (clase) => {
    // Priorizar cuposDisponibles si existe y es un número válido
    if (clase.cuposDisponibles !== undefined && 
        clase.cuposDisponibles !== null && 
        !isNaN(clase.cuposDisponibles)) {
      console.log(`✅ Usando cuposDisponibles: ${clase.cuposDisponibles} para clase ${clase.idClase}`)
      return clase.cuposDisponibles
    }
    
    // Fallback a cupoMaximo
    console.log(`⚠️ Usando cupoMaximo como fallback: ${clase.cupoMaximo} para clase ${clase.idClase}`)
    return clase.cupoMaximo
  }

  useEffect(() => {
    loadData()
  }, [])

  // Función para obtener el nombre de la actividad por ID
  const getActivityName = (idActividad) => {
    const activity = activities.find(a => a.idActividad === idActividad)
    return activity ? activity.nombre : 'Actividad no encontrada'
  }

  // Función para obtener el nombre del entrenador
  const getTrainerName = (idEntrenador) => {
    const trainer = trainers.find(t => t.idEntrenador === idEntrenador)
    return trainer ? trainer.nombre : 'Entrenador por asignar'
  }

  // Función para obtener la especialidad del entrenador
  const getTrainerSpecialty = (idEntrenador) => {
    const trainer = trainers.find(t => t.idEntrenador === idEntrenador)
    return trainer ? trainer.especialidad : ''
  }

  // Formatear fecha y hora para mostrar
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'No definido'
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      full: `${date.toLocaleDateString('es-ES')} a las ${date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`
    }
  }

  // Convertir fecha del formulario al formato que espera el backend
  const formatDateTimeForBackend = (dateTimeString) => {
    if (!dateTimeString) return null;
    // El formato debe ser: "2024-01-15T14:30:00"
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 19); // "2024-01-15T14:30:00"
  }

  // Determinar estado de disponibilidad
  const getAvailabilityStatus = (clase) => {
    const availableSpots = getAvailableSpots(clase)
    
    if (availableSpots === 0) {
      return { text: 'COMPLETO', color: '#e74c3c', available: false }
    } else if (availableSpots < 5) {
      return { text: 'ÚLTIMOS CUPOS', color: '#f39c12', available: true }
    } else {
      return { text: 'DISPONIBLE', color: '#27ae60', available: true }
    }
  }

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Abrir formulario para crear nueva clase
  const handleNewClass = () => {
    setEditingClass(null)
    setFormData({
      idActividad: '',
      idEntrenador: '',
      fechaHora: '',
      cupoMaximo: ''
    })
    setShowForm(true)
  }

  // Abrir formulario para editar clase
  const handleEditClass = (clase) => {
    setEditingClass(clase)
    // Convertir la fecha al formato que entiende input[type="datetime-local"]
    const fechaHoraForInput = clase.fechaHora ? clase.fechaHora.slice(0, 16) : ''
    
    setFormData({
      idActividad: clase.idActividad.toString(),
      idEntrenador: clase.idEntrenador.toString(),
      fechaHora: fechaHoraForInput,
      cupoMaximo: clase.cupoMaximo.toString()
    })
    setShowForm(true)
  }

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Preparar datos en el formato correcto para el backend
      const claseData = {
        idActividad: parseInt(formData.idActividad),
        idEntrenador: parseInt(formData.idEntrenador),
        fechaHora: formatDateTimeForBackend(formData.fechaHora),
        cupoMaximo: parseInt(formData.cupoMaximo),
        idHorario: null // Opcional, según tu estructura
      }

      console.log('📤 Enviando datos al backend:', claseData)

      if (editingClass) {
        // Actualizar clase existente
        await api.updateClass(editingClass.idClase, claseData)
        alert('Clase actualizada exitosamente!')
      } else {
        // Crear nueva clase
        await api.createClass(claseData)
        alert('Clase creada exitosamente!')
      }
      
      setShowForm(false)
      await loadData() // Recargar datos
      
    } catch (error) {
      console.error('❌ Error guardando clase:', error)
      alert('Error al guardar la clase: ' + (error.message || 'Verifica la consola para más detalles'))
    }
  }

  // Eliminar clase - VERSIÓN CORREGIDA
  const handleDeleteClass = async (claseId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta clase? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await api.deleteClass(claseId)
      alert('✅ Clase eliminada exitosamente!')
      await loadData() // Recargar datos
      
    } catch (error) {
      console.error('Error eliminando clase:', error)
      // Si la clase se eliminó pero hubo error en la respuesta, mostramos mensaje diferente
      if (error.message.includes('204') || error.message.includes('No Content')) {
        alert('✅ Clase eliminada exitosamente!')
        await loadData()
      } else {
        alert('❌ Error al eliminar la clase: ' + error.message)
      }
    }
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h1>Clases Disponibles</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Encuentra y reserva tu clase ideal. Todas nuestras actividades están guiadas por profesionales certificados.
        </p>
      </div>

      {/* Botones de administración para Admin */}
      {user && user.rol === 'ADMIN' && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleNewClass}
            style={{
              background: '#27ae60',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Nueva Clase
          </button>
          
          <button 
            onClick={loadData} 
            disabled={loading}
            style={{
              background: loading ? '#95a5a6' : '#3498db',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Cargando...' : 'Actualizar Clases'}
          </button>
        </div>
      )}

      {/* Formulario para crear/editar clases (solo Admin) */}
      {showForm && user && user.rol === 'ADMIN' && (
        <div style={{
          padding: '25px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          border: '2px solid #3498db'
        }}>
          <h2>{editingClass ? 'Editar Clase' : 'Nueva Clase'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Actividad:
                </label>
                <select
                  name="idActividad"
                  value={formData.idActividad}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                >
                  <option value="">Seleccionar actividad</option>
                  {activities.map(activity => (
                    <option key={activity.idActividad} value={activity.idActividad}>
                      {activity.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Entrenador:
                </label>
                <select
                  name="idEntrenador"
                  value={formData.idEntrenador}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                >
                  <option value="">Seleccionar entrenador</option>
                  {trainers.map(trainer => (
                    <option key={trainer.idEntrenador} value={trainer.idEntrenador}>
                      {trainer.nombre} - {trainer.especialidad}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Fecha y Hora:
                </label>
                <input
                  type="datetime-local"
                  name="fechaHora"
                  value={formData.fechaHora}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Cupo Máximo:
                </label>
                <input
                  type="number"
                  name="cupoMaximo"
                  value={formData.cupoMaximo}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit"
                style={{
                  background: '#27ae60',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingClass ? 'Actualizar' : 'Crear'} Clase
              </button>
              
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: '#95a5a6',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#ffeaea',
          padding: '15px',
          borderRadius: '4px',
          margin: '10px 0' 
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Cargando clases disponibles...</h3>
        </div>
      )}

      {!loading && classes.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            background: '#f8f9fa',
            padding: '15px 20px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>
              {classes.length} {classes.length === 1 ? 'clase programada' : 'clases programadas'}
            </h3>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {classes.map(clase => {
              const activityName = getActivityName(clase.idActividad)
              const trainerName = getTrainerName(clase.idEntrenador)
              const trainerSpecialty = getTrainerSpecialty(clase.idEntrenador)
              const dateTime = formatDateTime(clase.fechaHora)
              const availability = getAvailabilityStatus(clase)
              
              return (
                <div key={clase.idClase} style={{
                  padding: '25px',
                  border: `2px solid ${availability.color}20`,
                  borderRadius: '12px',
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  {/* Badge de disponibilidad */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: availability.color,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {availability.text}
                  </div>

                  {/* Botones de administración (solo Admin) */}
                  {user && user.rol === 'ADMIN' && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => handleEditClass(clase)}
                        style={{
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClass(clase.idClase)}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                    {/* Información principal */}
                    <div>
                      <h2 style={{ 
                        margin: user && user.rol === 'ADMIN' ? '30px 0 10px 0' : '0 0 10px 0', 
                        color: '#2c3e50',
                        fontSize: '24px'
                      }}>
                        {activityName}
                      </h2>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>📅</span>
                          <div>
                            <strong>Fecha y Hora:</strong><br />
                            {dateTime.full}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>👨‍🏫</span>
                          <div>
                            <strong>Instructor:</strong><br />
                            {trainerName}
                            {trainerSpecialty && (
                              <span style={{ color: '#666', fontSize: '14px', display: 'block' }}>
                                Especialidad: {trainerSpecialty}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>👥</span>
                          <div>
                            <strong>Cupo:</strong><br />
                            {clase.cupoMaximo} personas máximo
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información de disponibilidad */}
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      minWidth: '150px'
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: availability.color }}>
                        {getAvailableSpots(clase)}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        cupos disponibles
                      </div>
                    </div>
                  </div>

                  {/* Información técnica solo para Admin */}
                  {user && user.rol === 'ADMIN' && (
                    <div style={{
                      marginTop: '15px',
                      padding: '10px',
                      background: '#f1f8ff',
                      borderRadius: '5px',
                      borderLeft: '4px solid #3498db',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <strong>Info técnica:</strong> ID Clase: {clase.idClase} • ID Actividad: {clase.idActividad} • ID Entrenador: {clase.idEntrenador}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!loading && classes.length === 0 && !error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>No hay clases programadas</h3>
          <p>No se han encontrado clases disponibles en el sistema.</p>
          {user && user.rol === 'ADMIN' && (
            <button 
              onClick={handleNewClass}
              style={{
                background: '#27ae60',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              + Crear la Primera Clase
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Classes