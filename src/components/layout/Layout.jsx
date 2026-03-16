import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { useEffect, useState } from 'react'

export function Layout() {
  const [offline, setOffline] = useState(Boolean(window.__ashashop_offline))

  useEffect(() => {
    const onOffline = () => setOffline(true)
    window.addEventListener('ashashop-offline', onOffline)
    return () => {
      window.removeEventListener('ashashop-offline', onOffline)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {offline ? (
        <div className="border-b border-rose-200 bg-rose-50 text-center text-sm text-rose-700">
          Offline/demo mode enabled — the app is using local demo data.
        </div>
      ) : null}
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
