import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    idRol: ''
  })
  const [message, setMessage] = useState('')

  const loadUsers = async () => {
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      nombre: user.nombre || '',
      email: user.email || '',
      telefono: user.telefono || '',
      password: '', // Siempre vacío por seguridad
      idRol: user.idRol || ''
    })
    setMessage('')
  }

  const handleCancel = () => {
    setEditingUser(null)
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      idRol: ''
    })
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        idRol: parseInt(formData.idRol)
      }
      
      // Solo incluir password si se proporcionó uno nuevo
      if (formData.password && formData.password.trim() !== '') {
        dataToSend.password = formData.password
      }
      
      await api.updateUser(editingUser.idUsuario, dataToSend)
      
      setMessage('✅ Usuario actualizado correctamente')
      setEditingUser(null)
      
      // Recargar la lista de usuarios
      await loadUsers()
      
    } catch (error) {
      console.error('Update error:', error)
      setMessage('❌ Error al actualizar el usuario: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return
    }
    
    try {
      await api.deleteUser(userId)
      setMessage('✅ Usuario eliminado correctamente')
      await loadUsers() // Recargar lista
    } catch (error) {
      console.error('Delete error:', error)
      setMessage('❌ Error al eliminar el usuario: ' + error.message)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container">
      <h1>Gestión de Usuarios</h1>
      <p>Total: {users.length} usuarios registrados</p>

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

      {/* Modal de edición */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2>Editar Usuario: {editingUser.nombre}</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
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
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="Dejar vacío para no cambiar"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    Rol *
                  </label>
                  <select
                    name="idRol"
                    value={formData.idRol}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="1">Administrador</option>
                    <option value="2">Usuario</option>
                    <option value="3">Entrenador</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
                  Cancelar
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
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {users.map(user => (
            <div key={user.idUsuario} style={{
              padding: '20px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                    {user.nombre}
                    <span style={{
                      background: user.idRol === 1 ? '#e74c3c' : 
                                  user.idRol === 2 ? '#3498db' : '#27ae60',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      marginLeft: '10px'
                    }}>
                      {user.idRol === 1 ? 'ADMIN' : user.idRol === 2 ? 'USER' : 'Entrenador'}
                    </span>
                  </h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Teléfono:</strong> {user.telefono || 'No especificado'}</p>
                  <p><strong>ID Usuario:</strong> {user.idUsuario}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <button 
                    onClick={() => handleEdit(user)}
                    style={{
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(user.idUsuario)}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Users