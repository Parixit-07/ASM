import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Asha Sewing Machine</h3>
          <p className="mt-3 text-sm text-slate-600">
            123 Tailor Lane, Craftsville
            <br />
            +91 98765 43210
            <br />
            support@ashasewing.com
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Shop All Products</li>
            <li>Categories</li>
            <li>Best Sellers</li>
            <li>New Arrivals</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Support</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Returns</li>
            <li>Shipping</li>
            <li>Order Tracking</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Stay connected</h3>
          <p className="mt-3 text-sm text-slate-600">Follow us on social media for updates and offers.</p>
          <div className="mt-3 flex items-center gap-3 text-slate-600">
            <a href="#" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="#" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
              <FaWhatsapp className="h-5 w-5" />
            </a>
            <a href="#" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
              <FaEnvelope className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Asha Sewing Machine & Repairing. All rights reserved.
      </div>
    </footer>
  )
}
