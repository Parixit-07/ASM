import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">My profile</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your account and view your activity.</p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">Name</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{user?.name || '-'}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">Mobile</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{user?.mobile || '-'}</p>
          </div>
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
        <nav className="mt-4 flex flex-col gap-3">
          <Link
            to="/orders"
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            My orders
          </Link>
          <Link
            to="/checkout"
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Saved addresses
          </Link>
        </nav>
      </aside>
    </div>
  )
}
