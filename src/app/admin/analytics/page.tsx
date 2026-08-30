'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, ShoppingBag, Store, RotateCcw } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBI();
  }, []);

  const fetchBI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (res.ok) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-xs">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <div>
            <h1 className="text-2xl font-black">Executive Business Intelligence & GMV Analytics</h1>
            <p className="text-xs text-slate-400">Macro GMV trends, marketplace commission intake, refund rates, and vendor growth insights</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500 py-12 text-center">Loading Executive BI report...</div>
      ) : (
        <div className="space-y-6">
          {/* Executive Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Gross GMV Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">৳{data?.bi?.gmv || 0}</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Commission Net Income</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">৳{data?.bi?.platformCommission || 0}</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Total Orders Processed</span>
                <ShoppingBag className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{data?.bi?.totalOrdersCount || 0}</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Return & Refund Rate</span>
                <RotateCcw className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-700">{data?.bi?.refundRate || 0}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Stores */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Top Performing BD Verified Stores</span>
              </h2>

              <div className="divide-y">
                {data?.topStores?.map((s: any) => (
                  <div key={s.id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-slate-500 text-[11px]">{s._count?.products || 0} active products in catalog</div>
                    </div>
                    <div className="font-mono font-bold text-emerald-700">{s._count?.orders || 0} orders</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Top Grossing Products</span>
              </h2>

              <div className="divide-y">
                {data?.topProducts?.map((p: any) => (
                  <div key={p.id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="text-slate-500 text-[11px]">In Stock: {p.stockQuantity} pcs</div>
                    </div>
                    <div className="font-bold text-emerald-700">৳{p.salePrice || p.basePrice}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
