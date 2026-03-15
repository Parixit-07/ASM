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
