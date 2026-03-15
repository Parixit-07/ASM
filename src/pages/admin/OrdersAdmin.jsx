import { useEffect, useState } from 'react'
import { fetchOrders, updateOrderStatus } from '../../api/orders'

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchOrders()
      .then((res) => setOrders(res.orders ?? []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        Loading orders…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        {error.message || 'Unable to load orders.'}
      </div>
    )
  }

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    try {
      const { order: updated } = await updateOrderStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
    } catch (err) {
      setError(err)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const toggleDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId))
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-600">No orders yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-2 text-sm text-slate-600">Manage customer orders and update fulfillment status.</p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error.message || 'Something went wrong while updating orders.'}
        </div>
      ) : null}

      <div className="space-y-4">
        {orders.map((order) => {
          const isUpdating = updatingOrderId === order.id
          const isExpanded = expandedOrderId === order.id
          return (
            <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-[240px]">
                  <p className="text-sm font-semibold text-slate-900">Order #{order.id}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() => toggleDetails(order.id)}
                    className="mt-2 text-xs font-medium text-brand hover:underline"
                  >
                    {isExpanded ? 'Hide details' : 'View details'}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-slate-900">₹{order.total.toLocaleString()}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.status === 'shipped'
                        ? 'bg-amber-100 text-amber-700'
                        : order.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={isUpdating}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</p>
                  <p className="text-sm text-slate-700">{order.paymentMethod?.toUpperCase()}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shipping</p>
                  <p className="text-sm text-slate-700">₹{order.shipping.toLocaleString()}</p>
                </div>
              </div>

              {isExpanded ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Shipping Address</p>
                    <p className="mt-2 text-sm text-slate-700">
                      {order.address.fullName}
                      <br />
                      {order.address.address}, {order.address.city}, {order.address.state} {order.address.pincode}
                      <br />
                      {order.address.mobile}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Items</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {order.items.map((item) => (
                        <li key={item.productId} className="flex items-start justify-between">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {isUpdating ? (
                <div className="mt-4 text-xs font-medium text-brand">Updating status…</div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
