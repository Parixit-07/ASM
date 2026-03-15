import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  const handleProceed = () => {
    if (items.length === 0) return
    navigate('/checkout')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Your cart</h1>
        <p className="mt-2 text-sm text-slate-600">Review items and proceed to checkout.</p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-medium text-slate-700">Your cart is empty</p>
            <p className="mt-2 text-sm text-slate-500">Add items to get started.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-slate-900">{item.name}</h2>
                  <p className="mt-1 text-xs text-slate-500">{item.brand}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">₹{item.price.toLocaleString()}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold hover:bg-slate-50"
                      onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold hover:bg-slate-50"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-sm font-medium text-rose-600 hover:text-rose-700"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Shipping and taxes calculated at checkout.
        </p>
        <button
          type="button"
          onClick={handleProceed}
          disabled={items.length === 0}
          className="mt-6 w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Proceed to checkout
        </button>
      </aside>
    </div>
  )
}
