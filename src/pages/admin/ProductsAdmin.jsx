import { useEffect, useMemo, useState } from 'react'
import { fetchProducts, deleteProduct, updateProduct, createProduct } from '../../api/products'

const emptyProduct = {
  name: '',
  brand: '',
  category: '',
  price: 0,
  rating: 0,
  reviews: 0,
  popularity: 0,
  inStock: 0,
  shortSpecs: [],
  description: '',
  images: [],
  tags: [],
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formValues, setFormValues] = useState(emptyProduct)

  useEffect(() => {
    setLoading(true)
    fetchProducts()
      .then((res) => setProducts(res.products || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  const startEdit = (product) => {
    setEditing(product.id)
    setFormValues({ ...product })
  }

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (editing) {
        const updated = await updateProduct(editing, formValues)
        setProducts((prev) => prev.map((p) => (p.id === editing ? updated.product : p)))
      } else {
        const created = await createProduct(formValues)
        setProducts((prev) => [created.product, ...prev])
      }
      setEditing(null)
      setFormValues(emptyProduct)
    } catch (err) {
      setError(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err)
    }
  }

  const categories = useMemo(() => ['Sewing Machines', 'Industrial Machines', 'Mini Sewing Machines', 'Machine Parts', 'Sewing Tools', 'Accessories'], [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Product management</h1>
        <p className="mt-2 text-sm text-slate-600">Add new products or update existing listings.</p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error.message || 'Something went wrong.'}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Edit product' : 'Add new product'}</h2>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input
                value={formValues.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Brand
              <input
                value={formValues.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Category
              <select
                value={formValues.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Price
              <input
                type="number"
                value={formValues.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Stock quantity
              <input
                type="number"
                value={formValues.inStock}
                onChange={(e) => handleChange('inStock', Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Rating
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={formValues.rating}
                onChange={(e) => handleChange('rating', Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Short specifications (comma separated)
            <input
              value={formValues.shortSpecs.join(', ')}
              onChange={(e) => handleChange('shortSpecs', e.target.value.split(',').map((value) => value.trim()))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Images (comma separated URLs)
            <input
              value={formValues.images.join(', ')}
              onChange={(e) => handleChange('images', e.target.value.split(',').map((value) => value.trim()))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              value={formValues.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark"
            >
              {editing ? 'Save product' : 'Add product'}
            </button>
            {editing ? (
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => {
                  setEditing(null)
                  setFormValues(emptyProduct)
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Products</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-600">Loading products…</p>
        ) : (
          <div className="mt-4 space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-600">
                    {product.category} · ₹{product.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/10"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
