import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalClasses: 0,
    totalReservations: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, activities, classes, reservations] = await Promise.all([
          api.getUsers(),
          api.getActivities(),
          api.getClasses(),
          api.getReservations()
        ]);

        setStats({
          totalUsers: users.length,
          totalActivities: activities.length,
          totalClasses: classes.length,
          totalReservations: reservations.length
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <div className="container">Cargando estadísticas...</div>;

  return (
    <div className="container">
      <h1>Dashboard Administrativo</h1>
      <p>Bienvenido, {user?.nombre}</p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        <div style={{
          background: '#3498db',
          color: 'white',
          padding: '25px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Usuarios</h3>
          <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalUsers}</p>
        </div>

        <div style={{
          background: '#27ae60',
          color: 'white',
          padding: '25px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Actividades</h3>
          <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalActivities}</p>
        </div>

        <div style={{
          background: '#e67e22',
          color: 'white',
          padding: '25px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Clases</h3>
          <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalClasses}</p>
        </div>

        <div style={{
          background: '#9b59b6',
          color: 'white',
          padding: '25px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Reservas</h3>
          <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalReservations}</p>
        </div>
      </div>

      {/* Acciones rápidas para admin */}
      <div style={{ marginTop: '40px' }}>
        <h2>Acciones Rápidas</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.location.href = '/users'}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            👥 Gestionar Usuarios
          </button>
          <button 
            onClick={() => window.location.href = '/activities'}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🏃 Gestionar Actividades
          </button>
          <button 
            onClick={() => window.location.href = '/classes'}
            style={{
              background: '#e67e22',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🏋️ Gestionar Clases
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;