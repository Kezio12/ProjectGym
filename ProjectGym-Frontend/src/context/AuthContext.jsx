import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar token al cargar la app
  useEffect(() => {
    if (token) {
      // Aquí podrías validar el token con el backend
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      }
    }
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Error en el login')
      }

      const data = await response.json()
      
      // Guardar en estado y localStorage
      setToken(data.token)
      setUser({
        email: data.email,
        nombre: data.nombre,
        idUsuario: data.idUsuario,
        rol: data.rol
      })
      setIsAuthenticated(true)
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        nombre: data.nombre,
        idUsuario: data.idUsuario,
        rol: data.rol
      }))

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.rol === requiredRole;
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    hasRole 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}