import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, getProfile } from '../api/auth'

const AUTH_TOKEN_KEY = 'ashashop_token'
const AUTH_USER_KEY = 'ashashop_user'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = Boolean(user)
  const isAdmin = Boolean(user?.role === 'admin')

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token && !user) {
      setLoading(true)
      getProfile()
        .then((profile) => {
          setUser(profile)
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile))
        })
        .catch(() => {
          localStorage.removeItem(AUTH_TOKEN_KEY)
          localStorage.removeItem(AUTH_USER_KEY)
          setUser(null)
        })
        .finally(() => setLoading(false))
    }
  }, [user])

  const setSession = ({ token, user }) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    }
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      setUser(user)
    }
  }

  const login = async ({ name, mobile }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiLogin({ name, mobile })
      setSession(data)
      return data
    } catch (err) {
      setError(err?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      loading,
      error,
      login,
      logout,
      setSession,
    }),
    [user, isAuthenticated, isAdmin, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
