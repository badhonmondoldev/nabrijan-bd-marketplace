'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, ArrowUpRight, BarChart2 } from 'lucide-react';

export default function SellerAnalyticsPage() {
  const [range, setRange] = useState('30d');
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/analytics?range=${range}`);
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const m = analytics?.metrics || {
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    returnRatePercent: '0.0',
    conversionRatePercent: '3.4',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <BarChart2 className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Store Analytics & GMV Insights</h1>
            <p className="text-xs text-slate-400">Track financial growth, conversion rates, and return metrics</p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {['7d', '30d', '90d', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg transition uppercase ${
                range === r ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500 py-12 text-center">Calculating store metrics...</div>
      ) : (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Total GMV Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">৳{m.totalSales}</div>
              <div className="text-[10px] text-slate-400">Selected Timeframe</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{m.totalOrders}</div>
              <div className="text-[10px] text-slate-400">Completed & In Transit</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Average Order Value</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">৳{m.avgOrderValue}</div>
              <div className="text-[10px] text-slate-400">Per Customer Transaction</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Return Claim Rate</span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              <div className="text-2xl font-black text-amber-600">{m.returnRatePercent}%</div>
              <div className="text-[10px] text-slate-400">Dispute & Return Ratio</div>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b">Top Performing Store Listings</h2>
            {analytics?.topProducts?.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-6">No product analytics recorded.</div>
            ) : (
              <div className="divide-y text-xs">
                {analytics?.topProducts?.map((p: any) => (
                  <div key={p.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img src={p.images?.[0]?.url || 'https://picsum.photos/100/100'} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                      <div>
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</div>
                      </div>
                    </div>
                    <div className="text-right font-black text-emerald-700">
                      ৳{p.salePrice || p.basePrice}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
