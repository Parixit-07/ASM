import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { products as sampleProducts } from '../data/products'
import { useFetchProducts } from '../hooks/useFetchProducts'

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'popularity', label: 'Popularity' },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: remoteProducts, loading, error } = useFetchProducts()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    rating: Number(searchParams.get('rating') || 0),
    minPrice: Number(searchParams.get('minPrice') || 0),
    maxPrice: Number(searchParams.get('maxPrice') || 0),
    query: searchParams.get('q') || '',
    sort: searchParams.get('sort') || '',
  })

  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (filters.category) nextParams.set('category', filters.category)
    if (filters.brand) nextParams.set('brand', filters.brand)
    if (filters.rating) nextParams.set('rating', String(filters.rating))
    if (filters.minPrice) nextParams.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice) nextParams.set('maxPrice', String(filters.maxPrice))
    if (filters.query) nextParams.set('q', filters.query)
    if (filters.sort) nextParams.set('sort', filters.sort)
    setSearchParams(nextParams, { replace: true })
  }, [filters, setSearchParams])

  const products = useMemo(() => {
    const list = remoteProducts ?? sampleProducts

    return list
      .filter((product) => {
        if (filters.category && product.category !== filters.category) return false
        if (filters.brand && product.brand !== filters.brand) return false
        if (filters.rating && Math.floor(product.rating) < filters.rating) return false
        if (filters.minPrice && product.price < filters.minPrice) return false
        if (filters.maxPrice && product.price > filters.maxPrice) return false
        if (filters.query) {
          const q = filters.query.toLowerCase()
          if (!product.name.toLowerCase().includes(q) && !product.description.toLowerCase().includes(q)) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'price_asc':
            return a.price - b.price
          case 'price_desc':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'popularity':
            return b.popularity - a.popularity
          default:
            return 0
        }
      })
  }, [remoteProducts, filters])

  const brands = useMemo(() => {
    const set = new Set(sampleProducts.map((p) => p.brand))
    return Array.from(set)
  }, [])

  const categories = useMemo(() => {
    const set = new Set(sampleProducts.map((p) => p.category))
    return Array.from(set)
  }, [])

  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      rating: 0,
      minPrice: 0,
      maxPrice: 0,
      query: '',
      sort: '',
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <button
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={resetFilters}
            type="button"
          >
            Clear
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-700">Category</p>
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">Brand</p>
            <select
              value={filters.brand}
              onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">Rating</p>
            <select
              value={filters.rating}
              onChange={(e) => setFilters((prev) => ({ ...prev, rating: Number(e.target.value) }))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              <option value={0}>Any</option>
              <option value={4}>4+ stars</option>
              <option value={3}>3+ stars</option>
              <option value={2}>2+ stars</option>
              <option value={1}>1+ stars</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">Price range</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))}
                placeholder="Min"
                className="w-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                placeholder="Max"
                className="w-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>
        </div>
      </aside>

      <section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Shop all products</h1>
            <p className="mt-1 text-sm text-slate-600">Browse sewing machines, tools, and accessories.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="text-sm text-slate-600">
              {products.length} item{products.length === 1 ? '' : 's'} found
            </span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              <option value="">Sort by</option>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Loading products...
          </div>
        ) : (
          <>
            {error ? (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
                Unable to load products from the server. Displaying local demo products instead.
              </div>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
