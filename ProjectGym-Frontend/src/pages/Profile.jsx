import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const getRoleName = (idRol) => {
  switch(idRol) {
    case 1: return 'ADMIN';
    case 2: return 'USER';
    case 3: return 'ENTRENADOR';
    default: return 'USER';
  }
};

const getRoleColor = (idRol) => {
  switch(idRol) {
    case 1: return '#e74c3c'; // Rojo para ADMIN
    case 2: return '#3498db'; // Azul para USER  
    case 3: return '#27ae60'; // Verde para Entrenador
    default: return '#95a5a6'; // Gris por defecto
  }
};

function Profile() {
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  
    const getFullRoleName = (idRol) => {
        switch(idRol) {
            case 1: return 'Administrador';
            case 2: return 'Usuario';
            case 3: return 'Entrenador';
            default: return 'Usuario';
        }
    }; 

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/usuarios/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) throw new Error('Error cargando datos del usuario')
      
      const userDataFromApi = await response.json()
      setUserData(userDataFromApi)
      setFormData({
        nombre: userDataFromApi.nombre || '',
        email: userDataFromApi.email || '',
        telefono: userDataFromApi.telefono || '',
        password: ''
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      // Fallback a datos del contexto si falla la API
      setUserData(user)
      setFormData({
        nombre: user?.nombre || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        password: ''
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setMessage('')
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      nombre: userData?.nombre || '',
      email: userData?.email || '',
      telefono: userData?.telefono || '',
      password: ''
    })
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const token = localStorage.getItem('token')
      
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        idRol: userData.idRol
      }
      
      // Solo incluir password si se proporcionó uno nuevo
      if (formData.password && formData.password.trim() !== '') {
        dataToSend.password = formData.password
      }
      
      const response = await fetch(`http://localhost:8080/api/usuarios/${userData.idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error actualizando perfil')
      }
      
      const updatedUser = await response.json()
      
      setMessage('✅ Perfil actualizado correctamente')
      setEditing(false)
      setUserData(updatedUser)
      
      // Actualizar localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'))
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        nombre: updatedUser.nombre,
        email: updatedUser.email
      }))
      
      // Recargar la página después de 2 segundos para actualizar el navbar
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (error) {
      console.error('Update error:', error)
      setMessage('❌ Error al actualizar el perfil: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Cargando perfil...</div>

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header del perfil */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '32px'
          }}>
            👤
          </div>
          <h1 style={{ margin: '0 0 5px 0' }}>{userData?.nombre}</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>{userData?.email}</p>
          <div style={{
            display: 'inline-block',
            background: getRoleColor(userData?.idRol),
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '14px',
            marginTop: '8px',
            fontWeight: 'bold'
          }}>
            {getRoleName(userData?.idRol)}
          </div>
        </div>

        {/* Información del usuario */}
        <div style={{ padding: '30px' }}>
          {message && (
            <div style={{
              background: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {message}
            </div>
          )}

          {!editing ? (
            // Vista de solo lectura
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>Información Personal</h2>
                <button 
                  onClick={handleEdit}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Editar Perfil
                </button>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#6c757d' }}>
                    Nombre Completo
                  </label>
                  <p style={{ margin: 0, fontSize: '16px' }}>{userData?.nombre}</p>
                </div>

                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#6c757d' }}>
                    Email
                  </label>
                  <p style={{ margin: 0, fontSize: '16px' }}>{userData?.email}</p>
                </div>

                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#6c757d' }}>
                    Teléfono
                  </label>
                  <p style={{ margin: 0, fontSize: '16px' }}>{userData?.telefono || 'No especificado'}</p>
                </div>

                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#6c757d' }}>
                    ID de Usuario
                  </label>
                  <p style={{ margin: 0, fontSize: '16px' }}>{userData?.idUsuario}</p>
                </div>

                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#6c757d' }}>
                    Rol
                  </label>
                    <p style={{ margin: 0, fontSize: '16px' }}>
                        {getFullRoleName(userData?.idRol)}
                    </p>
                </div>
              </div>
            </div>
          ) : (
            // Formulario de edición
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>Editar Perfil</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={handleCancel}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      background: loading ? '#95a5a6' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? '💾 Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#2c3e50' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#2c3e50' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#2c3e50' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                    placeholder="Ej: 123-456-7890"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#2c3e50' }}>
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                    placeholder="Dejar vacío para no cambiar"
                  />
                  <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>
                    Solo completa este campo si deseas cambiar tu contraseña
                  </small>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile