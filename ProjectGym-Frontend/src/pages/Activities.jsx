import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: 60,
    capacidadMaxima: 20
  });
  const [message, setMessage] = useState('');
  const { hasRole } = useAuth();

  const loadActivities = async () => {
    try {
      const data = await api.getActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
      setMessage('❌ Error al cargar las actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleCreate = () => {
    setEditingActivity(null);
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: 60,
      capacidadMaxima: 20
    });
    setShowForm(true);
    setMessage('');
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      nombre: activity.nombre || '',
      descripcion: activity.descripcion || '',
      duracion: activity.duracion || 60,
      capacidadMaxima: activity.capacidadMaxima || 20
    });
    setShowForm(true);
    setMessage('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: 60,
      capacidadMaxima: 20
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingActivity) {
        // Editar actividad existente
        await api.updateActivity(editingActivity.idActividad, formData);
        setMessage('✅ Actividad actualizada correctamente');
      } else {
        // Crear nueva actividad
        await api.createActivity(formData);
        setMessage('✅ Actividad creada correctamente');
      }
      
      setShowForm(false);
      setEditingActivity(null);
      await loadActivities(); // Recargar lista
      
    } catch (error) {
      console.error('Error saving activity:', error);
      setMessage('❌ Error al guardar la actividad: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      return;
    }
    
    try {
      await api.deleteActivity(activityId);
      setMessage('✅ Actividad eliminada correctamente');
      await loadActivities(); // Recargar lista
    } catch (error) {
      console.error('Error deleting activity:', error);
      setMessage('❌ Error al eliminar la actividad: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Actividades del Gimnasio</h1>
        {hasRole('ADMIN') && (
          <button 
            onClick={handleCreate}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Nueva Actividad
          </button>
        )}
      </div>

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

      {/* Formulario para crear/editar actividad */}
      {showForm && (
        <div style={{
          background: '#f8f9fa',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #dee2e6'
        }}>
          <h3>{editingActivity ? 'Editar Actividad' : 'Crear Nueva Actividad'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                  Nombre de la actividad *
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
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe la actividad..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    Duración (minutos) *
                  </label>
                  <input
                    type="number"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    min="15"
                    max="180"
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
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                    Capacidad máxima *
                  </label>
                  <input
                    type="number"
                    name="capacidadMaxima"
                    value={formData.capacidadMaxima}
                    onChange={handleChange}
                    min="1"
                    max="100"
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
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button 
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#95a5a6' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {loading ? '💾 Guardando...' : '💾 Guardar'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando actividades...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '20px'
        }}>
          {activities.map(activity => (
            <div key={activity.idActividad} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* Botones de acción (solo para ADMIN) */}
              {hasRole('ADMIN') && (
                <div style={{ 
                  position: 'absolute', 
                  top: '15px', 
                  right: '15px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button 
                    onClick={() => handleEdit(activity)}
                    style={{
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    title="Editar actividad"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(activity.idActividad)}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    title="Eliminar actividad"
                  >
                    🗑️
                  </button>
                </div>
              )}

              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: '#2c3e50',
                paddingRight: hasRole('ADMIN') ? '60px' : '0'
              }}>
                {activity.nombre}
              </h3>
              
              <p style={{ 
                color: '#7f8c8d', 
                marginBottom: '20px',
                minHeight: '40px'
              }}>
                {activity.descripcion || 'Sin descripción'}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '14px',
                color: '#6c757d'
              }}>
                <span>⏱️ {activity.duracion || 60} min</span>
                <span>👥 {activity.capacidadMaxima || 20} personas</span>
              </div>

              {activity.idActividad && (
                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #e9ecef',
                  fontSize: '12px',
                  color: '#95a5a6'
                }}>
                  ID: {activity.idActividad}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          background: '#f8f9fa',
          borderRadius: '8px',
          color: '#6c757d'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>No hay actividades registradas</p>
          <p>Crea la primera actividad usando el botón "Nueva Actividad"</p>
        </div>
      )}
    </div>
  );
}

export default Activities;