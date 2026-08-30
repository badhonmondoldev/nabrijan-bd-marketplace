import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-16 border-t border-pink-500/30 text-sm max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-full">
        <div>
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black text-xl px-3.5 py-1 rounded-xl inline-flex items-center space-x-1.5 tracking-wider mb-3 shadow-lg shadow-pink-500/20">
            <span>NABRIJAN MARKET</span>
            <Sparkles className="w-4 h-4 text-pink-200" />
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Bangladesh-first multi-vendor marketplace featuring virtual anime guide NABI, verified BD merchants, and 64-district delivery network.
          </p>
          <div className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
            Tagline: Buy. Sell. Earn. Grow.
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-sm">Marketplace Hubs</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/products" className="hover:text-pink-400 transition">All Products Catalog</Link></li>
            <li><Link href="/stores" className="hover:text-pink-400 transition">Verified BD Vendors</Link></li>
            <li><Link href="/affiliate" className="hover:text-pink-400 transition">Affiliate Partner Program</Link></li>
            <li><Link href="/seller/register" className="hover:text-pink-400 transition">Become a Seller</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-sm">Customer Support</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/account" className="hover:text-pink-400 transition">My Unified Account</Link></li>
            <li><Link href="/orders" className="hover:text-pink-400 transition">Order Tracking</Link></li>
            <li><Link href="/returns-policy" className="hover:text-pink-400 transition">Return Policy & Guarantee</Link></li>
            <li><Link href="/support" className="hover:text-pink-400 transition">Live Support Chat & Help</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-sm">Payment Gateways</h4>
          <p className="text-xs text-slate-400 mb-3">
            Supported Bangladesh Payment Gateways & Cash on Delivery:
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-extrabold">
            <span className="bg-pink-600 text-white px-2.5 py-1 rounded-lg shadow-md">bKash</span>
            <span className="bg-rose-600 text-white px-2.5 py-1 rounded-lg shadow-md">Nagad</span>
            <span className="bg-purple-600 text-white px-2.5 py-1 rounded-lg shadow-md">Rocket</span>
            <span className="bg-fuchsia-600 text-white px-2.5 py-1 rounded-lg shadow-md">Cash on Delivery</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 py-4 text-center text-xs text-slate-400 border-t border-slate-800">
        © {new Date().getFullYear()} NABRIJAN MARKET. All rights reserved. Powered by Next.js & Cyberpunk Pink Theme.
      </div>
    </footer>
  );
}
