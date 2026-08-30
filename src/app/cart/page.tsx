'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Load local cart state or sample cart
    const savedCart = localStorage.getItem('nabrijan_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {}
    } else {
      // Default demo cart item if empty
      setCartItems([
        {
          productId: 'demo-p-1',
          title: 'Walton Primo GH10 Smartphone 4GB/64GB',
          price: 11490,
          quantity: 1,
          storeName: 'Dhaka Tech Plaza',
          image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03',
        },
      ]);
    }
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cartItems];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCartItems(updated);
    localStorage.setItem('nabrijan_cart', JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem('nabrijan_cart', JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center space-x-2">
        <ShoppingCart className="w-6 h-6 text-emerald-600" />
        <span>Shopping Cart ({cartItems.length} items)</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
          Your shopping cart is currently empty.
          <div className="mt-4">
            <Link href="/products" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg">
              Explore Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded w-fit mb-1">
                    {item.storeName || 'Verified Merchant'}
                  </div>
                  <h3 className="font-bold text-slate-800 text-xs truncate">{item.title}</h3>
                  <div className="text-sm font-black text-emerald-700 mt-1">৳{item.price}</div>
                </div>

                {/* Quantity Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(idx, -1)}
                    className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(idx, 1)}
                    className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(idx)}
                  className="text-slate-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit space-y-4 shadow-sm text-xs">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Order Summary</h2>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping (BD)</span>
                <span className="font-bold text-slate-900">৳60 - ৳120</span>
              </div>
            </div>

            <div className="border-t pt-3 flex justify-between items-baseline font-bold text-sm text-slate-900">
              <span>Estimated Total</span>
              <span className="text-lg font-black text-emerald-700">৳{subtotal}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow flex items-center justify-center space-x-2 text-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Server price verification & fast courier dispatch</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
