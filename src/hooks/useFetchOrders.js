import { useEffect, useState } from 'react'
import { fetchOrders } from '../api/orders'

export function useFetchOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    // If we're already in offline/demo mode, avoid calling the API.
    if (window.__ashashop_offline) {
      const stored = window.localStorage.getItem('ashashop_local_orders')
      const localOrders = stored ? JSON.parse(stored) : []
      if (active) {
        setOrders(localOrders)
        setLoading(false)
      }
      return () => {
        active = false
      }
    }

    fetchOrders()
      .then((res) => {
        if (!active) return
        setOrders(res.orders ?? [])
      })
      .catch((err) => {
        if (!active) return
        setError(err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { orders, loading, error }
}
