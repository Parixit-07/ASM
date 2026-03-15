import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ashashop_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Request failed',
      status: error.response.status,
    }
  }
  return { message: error.message || 'Network error', status: 0 }
}
