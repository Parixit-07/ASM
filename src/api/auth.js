import { api, handleApiError } from './api'

export const login = async ({ name, mobile }) => {
  try {
    const res = await api.post('/auth/login', { name, mobile })
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const adminLogin = async ({ email, password }) => {
  try {
    const res = await api.post('/admin/login', { email, password })
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const getProfile = async () => {
  try {
    const res = await api.get('/auth/profile')
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const logout = () => {
  localStorage.removeItem('ashashop_token')
}
