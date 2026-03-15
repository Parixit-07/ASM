import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { HiShoppingBag, HiUserCircle, HiLogout, HiMenu } from 'react-icons/hi'
import { useState } from 'react'

const categories = [
  'Sewing Machines',
  'Industrial Machines',
  'Mini Sewing Machines',
  'Machine Parts',
  'Sewing Tools',
  'Accessories',
]

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="block lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <HiMenu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-slate-900">Asha</span>
            <span className="text-sm font-medium text-slate-500">Sewing Machine & Repairing</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <HiShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                {totalItems}
              </span>
            ) : null}
          </NavLink>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => navigate('/profile')}
              >
                <HiUserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="ml-2 text-sm text-slate-500 hover:text-slate-700"
                title="Logout"
              >
                <HiLogout className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 ${
                  isActive ? 'bg-slate-100' : ''
                }`
              }
            >
              <HiUserCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Login</span>
            </NavLink>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {categories.map((category) => (
              <NavLink
                key={category}
                to={`/?category=${encodeURIComponent(category)}`}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
                    isActive ? 'bg-slate-100' : ''
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {category}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}

function SearchBar() {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (term) params.set('q', term)
    navigate({ pathname: '/', search: params.toString() })
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for sewing machines, tools, brands..."
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        aria-label="Search products"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-brand-dark"
      >
        Search
      </button>
    </form>
  )
}
