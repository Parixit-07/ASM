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
        console.warn('Failed to load products from API, falling back to local data.', err)
        window.__ashashop_offline = true
        window.dispatchEvent(new Event('ashashop-offline'))
        setError({ message: 'Unable to load products from the server.' })
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
