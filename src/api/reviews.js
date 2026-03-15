import { api, handleApiError } from './api'

export const fetchReviews = async () => {
  try {
    const res = await api.get('/reviews')
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const updateReview = async (id, approved) => {
  try {
    const res = await api.put(`/reviews/${id}`, { approved })
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const deleteReview = async (id) => {
  try {
    const res = await api.delete(`/reviews/${id}`)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}
