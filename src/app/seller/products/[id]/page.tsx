'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditSellerProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/seller/products/${productId}`);
      const data = await res.json();
      if (res.ok && data.product) {
        const p = data.product;
        setTitle(p.title);
        setDescription(p.description);
        setSku(p.sku);
        setBasePrice(p.basePrice.toString());
        setSalePrice(p.salePrice ? p.salePrice.toString() : '');
        setStockQuantity(p.stockQuantity.toString());
        setStatus(p.status);
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (e) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        title,
        description,
        sku,
        basePrice,
        salePrice,
        stockQuantity,
        status,
      };

      const res = await fetch(`/api/seller/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      setMessage('Product updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading product...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b">
        <button onClick={() => router.back()} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">Edit Product Specification</h1>
          <p className="text-xs text-slate-500">Update pricing, inventory, and status</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-semibold mb-1">Product Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold mb-1">Base Price (BDT)</label>
            <input type="number" required value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sale Price (BDT)</label>
            <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Stock Quantity</label>
            <input type="number" required value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-1">SKU</label>
            <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
              <option value="ACTIVE">ACTIVE</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING_REVIEW">PENDING REVIEW</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Product Changes'}</span>
        </button>
      </form>
    </div>
  );
}
