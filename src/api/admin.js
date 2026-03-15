import { api, handleApiError } from './api'

export const fetchAdminStats = async () => {
  try {
    const res = await api.get('/admin/stats')
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}
