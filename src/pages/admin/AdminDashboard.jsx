import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  if (!user?.isAdmin) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-rose-800">Access denied</h1>
        <p className="mt-2 text-sm text-rose-700">You need admin permission to view this page.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Admin</h2>
        <nav className="mt-6 flex flex-col gap-2">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 text-sm font-medium ${
                isActive ? 'bg-brand text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 text-sm font-medium ${
                isActive ? 'bg-brand text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Orders
          </NavLink>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
