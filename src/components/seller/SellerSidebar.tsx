'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Warehouse,
  Wallet,
  TrendingUp,
  Store,
  Award,
  MessageSquare,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Users,
  Tag,
  Megaphone,
  Sparkles,
} from 'lucide-react';

const SELLER_NAV_ITEMS = [
  { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { name: 'Orders', href: '/seller/orders', icon: PackageCheck },
  { name: 'Products Catalog', href: '/seller/products', icon: ShoppingBag },
  { name: 'Inventory & Stock', href: '/seller/inventory', icon: Warehouse },
  { name: 'Wallet & Payouts', href: '/seller/finance', icon: Wallet },
  { name: 'Store Analytics', href: '/seller/analytics', icon: TrendingUp },
  { name: 'Store Profile', href: '/seller/store', icon: Store },
  { name: 'Performance', href: '/seller/performance', icon: Award },
  { name: 'Buyer Messages', href: '/seller/messages', icon: MessageSquare },
  { name: 'Coupons & Promos', href: '/seller/coupons', icon: Tag },
  { name: 'Ad Campaigns', href: '/seller/advertising', icon: Megaphone },
  { name: 'Team & Staff', href: '/seller/team', icon: Users },
  { name: 'Violations & Appeals', href: '/seller/violations', icon: AlertTriangle },
  { name: 'Support Tickets', href: '/seller/support', icon: HelpCircle },
  { name: 'Learning Hub', href: '/seller/learning', icon: BookOpen },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-pink-500/30 min-h-screen p-4 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-6">
        {/* Seller Center Header Mark */}
        <div className="px-3 py-2 bg-gradient-to-r from-pink-950 to-slate-950 border border-pink-500/40 rounded-2xl flex items-center space-x-2.5 shadow-lg">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white shadow">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-black text-white uppercase tracking-wider">SELLER CENTER</span>
              <Sparkles className="w-3 h-3 text-pink-400" />
            </div>
            <span className="text-[10px] text-pink-300 font-semibold">Vendor Workspace</span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-1">
          {SELLER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="pt-4 border-t border-slate-800 text-center">
        <span className="text-[10px] text-slate-400 font-medium">NABRIJAN Vendor Suite v2.0</span>
      </div>
    </aside>
  );
}
