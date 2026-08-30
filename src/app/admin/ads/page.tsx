'use client';

import { useState, useEffect } from 'react';
import { Megaphone, CheckCircle2, Pause, Play, AlertCircle } from 'lucide-react';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/advertising');
      const data = await res.json();
      if (res.ok) setAds(data.campaigns || []);
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
          <Megaphone className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-2xl font-black">Platform Advertising Control & Moderation</h1>
            <p className="text-xs text-slate-400">Monitor sponsored campaigns across all stores and ensure transparent badging compliance</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="text-slate-500 py-12 text-center">Loading platform ad campaigns...</div>
        ) : ads.length === 0 ? (
          <div className="text-slate-400 py-12 text-center border border-dashed rounded-xl">No merchant ad campaigns active.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Store & Product</th>
                  <th className="p-3">Ad Type</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Impressions & Clicks</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{ad.product?.title}</td>
                    <td className="p-3 font-semibold">{ad.type}</td>
                    <td className="p-3 font-black text-emerald-700">৳{ad.budget}</td>
                    <td className="p-3 text-slate-600">{ad.impressions} views • {ad.clicks} clicks</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {ad.isActive ? 'RUNNING' : 'PAUSED'}
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
  );
}
