import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Reservations() {
  const [classes, setClasses] = useState([])
  const [reservations, setReservations] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedClass, setSelectedClass] = useState('')
  
  const { user } = useAuth() // ← Obtener usuario logueado

  // Función para cargar datos del usuario logueado
  const loadUserData = async () => {
    if (!user || !user.idUsuario) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Cargar SOLO las reservas del usuario logueado
      const [classesData, userReservations, activitiesData] = await Promise.all([
        api.getClasses(),
        api.getUserReservations(user.idUsuario),
        api.getActivities()
      ])
      
      setClasses(classesData)
      setReservations(userReservations)
      setActivities(activitiesData)
      
      console.log('🏫 Clases cargadas:', classesData)
      console.log('📋 MIS Reservas cargadas:', userReservations)
      console.log('💪 Actividades cargadas:', activitiesData)
      
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [user]) // ← Recargar cuando cambie el usuario

  const handleCreateReservation = async (e) => {
    e.preventDefault()
    if (!selectedClass || !user) {
      alert('Por favor selecciona una clase')
      return
    }

    setCreating(true)
    try {
      const reservationData = {
        idUsuario: user.idUsuario, // ← Usar ID del usuario logueado
        idClase: parseInt(selectedClass),
        fechaReserva: new Date().toISOString().split('T')[0],
        estado: 'ACTIVA'
      }

      console.log('📤 Enviando datos de reserva:', reservationData)

      const newReservation = await api.createReservation(reservationData)
      
      console.log('📥 Reserva creada (respuesta):', newReservation)
      
      // Actualizar la lista de reservas
      setReservations(prev => [...prev, newReservation])
      
      // Recargar datos para asegurar que tenemos la info más actualizada
      await loadUserData()
      
      // Limpiar formulario
      setSelectedClass('')
      
      alert('✅ Reserva creada exitosamente!')
      
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert('❌ Error al crear la reserva: ' + (error.message || 'Verifica que no tengas ya una reserva en esta clase'))
    } finally {
      setCreating(false)
    }
  }

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return
    }

    try {
      await api.deleteReservation(reservationId)
      // Recargar las reservas del usuario
      await loadUserData()
      alert('✅ Reserva cancelada exitosamente!')
    } catch (error) {
      console.error('Error canceling reservation:', error)
      alert('❌ Error al cancelar la reserva: ' + error.message)
    }
  }

  // Función para obtener información COMPLETA de la clase
  const getClassInfo = (idClase) => {
    const clase = classes.find(c => c.idClase === idClase)
    return clase
  }

  // Función para obtener el nombre de la actividad
  const getActivityName = (idActividad) => {
    const activity = activities.find(a => a.idActividad === idActividad)
    return activity ? activity.nombre : 'Actividad no encontrada'
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no definida'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  // Si no hay usuario logueado
  if (!user) {
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
          <p>Debes iniciar sesión para ver tus reservas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Mis Reservas</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Bienvenido, <strong>{user.nombre}</strong>. Aquí puedes gestionar tus reservas de clases.
      </p>

      {/* Formulario para crear reserva */}
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2>Reservar Nueva Clase</h2>
        
        <form onSubmit={handleCreateReservation}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Seleccionar Clase:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              required
            >
              <option value="">-- Selecciona una clase --</option>
              {classes.map(clase => {
                const activityName = getActivityName(clase.idActividad)
                return (
                  <option key={clase.idClase} value={clase.idClase}>
                    {activityName} - {formatDate(clase.fechaHora)}
                  </option>
                )
              })}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={creating}
            style={{
              background: creating ? '#95a5a6' : '#27ae60',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: creating ? 'not-allowed' : 'pointer'
            }}
          >
            {creating ? 'Creando Reserva...' : 'Reservar Clase'}
          </button>
        </form>
      </div>

      {/* MIS Reservas */}
      <div>
        <h2>Mis Reservas Activas</h2>
        
        {loading ? (
          <p>Cargando tus reservas...</p>
        ) : reservations.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {reservations.map(reservation => {
              const classInfo = getClassInfo(reservation.idClase)
              const activityName = classInfo ? getActivityName(classInfo.idActividad) : 'Clase no encontrada'
              
              return (
                <div key={reservation.idReserva} style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                        {activityName}
                      </h3>
                      <p><strong>📅 Fecha de Reserva:</strong> {formatDate(reservation.fechaReserva)}</p>
                      
                      {classInfo && (
                        <p><strong>⏰ Fecha de Clase:</strong> {formatDate(classInfo.fechaHora)}</p>
                      )}
                      
                      <p><strong>📊 Estado:</strong> 
                        <span style={{
                          color: reservation.estado === 'ACTIVA' ? '#27ae60' : '#e74c3c',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}>
                          {reservation.estado || 'CONFIRMADA'} {reservation.estado === 'ACTIVA' ? '✅' : '❌'}
                        </span>
                      </p>
                    </div>
                    
                    {reservation.estado === 'ACTIVA' && (
                      <button
                        onClick={() => handleCancelReservation(reservation.idReserva)}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#666',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>No tienes reservas activas</h3>
            <p>¡Reserva tu primera clase usando el formulario de arriba!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservations