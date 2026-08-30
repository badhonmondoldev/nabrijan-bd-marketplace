'use client';

import { useState } from 'react';
import { ShoppingCart, Check, ShieldCheck } from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stockQuantity: number;
}

interface ProductVariantSelectorProps {
  basePrice: number;
  salePrice?: number | null;
  baseStock: number;
  baseSku: string;
  variants: Variant[];
  title: string;
}

export default function ProductVariantSelector({
  basePrice,
  salePrice,
  baseStock,
  baseSku,
  variants,
  title,
}: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length > 0 ? variants[0] : null
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const currentPrice = selectedVariant ? (selectedVariant.salePrice || selectedVariant.price) : (salePrice || basePrice);
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : baseStock;
  const currentSku = selectedVariant ? selectedVariant.sku : baseSku;

  const handleAddToCart = () => {
    const cartItem = {
      productId: selectedVariant?.id || 'base',
      title: `${title} ${selectedVariant ? `(${selectedVariant.name})` : ''}`,
      price: currentPrice,
      quantity,
      image: 'https://picsum.photos/400/400',
    };

    const existingCart = JSON.parse(localStorage.getItem('nabrijan_cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('nabrijan_cart', JSON.stringify(existingCart));

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-baseline space-x-3">
        <span className="text-3xl font-black text-emerald-700">৳{currentPrice}</span>
        {salePrice && !selectedVariant && (
          <span className="text-sm text-slate-400 line-through">৳{basePrice}</span>
        )}
        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold ml-auto">
          bKash / Nagad / COD Ready
        </span>
      </div>

      {/* Dynamic SKU & Stock Status */}
      <div className="flex items-center space-x-3 text-xs text-slate-500">
        <span>SKU: <span className="font-mono text-slate-800 font-semibold">{currentSku}</span></span>
        <span>•</span>
        <span className={`font-semibold ${currentStock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
          {currentStock > 0 ? `In Stock (${currentStock} items available)` : 'Out of Stock'}
        </span>
      </div>

      {/* Variants Selector */}
      {variants.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">Select Variant:</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {v.name} (৳{v.salePrice || v.price})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Picker & Add to Cart */}
      <div className="flex items-center space-x-4 pt-2">
        <div className="flex items-center space-x-2 border rounded-xl p-1 bg-white">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-lg bg-slate-100 font-bold hover:bg-slate-200"
          >
            -
          </button>
          <span className="text-xs font-bold px-2">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-lg bg-slate-100 font-bold hover:bg-slate-200"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={currentStock <= 0}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl text-xs shadow flex items-center justify-center space-x-2 transition"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
