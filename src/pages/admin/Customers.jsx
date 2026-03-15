import { useEffect, useState } from 'react'
import { fetchCustomers } from '../../api/users'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchCustomers()
      .then((data) => setCustomers(data.users))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        Loading customers...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        {error.message || 'Unable to load customers.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
        <p className="mt-2 text-sm text-slate-600">View registered customers and recent signups.</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Mobile</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.email || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.mobile || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
