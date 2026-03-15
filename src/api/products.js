import { api, handleApiError } from './api'

export const fetchProducts = async (params = {}) => {
  try {
    const res = await api.get('/products', { params })
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const fetchProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const createProduct = async (payload) => {
  try {
    const res = await api.post('/admin/products', payload)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const updateProduct = async (id, payload) => {
  try {
    const res = await api.put(`/admin/products/${id}`, payload)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/admin/products/${id}`)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}
