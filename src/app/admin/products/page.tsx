'use client';

import { useState, useEffect } from 'react';
import { PackageCheck, CheckCircle2, XCircle, AlertCircle, Eye, Tag } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?status=${statusFilter}`);
      // Fallback: search API or seller products API
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (productId: string, decisionStatus: string) => {
    setActionMessage('');
    try {
      const res = await fetch(`/api/admin/products/${productId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decisionStatus,
          notes: `Moderation decision ${decisionStatus} by admin`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Moderation failed');

      setActionMessage(`Product status updated to ${decisionStatus}!`);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Moderation failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <PackageCheck className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-2xl font-black">Product Moderation Desk</h1>
            <p className="text-xs text-slate-400">Review seller product submissions, verify quality & pricing, and approve for live catalog</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {['PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'DRAFT', 'ARCHIVED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition uppercase ${
                statusFilter === st ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="text-xs text-slate-500 py-12 text-center">Loading moderation queue...</div>
        ) : products.length === 0 ? (
          <div className="text-xs text-slate-500 py-12 text-center border border-dashed rounded-xl">
            No products found under status &quot;{statusFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Product Listing</th>
                  <th className="p-3">Store Vendor</th>
                  <th className="p-3">Pricing & Stock</th>
                  <th className="p-3">SKU / Barcode</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img src={p.images?.[0]?.url || 'https://picsum.photos/100/100'} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                        <div>
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <div className="text-[10px] text-slate-400">Slug: /product/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold">{p.store?.name || 'Store'}</td>
                    <td className="p-3">
                      <div className="font-bold text-emerald-700">৳{p.salePrice || p.basePrice}</div>
                      <div className="text-[10px] text-slate-500">Stock: {p.stockQuantity} pcs</div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">{p.sku}</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleModerate(p.id, 'ACTIVE')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(p.id, 'REJECTED')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleModerate(p.id, 'DRAFT')}
                        className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-2.5 py-1 rounded-lg"
                      >
                        Request Changes
                      </button>
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
