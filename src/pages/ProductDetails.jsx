import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { StarRating } from '../components/product/StarRating'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchProductById(id)
      .then((data) => {
        setProduct(data.product)
        setSelectedImage(data.product.images?.[0] || null)
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [id])

  const formattedPrice = useMemo(() => {
    return product ? `₹${product.price.toLocaleString()}` : ''
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }
    addItem(product, quantity)
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
        Loading product details...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
        {error?.message || 'Product not found.'}
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-80 w-full rounded-xl object-cover"
            />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images?.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelectedImage(src)}
                  className={`rounded-xl border p-1 transition hover:border-brand ${
                    selectedImage === src ? 'border-brand' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt="Thumbnail" className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm text-slate-600">Brand: {product.brand}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} size={14} />
                <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.inStock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {product.inStock > 0 ? 'In stock' : 'Out of stock'}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formattedPrice}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                  className="text-xl font-semibold text-slate-700"
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <span className="w-10 text-center text-sm font-semibold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((qty) => Math.min(qty + 1, product.inStock || 99))}
                  className="text-xl font-semibold text-slate-700"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Specifications</h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                {product.shortSpecs?.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
