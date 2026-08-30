'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Eye, MousePointer, DollarSign, Plus, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function SellerAdvertisingPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('SPONSORED_PRODUCT');
  const [budget, setBudget] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/advertising');
      const json = await res.json();
      if (res.ok) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/seller/advertising', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, type, budget }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Campaign creation failed');

      setMessage('Ad promotion campaign launched successfully!');
      setProductId('');
      setBudget('');
      fetchAds();
    } catch (err: any) {
      alert(err.message || 'Campaign creation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-xs">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Megaphone className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-2xl font-black">Seller Sponsored Advertising Desk</h1>
            <p className="text-xs text-slate-400">Promote your products in search results and homepage showcases with transparent badging</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-12 text-center">Loading advertising campaign metrics...</div>
      ) : (
        <div className="space-y-6">
          {/* Ad Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Ad Impressions</span>
                <Eye className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{data?.metrics?.totalImpressions || 0}</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Ad Clicks</span>
                <MousePointer className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{data?.metrics?.totalClicks || 0}</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Click-Through (CTR)</span>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{data?.metrics?.averageCtr || 0}%</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
              <div className="text-slate-500 font-bold flex items-center justify-between">
                <span>Total Ad Spend</span>
                <DollarSign className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl font-black text-emerald-700">৳{data?.metrics?.totalSpend || 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Campaign Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Launch Sponsored Campaign</span>
              </h2>

              <form onSubmit={handleCreateAd} className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1">Target Product ID</label>
                  <input
                    type="text"
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter Product ID to promote..."
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Campaign Promotion Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="SPONSORED_PRODUCT">Sponsored Product Badge</option>
                    <option value="SEARCH_PROMOTION">Search Rank Boost</option>
                    <option value="HOMEPAGE_PROMOTION">Homepage Hero Feature</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Daily / Campaign Budget (BDT)</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 500 (BDT)"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow"
                >
                  {saving ? 'Launching Campaign...' : 'Publish Promotion'}
                </button>
              </form>
            </div>

            {/* Campaign Table */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Active Store Ad Campaigns ({data?.campaigns?.length || 0})</h2>

              {data?.campaigns?.length === 0 ? (
                <div className="text-slate-400 py-12 text-center border border-dashed rounded-xl">No active ad campaigns launched yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b font-bold text-slate-700">
                        <th className="p-3">Promoted Product</th>
                        <th className="p-3">Ad Type</th>
                        <th className="p-3">Budget / Spent</th>
                        <th className="p-3">Impressions / Clicks</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {data?.campaigns?.map((c: any) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{c.product?.title || 'Product'}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold">৳{c.product?.salePrice || c.product?.basePrice}</div>
                          </td>
                          <td className="p-3">
                            <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              {c.type}
                            </span>
                          </td>
                          <td className="p-3 font-semibold">
                            ৳{c.spent} / <span className="text-slate-500">৳{c.budget}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{c.impressions} Views</div>
                            <div className="text-[10px] text-slate-500">{c.clicks} Clicks</div>
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              {c.isActive ? 'RUNNING' : 'PAUSED'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
