import React from 'react'
import { Link } from 'react-router-dom'  //Importar Link
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="container">
      <h1>Bienvenido a ProjectGym</h1>
      <p>Sistema de gestión de reservas</p>

      {isAuthenticated ? (
        <div style={{
          background: '#e8f5e8',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          maxWidth: '600px',  //Limitar ancho máximo
          margin: '20px auto' //Centrar horizontalmente
        }}>
          <h2>👋 Hola, {user?.nombre}!</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Rol:</strong> <span style={{
            background: '#3498db',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '14px'
          }}>{user?.rol}</span></p>
          <p><strong>ID Usuario:</strong> {user?.idUsuario}</p>
        </div>
      ) : (
        <div style={{
          background: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          maxWidth: '600px',  //Limitar ancho máximo
          margin: '20px auto', //Centrar horizontalmente
          textAlign: 'center'  //Centrar texto
        }}>
          <h3>🔐 Inicia sesión para acceder a todas las funciones</h3>
          <p>Actualmente solo puedes ver las actividades y clases disponibles.</p>
          <p>Una vez que inicies sesión, podrás:</p>
          <ul style={{ 
            textAlign: 'left', 
            display: 'inline-block', //Centrar la lista
            margin: '0 auto'
          }}>
            <li>✅ Hacer reservas de clases</li>
            <li>✅ Ver tu perfil de usuario</li>
            <li>✅ Acceder a funciones exclusivas</li>
          </ul>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>🏋️ Actividades</h3>
          <p>Variedad de clases disponibles</p>
          {/*CAMBIAR: <a> → <Link> */}
          <Link to="/activities" style={{
            display: 'inline-block',
            background: '#3498db',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>Ver Actividades</Link>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>📅 Clases</h3>
          <p>Horarios programados</p>
          {/*CAMBIAR: <a> → <Link> */}
          <Link to="/classes" style={{
            display: 'inline-block',
            background: '#27ae60',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>Ver Clases</Link>
        </div>

        {isAuthenticated && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3>📋 Reservas</h3>
            <p>Gestiona tus reservas</p>
            {/*CAMBIAR: <a> → <Link> */}
            <Link to="/reservations" style={{
              display: 'inline-block',
              background: '#e67e22',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}>Mis Reservas</Link>
          </div>
        )}

        {isAuthenticated && user?.rol === 'ADMIN' && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3>👥 Usuarios</h3>
            <p>Gestión de usuarios</p>
            {/*CAMBIAR: <a> → <Link> */}
            <Link to="/users" style={{
              display: 'inline-block',
              background: '#9b59b6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}>Gestionar Usuarios</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home