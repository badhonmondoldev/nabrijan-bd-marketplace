'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Sparkles, Plus, Trash2, CheckCircle, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';
import MultiImageUploader from '@/components/seller/MultiImageUploader';
import { calculateListingQualityScore } from '@/lib/seller-ai';

export default function AdvancedNewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ELECTRONICS');
  const [basePrice, setBasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sku, setSku] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Product Variants
  const [variants, setVariants] = useState<any[]>([
    { name: 'Black / 8GB / 256GB', sku: 'SKU-BLK-256', price: '', stock: '10' },
  ]);

  const qualityScoreResult = calculateListingQualityScore({
    title,
    description,
    images: images,
    basePrice: Number(basePrice) || 0,
    sku: sku,
    variants: variants,
  });
  const qualityScore = qualityScoreResult.score;

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: `Variant ${variants.length + 1}`, sku: `${sku || 'SKU'}-V${variants.length + 1}`, price: basePrice, stock: '5' },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAiGenerate = async () => {
    if (!title.trim()) {
      alert('Please enter a basic product name first (e.g. Xiaomi Redmi Note 13)');
      return;
    }
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/seller/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category }),
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Product "${title}" with ${variants.length} variants and ${images.length} photos published successfully!`);
    router.push('/seller');
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <Package className="w-4 h-4 text-pink-400" />
            <span>Multi-Variant Catalog Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Create New Listing</h1>
        </div>

        {/* Quality Score Badge */}
        <div className="bg-slate-950 border border-pink-500/30 px-5 py-3 rounded-2xl flex items-center space-x-3 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">AI Listing Quality Score</div>
            <div className={`text-lg font-black ${qualityScore >= 80 ? 'text-emerald-400' : 'text-pink-400'}`}>
              {qualityScore} / 100 ({qualityScore >= 80 ? 'EXCELLENT' : 'NEEDS DETAIL'})
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        {/* Photos Upload Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <MultiImageUploader images={images} onChange={setImages} maxImages={10} />
        </div>

        {/* Basic Details & AI Assistant */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white">Basic Product Details</h3>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isAiGenerating}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow hover:brightness-110 flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiGenerating ? 'AI Generating...' : 'Auto-Enhance with AI'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Xiaomi Redmi Note 13 Pro 5G (Official 1 Year Warranty)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <option value="ELECTRONICS">Smartphones & Electronics</option>
                <option value="FASHION">Fashion & Apparel</option>
                <option value="BEAUTY">Beauty & Cosmetics</option>
                <option value="GROCERY">Grocery & Food</option>
                <option value="HOME">Home & Kitchen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Product Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed specifications, features, and package contents..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Pricing & SKUs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">Pricing & Inventory</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Regular Price (৳)</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="32999"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sale Price (৳)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="29999"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Base Master SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="REDMI-N13-PRO"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Variants Builder */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-pink-400" />
              <span>Multi-Variant Attributes (Colors & Sizes)</span>
            </h3>

            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3.5 py-1.5 bg-slate-800 text-pink-300 border border-pink-500/30 text-xs font-bold rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].name = e.target.value;
                    setVariants(copy);
                  }}
                  placeholder="Variant Name"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />

                <input
                  type="text"
                  value={v.sku}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].sku = e.target.value;
                    setVariants(copy);
                  }}
                  placeholder="SKU Code"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />

                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].stock = e.target.value;
                    setVariants(copy);
                  }}
                  placeholder="Stock Quantity"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const copy = [...variants];
                      copy[i].price = e.target.value;
                      setVariants(copy);
                    }}
                    placeholder="Price override (৳)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(i)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-pink-500/25 hover:brightness-110 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Product to Marketplace Catalog</span>
          </button>
        </div>
      </form>
    </div>
  );
}
