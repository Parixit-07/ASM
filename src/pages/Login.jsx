import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const normalizedMobile = mobile.replace(/\D/g, '')

    if (!trimmedName) {
      setError('Please enter your name.')
      return
    }

    if (!/^[0-9]{10}$/.test(normalizedMobile)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    setError(null)
    setLoading(true)
    try {
      await login({ name: trimmedName, mobile: normalizedMobile })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Avoid redirecting during render.
  // The effect will run once after mount if the user is already authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Login to your account</h1>
      <p className="mt-2 text-sm text-slate-600">Use your name and mobile number to continue.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Mobile number</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            placeholder="10-digit number"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Continue'}
        </button>
      </form>

      <div className="mt-6 text-xs text-slate-500">
        This is a demo login flow. You will receive an OTP (simulated) after submitting.
      </div>
    </div>
  )
}
