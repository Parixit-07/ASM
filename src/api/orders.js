import { api, handleApiError } from './api'

export const placeOrder = async (orderPayload) => {
  try {
    const res = await api.post('/orders', orderPayload)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const fetchOrders = async () => {
  try {
    const res = await api.get('/orders')
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const fetchOrderById = async (id) => {
  try {
    const res = await api.get(`/orders/${id}`)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await api.put(`/orders/${id}/status`, { status })
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}
