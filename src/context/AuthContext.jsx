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
      // Back-end may not be available (offline or not started).
      // Mark the app as offline so other parts of the UI can adjust.
      window.__ashashop_offline = true
      window.dispatchEvent(new Event('ashashop-offline'))

      // Fall back to a local demo login so the UX works without the API.
      console.warn('Login API call failed; falling back to local demo login.', err)
      const localUser = { id: 'local', name, mobile, role: 'user', isAdmin: false }
      const localToken = 'local-demo-token'
      setSession({ token: localToken, user: localUser })
      return { token: localToken, user: localUser }
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
