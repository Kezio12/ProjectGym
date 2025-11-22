const API_BASE_URL = 'http://localhost:8080'

// INTERCEPTOR PARA TOKEN
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  if (response.status === 401) {
    // Token expirado o inválido
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }
  
  return response
}

export const api = {
  // ========== AUTH ==========
  login: async (credentials) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error in login:', error)
      throw error
    }
  },

  // ========== DASHBOARD ==========
  getDashboardStats: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/dashboard/stats`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // ========== USUARIOS ==========
  getUsers: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/usuarios`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/usuarios/${userId}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  getUserReservations: async (userId) => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/reservas/usuario/${userId}`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error('Error fetching user reservations:', error)
        throw error
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/usuarios`, {
        method: 'POST',
        body: JSON.stringify(userData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/usuarios/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/usuarios/${userId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // ========== ACTIVIDADES ==========
  getActivities: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/actividades`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching activities:', error)
      throw error
    }
  },

  getActivityById: async (activityId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/actividades/${activityId}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching activity:', error)
      throw error
    }
  },

  createActivity: async (activityData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/actividades`, {
        method: 'POST',
        body: JSON.stringify(activityData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating activity:', error)
      throw error
    }
  },

  updateActivity: async (activityId, activityData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/actividades/${activityId}`, {
        method: 'PUT',
        body: JSON.stringify(activityData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  },

    deleteActivity: async (activityId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/actividades/${activityId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      // Para respuestas sin contenido
      if (response.status === 204) {
        return { success: true }
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error deleting activity:', error)
      throw error
    }
  },

  // ========== CLASES ==========
  getClasses: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/clases`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching classes:', error)
      throw error
    }
  },

  getClassById: async (classId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/clases/${classId}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching class:', error)
      throw error
    }
  },

  createClass: async (classData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/clases`, {
        method: 'POST',
        body: JSON.stringify(classData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating class:', error)
      throw error
    }
  },

  updateClass: async (classId, classData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/clases/${classId}`, {
        method: 'PUT',
        body: JSON.stringify(classData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating class:', error)
      throw error
    }
  },

  
  deleteClass: async (classId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/clases/${classId}`, {
        method: 'DELETE'
      })
      
      console.log('🔍 Respuesta eliminar clase:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Para respuestas 204 No Content
      if (response.status === 204) {
        return { success: true, message: 'Clase eliminada correctamente' }
      }
      
      // Para otras respuestas exitosas que sí tienen contenido
      return await response.json()
      
    } catch (error) {
      console.error('Error deleting class:', error)
      throw error
    }
  },

  // ========== RESERVAS ==========
  getReservations: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/reservas`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching reservations:', error)
      throw error
    }
  },

  getReservationById: async (reservationId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/reservas/${reservationId}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching reservation:', error)
      throw error
    }
  },

  createReservation: async (reservationData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/reservas`, {
        method: 'POST',
        body: JSON.stringify(reservationData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating reservation:', error)
      throw error
    }
  },

  updateReservation: async (reservationId, reservationData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/reservas/${reservationId}`, {
        method: 'PUT',
        body: JSON.stringify(reservationData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating reservation:', error)
      throw error
    }
  },

  deleteReservation: async (reservationId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/reservas/${reservationId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      // Para respuestas sin contenido
      if (response.status === 204) {
        return { success: true }
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error deleting reservation:', error)
      throw error
    }
  },

  // ========== ENTRENADORES ==========
  getTrainers: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/entrenadores`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching trainers:', error)
      throw error
    }
  },

  createTrainer: async (trainerData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/entrenadores`, {
        method: 'POST',
        body: JSON.stringify(trainerData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error creating trainer:', error)
      throw error
    }
  },

  updateTrainer: async (trainerId, trainerData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/entrenadores/${trainerId}`, {
        method: 'PUT',
        body: JSON.stringify(trainerData)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error updating trainer:', error)
      throw error
    }
  },

  deleteTrainer: async (trainerId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/entrenadores/${trainerId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error deleting trainer:', error)
      throw error
    }
  },

  // ========== HORARIOS ==========
  getSchedules: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/horarios`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching schedules:', error)
      throw error
    }
  },

  // ========== MEMBRESÍAS ==========
  getMemberships: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/membresias`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching memberships:', error)
      throw error
    }
  },

  // ========== ROLES ==========
  getRoles: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/roles`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  }
}