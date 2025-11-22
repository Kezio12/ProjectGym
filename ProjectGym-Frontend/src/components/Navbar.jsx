import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Función para determinar si el usuario es ADMIN
  const isAdmin = user?.rol === 'ADMIN'

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: '#2c3e50', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo y marca */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          🏋️ GymApp
        </Link>

        {/* Menú para desktop */}
        <div style={{ 
          display: { xs: 'none', md: 'flex' }, 
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {/* Opciones para todos los usuarios */}
          <Link to="/activities" style={{ 
            color: 'white', 
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background 0.3s'
          }}>
            Actividades
          </Link>
          <Link to="/classes" style={{ 
            color: 'white', 
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background 0.3s'
          }}>
            Clases
          </Link>

          {/* Opciones solo para usuarios autenticados */}
          {isAuthenticated && (
            <>
              <Link to="/reservations" style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'background 0.3s'
              }}>
                Mis Reservas
              </Link>
              <Link to="/profile" style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'background 0.3s'
              }}>
                Mi Perfil
              </Link>
            </>
          )}

          {/* Opciones solo para ADMIN */}
          {isAuthenticated && isAdmin && (
            <>
              <Link to="/entrenadores" style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'background 0.3s'
              }}>
                Entrenadores
              </Link>
              
              <Link to="/users" style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'background 0.3s'
              }}>
                Usuarios
              </Link>

              <Link to="/dashboard" style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: '#e74c3c',
                transition: 'background 0.3s'
              }}>
                Dashboard
              </Link>
            </>
          )}

          {/* Enlace de prueba (solo desarrollo) */}
          {process.env.NODE_ENV === 'development' && user && user.rol === 'ADMIN' && (
            <Link to="/test" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              background: '#7f8c8d',
              fontSize: '0.8rem'
            }}>
              Prueba Conexión
            </Link>
          )}
        </div>
      </div>

      {/* Menú móvil hamburguesa */}
      <div style={{ display: { md: 'none' } }}>
        <button 
          onClick={toggleMobileMenu}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>
      </div>

      {/* Información del usuario y logout */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem'
      }}>
        {isAuthenticated ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                {user?.nombre}
              </div>
              <span style={{ 
                background: isAdmin ? '#e74c3c' : '#3498db',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {user?.rol}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = '#7f8c8d'}
              onMouseOut={(e) => e.target.style.background = '#95a5a6'}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" style={{ 
            color: 'white', 
            textDecoration: 'none',
            background: '#27ae60',
            padding: '8px 20px',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#219a52'}
          onMouseOut={(e) => e.target.style.background = '#27ae60'}
          >
            Iniciar Sesión
          </Link>
        )}
      </div>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#34495e',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <Link 
            to="/activities" 
            style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Actividades
          </Link>
          <Link 
            to="/classes" 
            style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Clases
          </Link>

          {isAuthenticated && (
            <>
              <Link 
                to="/reservations" 
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mis Reservas
              </Link>
              <Link 
                to="/profile" 
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link 
                to="/dashboard" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  background: '#e74c3c',
                  borderRadius: '4px'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/users" 
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Usuarios
              </Link>
            </>
          )}

          {process.env.NODE_ENV === 'development' && user && user.rol === 'ADMIN' && (
              <Link 
                to="/test" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  background: '#7f8c8d',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Prueba Conexión
              </Link>
           )}
        </div>
      )}
    </nav>
  )
}

export default Navbar