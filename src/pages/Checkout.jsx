import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { placeOrder } from '../api/orders'

const paymentOptions = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card Payment' },
]

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].value)

  const total = useMemo(() => subtotal + 80, [subtotal])

  if (!isAuthenticated) {
    navigate('/login', { state: { from: '/checkout' } })
    return null
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-600">Add items to the cart before checking out.</p>
      </div>
    )
  }

  const handleNext = async () => {
    setError(null)
    if (step === 1) {
      const { fullName, mobile, address: addr, city, state, pincode } = address
      if (!fullName || !mobile || !addr || !city || !state || !pincode) {
        setError('Please fill all required fields.')
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      setLoading(true)
      try {
        const orderPayload = {
          items,
          address,
          paymentMethod,
          total,
        }
        const result = await placeOrder(orderPayload)
        clearCart()
        navigate('/order-confirmation', { state: { order: result.order } })
      } catch (err) {
        setError(err.message || 'Unable to place order')
      } finally {
        setLoading(false)
      }
    }
  }

  const progressLabel = step === 1 ? 'Shipping address' : 'Payment'

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-600">Complete your order in a few easy steps.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{progressLabel}</h2>
            <span className="text-sm text-slate-500">Step {step} of 2</span>
          </div>

          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

          {step === 1 ? (
            <div className="mt-6 space-y-4">
              <Input label="Full name" value={address.fullName} onChange={(value) => setAddress((prev) => ({ ...prev, fullName: value }))} />
              <Input label="Mobile number" value={address.mobile} onChange={(value) => setAddress((prev) => ({ ...prev, mobile: value }))} />
              <Input
                label="Address"
                value={address.address}
                onChange={(value) => setAddress((prev) => ({ ...prev, address: value }))}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="City" value={address.city} onChange={(value) => setAddress((prev) => ({ ...prev, city: value }))} />
                <Input label="State" value={address.state} onChange={(value) => setAddress((prev) => ({ ...prev, state: value }))} />
              </div>
              <Input label="Pincode" value={address.pincode} onChange={(value) => setAddress((prev) => ({ ...prev, pincode: value }))} />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-slate-600">
                Choose a payment method. For demo purposes, payments are simulated.
              </p>
              {paymentOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-brand"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                    className="h-4 w-4 text-brand focus:ring-brand"
                  />
                  <span className="text-sm font-medium text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step === 2 ? (
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="ml-auto rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 1 ? 'Continue to payment' : loading ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </div>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>Subtotal</p>
            <p>₹{subtotal.toLocaleString()}</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
            <p>Estimated delivery</p>
            <p>₹80</p>
          </div>
          <div className="mt-4 flex items-center justify-between text-base font-semibold text-slate-900">
            <p>Total</p>
            <p>₹{total.toLocaleString()}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}

function Input({ label, value, onChange }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
    </label>
  )
}
