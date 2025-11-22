import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState(null)

  const { user } = useAuth()

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: ''
  })

  const loadTrainers = async () => {
    setLoading(true)
    setError('')
    try {
      const trainersData = await api.getTrainers()
      setTrainers(trainersData)
    } catch (err) {
      setError('Error cargando entrenadores: ' + err.message)
      console.error('Error details:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrainers()
  }, [])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Abrir formulario para crear nuevo entrenador
  const handleNewTrainer = () => {
    setEditingTrainer(null)
    setFormData({
      nombre: '',
      especialidad: ''
    })
    setShowForm(true)
  }

  // Abrir formulario para editar entrenador
  const handleEditTrainer = (trainer) => {
    setEditingTrainer(trainer)
    setFormData({
      nombre: trainer.nombre,
      especialidad: trainer.especialidad
    })
    setShowForm(true)
  }

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTrainer) {
        // Actualizar entrenador existente
        await api.updateTrainer(editingTrainer.idEntrenador, formData)
        alert('Entrenador actualizado exitosamente!')
      } else {
        // Crear nuevo entrenador
        await api.createTrainer(formData)
        alert('Entrenador creado exitosamente!')
      }
      
      setShowForm(false)
      await loadTrainers() // Recargar datos
      
    } catch (error) {
      console.error('Error guardando entrenador:', error)
      alert('Error al guardar el entrenador: ' + (error.message || 'Verifica la consola para más detalles'))
    }
  }

  // Eliminar entrenador
  const handleDeleteTrainer = async (trainerId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este entrenador? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await api.deleteTrainer(trainerId)
      alert('✅ Entrenador eliminado exitosamente!')
      await loadTrainers() // Recargar datos
      
    } catch (error) {
      console.error('Error eliminando entrenador:', error)
      alert('❌ Error al eliminar el entrenador: ' + error.message)
    }
  }

  // Si no es admin, no puede ver esta página
  if (!user || user.rol !== 'ADMIN') {
    return (
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Acceso Restringido</h2>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h1>Gestión de Entrenadores</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Administra los entrenadores disponibles para las clases del gimnasio.
        </p>
      </div>

      {/* Botones de administración */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleNewTrainer}
          style={{
            background: '#27ae60',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Nuevo Entrenador
        </button>
        
        <button 
          onClick={loadTrainers} 
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
          {loading ? 'Cargando...' : 'Actualizar Entrenadores'}
        </button>
      </div>

      {/* Formulario para crear/editar entrenadores */}
      {showForm && (
        <div style={{
          padding: '25px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          border: '2px solid #3498db'
        }}>
          <h2>{editingTrainer ? 'Editar Entrenador' : 'Nuevo Entrenador'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nombre del Entrenador:
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Carlos Rodríguez"
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
                  Especialidad:
                </label>
                <input
                  type="text"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleInputChange}
                  placeholder="Ej: Yoga, CrossFit, Pilates..."
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
                {editingTrainer ? 'Actualizar' : 'Crear'} Entrenador
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
          <h3>Cargando entrenadores...</h3>
        </div>
      )}

      {!loading && trainers.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            background: '#f8f9fa',
            padding: '15px 20px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>
              {trainers.length} {trainers.length === 1 ? 'entrenador registrado' : 'entrenadores registrados'}
            </h3>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {trainers.map(trainer => (
              <div key={trainer.idEntrenador} style={{
                padding: '25px',
                border: '2px solid #3498db20',
                borderRadius: '12px',
                background: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                {/* Botones de administración */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handleEditTrainer(trainer)}
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
                    onClick={() => handleDeleteTrainer(trainer.idEntrenador)}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                  {/* Información principal */}
                  <div>
                    <h2 style={{ 
                      margin: '30px 0 10px 0', 
                      color: '#2c3e50',
                      fontSize: '24px'
                    }}>
                      {trainer.nombre}
                    </h2>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🎯</span>
                        <div>
                          <strong>Especialidad:</strong><br />
                          {trainer.especialidad}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🆔</span>
                        <div>
                          <strong>ID Entrenador:</strong><br />
                          {trainer.idEntrenador}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badge de estado */}
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    minWidth: '150px'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
                      Activo
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Disponible
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && trainers.length === 0 && !error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>No hay entrenadores registrados</h3>
          <p>Comienza agregando el primer entrenador al sistema.</p>
          <button 
            onClick={handleNewTrainer}
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
            + Agregar Primer Entrenador
          </button>
        </div>
      )}
    </div>
  )
}

export default Trainers