import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetchOrders } from '../hooks/useFetchOrders'

export default function Orders() {
  const { orders, loading, error } = useFetchOrders()
  const navigate = useNavigate()

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        Loading your orders...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        {error.message || 'Unable to load your orders.'}
      </div>
    )
  }

  if (sortedOrders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">No orders yet</h2>
        <p className="mt-2 text-sm text-slate-600">Your recent orders will appear here.</p>
      </div>
    )
  }

  const formatStatus = (status) => {
    return status?.replace('-', ' ') || 'Pending'
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">My orders</h1>
        <p className="mt-2 text-sm text-slate-600">View your order history and track status.</p>
      </header>

      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <div
            key={order.id}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            onClick={() => navigate(`/orders/${order.id}`, { state: { order } })}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Order #{order.id}</h2>
                <p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-700'
                    : order.status === 'shipped'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {formatStatus(order.status)}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Items</p>
                <p className="text-sm text-slate-700">{order.items.length} items</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Total</p>
                <p className="text-sm font-semibold text-slate-900">₹{order.total.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Delivery</p>
                <p className="text-sm text-slate-700">{order.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
