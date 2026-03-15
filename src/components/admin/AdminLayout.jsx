import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { HiChartBar, HiCube, HiPlusCircle, HiShoppingBag, HiUsers, HiDatabase, HiStar, HiCog, HiLogout } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '', label: 'Dashboard', icon: HiChartBar },
  { to: 'products', label: 'Products', icon: HiCube },
  { to: 'products/new', label: 'Add Product', icon: HiPlusCircle },
  { to: 'orders', label: 'Orders', icon: HiShoppingBag },
  { to: 'customers', label: 'Customers', icon: HiUsers },
  { to: 'inventory', label: 'Inventory', icon: HiDatabase },
  { to: 'reviews', label: 'Reviews', icon: HiStar },
  { to: 'settings', label: 'Settings', icon: HiCog },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center text-lg font-semibold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Asha Admin</p>
              <p className="text-xs text-slate-500">{user?.name}</p>
            </div>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ''}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="mt-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <HiLogout className="h-5 w-5" />
            Logout
          </button>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Admin Panel</h1>
              <p className="text-sm text-slate-500">Manage products, orders, customers, and settings.</p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-slate-600">{user?.email || ''}</span>
            </div>
          </header>
          <div className="px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
