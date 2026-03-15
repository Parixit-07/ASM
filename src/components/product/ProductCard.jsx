import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { StarRating } from './StarRating'

export function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative overflow-hidden bg-slate-50">
        {product.tags?.includes('best-seller') && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
            Best seller
          </span>
        )}
        {product.tags?.includes('on-sale') && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
            On sale
          </span>
        )}

        <Link to={`/product/${product.id}`} className="block p-4">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="mx-auto h-44 w-full object-contain transition duration-200 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/product/${product.id}`} className="text-left">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
          <p className="mt-1 text-xs text-slate-600">{product.brand}</p>
        </Link>
        <p className="text-sm text-slate-600">{product.shortSpecs?.slice(0, 2).join(' · ')}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold text-slate-900">₹{product.price.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <StarRating rating={product.rating} />
              <span className="text-xs text-slate-500">({product.reviews})</span>
            </div>
          </div>
          <button
            onClick={() => addItem(product, 1)}
            className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white shadow hover:bg-brand-dark"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
