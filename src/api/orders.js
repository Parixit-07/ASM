import { api, handleApiError } from './api'

const LOCAL_ORDERS_KEY = 'ashashop_local_orders'

const loadLocalOrders = () => {
  try {
    const raw = window.localStorage.getItem(LOCAL_ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveLocalOrders = (orders) => {
  try {
    window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders))
  } catch {
    // ignore
  }
}

const mkOrderId = () => `local-${Date.now()}`

export const placeOrder = async (orderPayload) => {
  if (window.__ashashop_offline) {
    const orders = loadLocalOrders()
    const order = {
      id: mkOrderId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      estimatedDelivery: '3-5 business days',
      subtotal: orderPayload.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shipping: 80,
      total: orderPayload.total,
      items: orderPayload.items,
      address: orderPayload.address,
      paymentMethod: orderPayload.paymentMethod,
    }
    const next = [order, ...orders]
    saveLocalOrders(next)
    return { order }
  }

  try {
    const res = await api.post('/orders', orderPayload)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const fetchOrders = async () => {
  if (window.__ashashop_offline) {
    return { orders: loadLocalOrders() }
  }

  try {
    const res = await api.get('/orders')
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const fetchOrderById = async (id) => {
  if (window.__ashashop_offline) {
    const order = loadLocalOrders().find((o) => o.id === id)
    return { order }
  }

  try {
    const res = await api.get(`/orders/${id}`)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export const updateOrderStatus = async (id, status) => {
  if (window.__ashashop_offline) {
    const orders = loadLocalOrders()
    const next = orders.map((order) => (order.id === id ? { ...order, status } : order))
    saveLocalOrders(next)
    return { order: next.find((o) => o.id === id) }
  }

  try {
    const res = await api.put(`/orders/${id}/status`, { status })
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}
