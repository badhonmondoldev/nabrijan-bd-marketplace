'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Store,
  PackageCheck,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Layers,
} from 'lucide-react';

export default function EnterpriseAdminDashboard() {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [recentSellers, setRecentSellers] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Access denied');

      setMetrics(data.metrics);
      setRecentSellers(data.recentSellers || []);
      setRecentProducts(data.recentProducts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load enterprise dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading Enterprise Admin Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-xs text-red-600 font-bold bg-red-50 rounded-2xl m-4 border border-red-200">{error}</div>;

  const m = metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-3 rounded-xl shadow">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Enterprise Admin Control Center</h1>
            <p className="text-xs text-slate-400">NABRIJAN MARKET — Platform Governance & Master Ledger</p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link href="/admin/sellers" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
            Sellers ({m.pendingSellers})
          </Link>
          <Link href="/admin/products" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
            Moderation ({m.pendingProducts})
          </Link>
          <Link href="/admin/users" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg shadow">
            User Manager
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Gross GMV Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">৳{m.gmv || 0}</div>
          <div className="text-[10px] text-slate-400">Total Customer Purchases</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Platform Revenue</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">৳{m.platformRevenue || 0}</div>
          <div className="text-[10px] text-slate-400">Commission Intake (5%)</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Total Platform Users</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{m.totalUsers || 0}</div>
          <div className="text-[10px] text-slate-400">Buyers, Sellers, Affiliates</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Verified BD Stores</span>
            <Store className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{m.activeSellers || 0}</div>
          <div className="text-[10px] text-amber-600 font-bold">{m.pendingSellers || 0} Applications Pending</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Pending Moderation</span>
            <PackageCheck className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{m.pendingProducts || 0}</div>
          <div className="text-[10px] text-slate-400">Product Approval Queue</div>
        </div>
      </div>

      {/* Secondary Alert Metric Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <Link href="/admin/disputes" className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-100 transition">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <div>
              <div className="font-bold text-amber-900">Active Disputes</div>
              <div className="text-slate-600">{m.openDisputesCount || 0} Open Buyer Claims</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-700" />
        </Link>

        <Link href="/admin/finance" className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between hover:bg-emerald-100 transition">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <div>
              <div className="font-bold text-emerald-900">Payout Requests</div>
              <div className="text-slate-600">{m.pendingPayoutsCount || 0} Seller Payouts Pending</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700" />
        </Link>

        <Link href="/admin/audit-logs" className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between hover:bg-indigo-100 transition">
          <div className="flex items-center space-x-3">
            <FileCheck className="w-5 h-5 text-indigo-700" />
            <div>
              <div className="font-bold text-indigo-900">System Audit Trail</div>
              <div className="text-slate-600">Track Governance Log</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-700" />
        </Link>
      </div>

      {/* Moderation Queues Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Pending Seller Verification Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <h2 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Pending Store Applications ({recentSellers.length})</span>
            </h2>
            <Link href="/admin/sellers" className="text-emerald-700 font-bold hover:underline">
              View All
            </Link>
          </div>

          {recentSellers.length === 0 ? (
            <div className="text-slate-400 py-6 text-center">No seller applications pending verification.</div>
          ) : (
            <div className="divide-y">
              {recentSellers.map((s) => (
                <div key={s.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-slate-500 text-[11px]">Owner: {s.owner?.name} ({s.owner?.email})</div>
                  </div>
                  <Link href={`/admin/sellers`} className="bg-slate-900 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg">
                    Review Application
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Product Moderation Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <h2 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <PackageCheck className="w-4 h-4 text-amber-600" />
              <span>Pending Product Moderation Queue ({recentProducts.length})</span>
            </h2>
            <Link href="/admin/products" className="text-emerald-700 font-bold hover:underline">
              View All
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="text-slate-400 py-6 text-center">No products waiting for moderation review.</div>
          ) : (
            <div className="divide-y">
              {recentProducts.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img src={p.images?.[0]?.url || 'https://picsum.photos/100/100'} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                    <div>
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="text-slate-500 text-[11px]">Store: {p.store?.name} • ৳{p.basePrice}</div>
                    </div>
                  </div>
                  <Link href="/admin/products" className="bg-slate-900 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg">
                    Moderate
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
