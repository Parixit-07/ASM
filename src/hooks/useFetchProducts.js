import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products'
import { products as localProducts } from '../data/products'

export function useFetchProducts() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetchProducts()
      .then((res) => {
        if (!mounted) return
        setData(res?.products ?? localProducts)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err)
        setData(localProducts)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}
