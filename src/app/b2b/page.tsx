'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Package, ShieldCheck, ArrowRight, FileText, CheckCircle2, Truck } from 'lucide-react';

export default function B2bWholesalePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchB2bProducts();
  }, []);

  const fetchB2bProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/search?isWholesale=true');
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-xs">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 font-bold px-3 py-1 rounded-full text-[11px]">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Bangladesh B2B & Wholesale Commerce Hub</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">Direct Factory & Bulk Wholesale Supply</h1>
          <p className="text-slate-300 leading-relaxed">
            Source directly from verified Bangladeshi manufacturers and wholesalers. Benefit from tiered volume pricing, custom RFQ quotations, and guaranteed lead times.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/b2b/rfq"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl shadow transition"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Request for Quote (RFQ)</span>
            </Link>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-3 w-full md:w-auto">
          <div className="font-bold text-amber-300 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Verified B2B Suppliers</span>
          </div>
          <ul className="space-y-2 text-slate-300 text-[11px]">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Business Tax IDs (BIN/TIN)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tiered Volume Wholesale Discounts</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Structured RFQ & Escrow Terms</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Wholesale Catalog Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Featured Bulk & Wholesale Products</span>
          </h2>
          <span className="text-slate-500 text-xs">Direct Factory Pricing</span>
        </div>

        {loading ? (
          <div className="text-slate-500 py-12 text-center">Loading B2B catalog...</div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            No wholesale products listed yet. Create a custom RFQ to request factory pricing!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 hover:shadow-md transition">
                <img
                  src={p.images?.[0]?.url || 'https://picsum.photos/300/300'}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-xl bg-slate-50"
                />
                <div>
                  <div className="text-[10px] font-bold text-emerald-800">{p.store?.name || 'Verified Supplier'}</div>
                  <h3 className="font-bold text-slate-900 truncate">{p.title}</h3>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl text-[10px] space-y-0.5 border border-amber-200">
                  <div className="font-bold text-amber-900">MOQ: {p.moq || 10} units</div>
                  <div className="text-amber-800">Tier Price: ৳{p.salePrice || p.basePrice} / unit</div>
                </div>
                <Link
                  href={`/product/${p.slug}`}
                  className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center block transition"
                >
                  View Wholesale Tiers
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
