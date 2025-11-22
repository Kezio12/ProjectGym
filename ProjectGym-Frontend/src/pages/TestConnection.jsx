import React, { useState } from 'react'
import { api } from '../services/api'

function TestConnection() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState('')

  const testEndpoint = async (endpointName, apiCall) => {
    setLoading(endpointName)
    try {
      const data = await apiCall()
      setResults(prev => ({
        ...prev,
        [endpointName]: { success: true, data: data, count: data.length }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpointName]: { success: false, error: error.message }
      }))
    } finally {
      setLoading('')
    }
  }

  const testAll = async () => {
    await testEndpoint('Actividades', api.getActivities)
    await testEndpoint('Usuarios', api.getUsers)
    await testEndpoint('Clases', api.getClasses)
    await testEndpoint('Reservas', api.getReservations)
  }

  return (
    <div className="container">
      <h1>Prueba de Conexión con Backend</h1>
      
      <button onClick={testAll} disabled={loading}>
        {loading ? 'Probando...' : 'Probar Todos los Endpoints'}
      </button>

      <div style={{marginTop: '20px'}}>
        {Object.entries(results).map(([name, result]) => (
          <div key={name} style={{
            padding: '10px', 
            margin: '10px', 
            border: '1px solid',
            borderColor: result.success ? 'green' : 'red',
            background: result.success ? '#f0fff0' : '#fff0f0'
          }}>
            <h3>{name}</h3>
            {result.success ? (
              <div>
                <p>✅ Conectado exitosamente</p>
                <p>Registros obtenidos: {result.count}</p>
                <details>
                  <summary>Ver datos</summary>
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </details>
              </div>
            ) : (
              <div>
                <p>❌ Error: {result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && <p>Probando {loading}...</p>}
    </div>
  )
}

export default TestConnection