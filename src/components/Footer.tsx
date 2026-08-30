import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="bg-emerald-600 text-white font-black text-xl px-3 py-1 rounded-lg inline-block tracking-wider mb-3">
            NABRIJAN MARKET
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Bangladesh-first multi-vendor marketplace connecting authentic merchants, customers, affiliates, and suppliers across 64 districts.
          </p>
          <div className="text-xs font-bold text-amber-400">
            Tagline: Buy. Sell. Earn. Grow.
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Marketplace Hubs</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/products" className="hover:text-emerald-400">All Products Catalog</Link></li>
            <li><Link href="/stores" className="hover:text-emerald-400">Verified BD Vendors</Link></li>
            <li><Link href="/affiliate" className="hover:text-emerald-400">Affiliate Partner Program</Link></li>
            <li><Link href="/seller/register" className="hover:text-emerald-400">Become a Seller</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Customer Support</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/account" className="hover:text-emerald-400">My Unified Account</Link></li>
            <li><Link href="/orders" className="hover:text-emerald-400">Order Tracking</Link></li>
            <li><Link href="/returns-policy" className="hover:text-emerald-400">Return Policy & Guarantee</Link></li>
            <li><Link href="/support" className="hover:text-emerald-400">Live Support Chat & Help</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Payment Methods</h4>
          <p className="text-xs text-slate-400 mb-3">
            Supported Bangladesh Payment Gateways & Cash on Delivery:
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="bg-pink-600 text-white px-2.5 py-1 rounded">bKash</span>
            <span className="bg-orange-600 text-white px-2.5 py-1 rounded">Nagad</span>
            <span className="bg-purple-600 text-white px-2.5 py-1 rounded">Rocket</span>
            <span className="bg-emerald-600 text-white px-2.5 py-1 rounded">Cash on Delivery</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 py-4 text-center text-xs text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} NABRIJAN MARKET. All rights reserved. Built with PostgreSQL, TypeScript & Next.js.
      </div>
    </footer>
  );
}
