import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ashashop_settings'

const defaultSettings = {
  shopName: 'Asha Sewing Machine & Repairing',
  address: '123 Tailor Lane, Craftsville',
  phone: '+91 98765 43210',
  email: 'support@ashasewing.com',
  logo: '',
}

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSettings(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">Update shop information and contact details.</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Shop name"
            value={settings.shopName}
            onChange={(value) => setSettings((prev) => ({ ...prev, shopName: value }))}
          />
          <Field
            label="Address"
            value={settings.address}
            onChange={(value) => setSettings((prev) => ({ ...prev, address: value }))}
          />
          <Field
            label="Contact number"
            value={settings.phone}
            onChange={(value) => setSettings((prev) => ({ ...prev, phone: value }))}
          />
          <Field
            label="Email"
            value={settings.email}
            onChange={(value) => setSettings((prev) => ({ ...prev, email: value }))}
          />
          <Field
            label="Logo URL"
            value={settings.logo}
            onChange={(value) => setSettings((prev) => ({ ...prev, logo: value }))}
          />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark"
          >
            Save settings
          </button>
          {saved ? <span className="text-sm text-emerald-600">Saved!</span> : null}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
    </label>
  )
}
