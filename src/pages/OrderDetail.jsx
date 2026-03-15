import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchOrderById } from '../api/orders'

export default function OrderDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (order) return
    setLoading(true)
    fetchOrderById(id)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [id, order])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        Loading order details...
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        {error?.message || 'Order not found.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to orders
        </button>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Order #{order.id}</h1>
        <p className="mt-1 text-sm text-slate-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order status</h2>
        <p className="mt-2 text-sm text-slate-600">{order.status}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Items</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Delivery details</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-600">Address</p>
            <p className="mt-1 text-sm text-slate-700">
              {order.address.fullName}
              <br />
              {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Payment</p>
            <p className="mt-1 text-sm text-slate-700">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{order.shipping.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>₹{order.total.toLocaleString()}</span>
        </div>
      </section>
    </div>
  )
}
