import { api, handleApiError } from './api'

export const fetchCustomers = async () => {
  try {
    const res = await api.get('/users')
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}
