'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Store, User, Search, Shield, LogOut, Share2, Sparkles } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import { motion } from 'framer-motion';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-pink-500/30 shadow-lg shadow-pink-950/30 max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-4 max-w-full">
        {/* Modern Pink Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black text-xl px-3.5 py-1.5 rounded-xl tracking-wider shadow-lg shadow-pink-500/30 flex items-center space-x-1.5"
          >
            <span>NABRIJAN</span>
            <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400 uppercase tracking-widest">
              MARKET
            </span>
            <span className="text-[9px] text-pink-300/80 font-medium">Buy. Sell. Earn. Grow.</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search Bangladeshi products, stores & categories..."
            className="w-full pl-4 pr-10 py-2 bg-slate-900/80 border border-pink-500/30 rounded-full text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition shadow-inner"
          />
          <button className="absolute right-1 top-1 text-white bg-gradient-to-r from-pink-500 to-rose-600 p-1.5 rounded-full hover:from-pink-600 hover:to-rose-700 shadow-md transition">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <RoleSwitcher currentRole={user.activeRole} userRoles={user.roles} />

              {/* Dynamic Dashboard Link */}
              {user.activeRole === 'SELLER' && (
                <Link
                  href="/seller"
                  className="flex items-center space-x-1 text-xs font-semibold bg-amber-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-amber-600 transition shadow"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Vendor</span>
                </Link>
              )}

              {user.activeRole === 'AFFILIATE' && (
                <Link
                  href="/affiliate"
                  className="flex items-center space-x-1 text-xs font-semibold bg-purple-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-purple-700 transition shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Affiliate</span>
                </Link>
              )}

              {(user.activeRole === 'ADMIN' || user.activeRole === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-xs font-semibold bg-rose-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-rose-700 transition shadow"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}

              <Link
                href="/account"
                className="flex items-center space-x-1 text-slate-200 hover:text-pink-400 text-xs font-medium px-2.5 py-1.5 border border-pink-500/30 rounded-lg bg-slate-900/60"
              >
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-xs font-bold text-pink-300 px-3 py-1.5 border border-pink-500/40 rounded-lg hover:bg-pink-500/10 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-3 py-1.5 rounded-lg hover:brightness-110 shadow-md shadow-pink-500/20 transition"
              >
                Register
              </Link>
            </div>
          )}

          <Link
            href="/cart"
            className="relative p-2 text-slate-300 hover:text-pink-400 transition"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 text-pink-300" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
