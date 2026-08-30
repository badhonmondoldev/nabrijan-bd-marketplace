'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'ALL' ? '/api/seller/products' : `/api/seller/products?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this product?')) return;
    try {
      const res = await fetch(`/api/seller/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Product archived successfully.');
        fetchProducts();
      }
    } catch (e) {}
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Store Products Catalog</h1>
            <p className="text-xs text-slate-400">Manage listings, variants, prices, and stock inventory</p>
          </div>
        </div>

        <Link
          href="/seller/products/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl">
          {message}
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs shadow-sm">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['ALL', 'ACTIVE', 'PENDING_REVIEW', 'DRAFT', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === st ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border rounded-lg"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500 border border-dashed rounded-xl">
            No products found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {filteredProducts.map((p) => {
                  const img = p.images?.[0]?.url || 'https://picsum.photos/100/100';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img src={img} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                            <div className="text-[10px] text-slate-400">{p.category?.name || 'General'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-semibold">{p.sku}</td>
                      <td className="p-3 font-black text-emerald-700">৳{p.salePrice || p.basePrice}</td>
                      <td className={`p-3 font-bold ${p.stockQuantity <= 10 ? 'text-amber-600' : 'text-slate-800'}`}>
                        {p.stockQuantity} pcs
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/seller/products/${p.id}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-lg"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleArchive(p.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-lg"
                            title="Archive Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
