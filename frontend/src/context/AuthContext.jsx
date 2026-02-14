import { createContext, useState, useEffect, useContext } from 'react'
import api from '../utils/api'
import {jwtDecode} from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          localStorage.removeItem('token')
        }
      } catch (err) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    const decoded = jwtDecode(token)
    setUser(decoded)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)