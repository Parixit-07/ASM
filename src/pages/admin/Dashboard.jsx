import { useEffect, useState } from 'react'
import { fetchAdminStats } from '../../api/admin'
import { StarRating } from '../../components/product/StarRating'

const statCards = [
  { key: 'totalProducts', label: 'Total products', icon: '📦', color: 'bg-indigo-500' },
  { key: 'totalOrders', label: 'Total orders', icon: '🛒', color: 'bg-emerald-500' },
  { key: 'pendingOrders', label: 'Pending orders', icon: '⏳', color: 'bg-amber-500' },
  { key: 'completedOrders', label: 'Completed orders', icon: '✅', color: 'bg-sky-500' },
  { key: 'totalCustomers', label: 'Customers', icon: '👥', color: 'bg-fuchsia-500' },
  { key: 'revenue', label: 'Total revenue', icon: '💰', color: 'bg-rose-500' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchAdminStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        {error.message || 'Unable to load dashboard.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {card.key === 'revenue'
                    ? `₹${Number(stats[card.key] || 0).toLocaleString()}`
                    : (stats[card.key] ?? 0)}
                </p>
              </div>
              <div className={`${card.color} grid h-12 w-12 place-items-center rounded-xl text-white`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
            <span className="text-sm text-slate-500">Latest 5</span>
          </header>
          <div className="mt-4 space-y-3">
            {stats.recentOrders?.map((order) => (
              <div key={order.orderId} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Order #{order.orderId}</p>
                <p className="mt-1 text-xs text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">₹{order.total.toLocaleString()}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Low stock products</h2>
            <span className="text-sm text-slate-500">Under 5 units</span>
          </header>
          <div className="mt-4 space-y-3">
            {stats.lowStockProducts?.length ? (
              stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-600">Stock: {product.inStock}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">₹{product.price.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No low stock items.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Top selling products</h2>
          <span className="text-sm text-slate-500">By quantity sold</span>
        </header>
        <div className="mt-4 space-y-3">
          {stats.topSelling?.length ? (
            stats.topSelling.map((product) => (
              <div key={product._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={product.rating} size={12} />
                      <span className="text-xs text-slate-500">{product.quantitySold} sold</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900">₹{product.price.toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No sales data yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
