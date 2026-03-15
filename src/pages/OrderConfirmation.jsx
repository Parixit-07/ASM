import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order

  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true })
    }
  }, [order, navigate])

  if (!order) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Order confirmed</h1>
      <p className="mt-2 text-sm text-slate-600">
        Thank you for your purchase! Your order is being processed and will be delivered shortly.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-5">
          <h2 className="text-sm font-semibold text-slate-700">Order ID</h2>
          <p className="mt-2 text-lg font-semibold text-slate-900">{order.id}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-5">
          <h2 className="text-sm font-semibold text-slate-700">Estimated delivery</h2>
          <p className="mt-2 text-lg font-semibold text-slate-900">{order.estimatedDelivery}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Payment method</span>
            <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
            <span>Shipping address</span>
            <span className="text-right text-sm text-slate-700">
              {order.address.fullName}
              <br />
              {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark"
        >
          Continue shopping
        </button>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          View orders
        </button>
      </div>
    </div>
  )
}
