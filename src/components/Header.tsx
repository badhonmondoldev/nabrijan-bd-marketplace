'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Store, User, Search, Shield, LogOut, LayoutDashboard, Share2 } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import { motion } from 'framer-motion';
import { PulseBadge } from './animations/MotionWrappers';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Bar for BD Localization & Announcements */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <span>🇧🇩 Bangladesh Multi-Vendor E-Commerce</span>
            <span className="text-emerald-300">|</span>
            <span className="text-emerald-200">Nationwide Delivery Network</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-amber-300">Tagline: Buy. Sell. Earn. Grow.</span>
            <span>bKash / Nagad / COD Enabled</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-600 text-white font-black text-xl px-3 py-1 rounded-lg tracking-wider shadow-md group-hover:bg-emerald-700 transition-colors"
          >
            NABRIJAN
          </motion.div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">MARKET</span>
            <span className="text-[10px] text-slate-500 font-medium">Buy. Sell. Earn. Grow.</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search Bangladeshi products, stores & wholesale categories..."
            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button className="absolute right-1 top-1 text-white bg-emerald-600 p-1.5 rounded-full hover:bg-emerald-700">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <RoleSwitcher currentRole={user.activeRole} userRoles={user.roles} />

              {/* Dynamic Dashboard Quick Link depending on active role */}
              {user.activeRole === 'SELLER' && (
                <Link
                  href="/seller"
                  className="flex items-center space-x-1 text-xs font-semibold bg-amber-500 text-white px-3 py-1.5 rounded-md hover:bg-amber-600 transition"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden lg:inline">Vendor Panel</span>
                </Link>
              )}

              {user.activeRole === 'AFFILIATE' && (
                <Link
                  href="/affiliate"
                  className="flex items-center space-x-1 text-xs font-semibold bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden lg:inline">Affiliate Hub</span>
                </Link>
              )}

              {(user.activeRole === 'ADMIN' || user.activeRole === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-xs font-semibold bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden lg:inline">Admin Panel</span>
                </Link>
              )}

              <Link
                href="/account"
                className="flex items-center space-x-1 text-slate-700 hover:text-emerald-700 text-xs font-medium px-2 py-1 border border-slate-200 rounded-md"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 p-1 rounded"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-emerald-800 px-3 py-1.5 border border-emerald-600 rounded-md hover:bg-emerald-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold text-white bg-emerald-600 px-3 py-1.5 rounded-md hover:bg-emerald-700 shadow-sm"
              >
                Register
              </Link>
            </div>
          )}

          <Link
            href="/cart"
            className="relative p-2 text-slate-700 hover:text-emerald-700"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
