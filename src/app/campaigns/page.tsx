'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export default function FlashSaleCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (res.ok) setCampaigns(data.campaigns || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading active flash sales & mega campaigns...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-xs">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-900 via-amber-900 to-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-red-600/50 border border-red-500/30 text-amber-300 font-bold px-3 py-1 rounded-full text-[11px]">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Limited Time Mega Flash Sale</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">Super Savings & Flash Deals</h1>
          <p className="text-slate-300 max-w-lg">
            Exclusive discounts on top Bangladeshi brands, electronics, fashion, and home essentials. Stock is limited!
          </p>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="font-bold text-sm text-slate-800">No Active Flash Sales Right Now</div>
          <p className="text-xs text-slate-500">Check back soon for our next scheduled Bangladeshi seasonal mega sale event!</p>
          <Link href="/products" className="inline-block bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl shadow">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-3 rounded-2xl text-red-600">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{camp.title}</h2>
                    <div className="text-xs text-slate-500 font-semibold uppercase">{camp.type} EVENT</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-200 px-4 py-2 rounded-2xl font-mono font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Ends: {new Date(camp.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Products Showcase */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {camp.products?.map((cp: any) => {
                  const p = cp.product;
                  if (!p) return null;

                  return (
                    <div key={cp.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:shadow-md transition">
                      <img src={p.images?.[0]?.url || 'https://picsum.photos/300/300'} alt={p.title} className="w-full h-40 object-cover rounded-xl bg-white" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400">{p.store?.name}</div>
                        <h3 className="font-bold text-slate-900 truncate">{p.title}</h3>
                      </div>
                      <div className="flex justify-between items-baseline pt-1">
                        <div>
                          <div className="text-base font-black text-red-600">৳{cp.promoPrice}</div>
                          <div className="text-[10px] text-slate-400 line-through">৳{p.basePrice}</div>
                        </div>
                        <div className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Only {cp.stockLimit - cp.soldCount} left
                        </div>
                      </div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center block transition"
                      >
                        Buy Deal Now
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
