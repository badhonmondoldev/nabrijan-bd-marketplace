'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewSellerProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState(`SKU-${Date.now().toString().slice(-6)}`);
  const [barcode, setBarcode] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [weightKg, setWeightKg] = useState('0.5');
  const [lengthCm, setLengthCm] = useState('10');
  const [widthCm, setWidthCm] = useState('10');
  const [heightCm, setHeightCm] = useState('5');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Variants list state
  const [variants, setVariants] = useState<any[]>([]);
  const [varName, setVarName] = useState('');
  const [varSku, setVarSku] = useState('');
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addVariant = () => {
    if (!varName || !varPrice) return;
    setVariants([...variants, {
      name: varName,
      sku: varSku || `${sku}-${variants.length + 1}`,
      price: varPrice,
      stockQuantity: varStock || '10',
    }]);
    setVarName('');
    setVarSku('');
    setVarPrice('');
    setVarStock('');
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (isDraft: boolean) => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        description,
        sku,
        barcode,
        basePrice,
        salePrice,
        stockQuantity,
        weightKg,
        lengthCm,
        widthCm,
        heightCm,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
        isDraft,
        images: ['https://picsum.photos/600/600'],
        variants,
      };

      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      router.push('/seller/products');
    } catch (err: any) {
      setError(err.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b">
        <button onClick={() => router.back()} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">Add New Product to Store</h1>
          <p className="text-xs text-slate-500">Provide full product specifications, images, and inventory attributes</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-6 text-xs">
        {/* Basic Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">1. Basic Information</h2>
          <div>
            <label className="block font-semibold mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Walton Primo Smartphone 4GB/64GB"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Full Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide key features, warranty details, and usage instructions..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">2. Pricing & Stock Inventory</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Base Price (BDT)</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="12000"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Sale Price (Optional BDT)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="11490"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Initial Stock Qty</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">SKU Code</label>
              <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">EAN / Barcode (Optional)</label>
              <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="8901234567890" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Weight & Dimensions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">3. Shipping Logistics (Weight & Dimensions)</h2>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold mb-1">Weight (Kg)</label>
              <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Length (Cm)</label>
              <input type="number" value={lengthCm} onChange={(e) => setLengthCm(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Width (Cm)</label>
              <input type="number" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Height (Cm)</label>
              <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Variants Management */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">4. Product Variants (Color, Size, Storage)</h2>
          <div className="grid grid-cols-4 gap-2">
            <input type="text" placeholder="Variant Name (e.g. Red / 64GB)" value={varName} onChange={(e) => setVarName(e.target.value)} className="px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="SKU" value={varSku} onChange={(e) => setVarSku(e.target.value)} className="px-3 py-2 border rounded-lg" />
            <input type="number" placeholder="Price (BDT)" value={varPrice} onChange={(e) => setVarPrice(e.target.value)} className="px-3 py-2 border rounded-lg" />
            <button type="button" onClick={addVariant} className="bg-slate-900 text-white font-bold rounded-lg py-2 flex items-center justify-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Add Variant</span>
            </button>
          </div>

          {variants.length > 0 && (
            <div className="space-y-2 pt-2">
              {variants.map((v, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border">
                  <div>
                    <strong className="text-slate-800">{v.name}</strong> • SKU: {v.sku} • Price: ৳{v.price}
                  </div>
                  <button type="button" onClick={() => removeVariant(i)} className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow"
          >
            {loading ? 'Submitting Product...' : 'Submit Product for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
