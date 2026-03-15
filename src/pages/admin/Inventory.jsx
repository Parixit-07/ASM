import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../../api/products'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchProducts()
      .then((data) => setProducts(data.products ?? []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  const lowStock = useMemo(() => products.filter((p) => p.inStock <= 5), [products])
  const outOfStock = useMemo(() => products.filter((p) => p.inStock === 0), [products])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        Loading inventory...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        {error.message || 'Unable to load inventory.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Inventory</h1>
        <p className="mt-2 text-sm text-slate-600">Track stock levels and manage reorders.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Low stock</h2>
          <p className="mt-1 text-sm text-slate-600">Products with 5 or fewer units remaining.</p>
          <div className="mt-4 space-y-3">
            {lowStock.length ? (
              lowStock.map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-600">Stock: {product.inStock}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">₹{product.price.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No low stock items</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Out of stock</h2>
          <p className="mt-1 text-sm text-slate-600">Products currently not available.</p>
          <div className="mt-4 space-y-3">
            {outOfStock.length ? (
              outOfStock.map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-600">Category: {product.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Out</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No out of stock items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
