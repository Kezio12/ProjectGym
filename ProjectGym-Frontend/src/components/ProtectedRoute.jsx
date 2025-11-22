import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user } = useAuth()

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user?.rol !== requiredRole) {
    return (
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          color: '#e74c3c'
        }}>
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
          <p>Rol requerido: <strong>{requiredRole}</strong></p>
          <p>Tu rol: <strong>{user?.rol}</strong></p>
        </div>
      </div>
    )
  }

  // Si pasa todas las validaciones, mostrar el componente
  return children
}

export default ProtectedRoute