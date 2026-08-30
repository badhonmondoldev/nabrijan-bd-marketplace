'use client';

import { useState } from 'react';
import { BANGLADESH_ADMINISTRATIVE_DATA } from '@/modules/addresses/data';
import { CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [fullName, setFullName] = useState('Sajid Rahman');
  const [phone, setPhone] = useState('+8801900000001');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [detailedAddress, setDetailedAddress] = useState('Flat 4A, Green Peace Apartment, Road 27');
  const [paymentMethod, setPaymentMethod] = useState('BKASH');
  const [loading, setLoading] = useState(false);
  const [successOrders, setSuccessOrders] = useState<any[] | null>(null);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create sample order payload
      const payload = {
        items: [
          {
            productId: 'demo-p-1',
            quantity: 1,
          },
        ],
        shippingAddress: {
          fullName,
          phone,
          division,
          district,
          upazila,
          detailedAddress,
        },
        paymentMethod,
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      setSuccessOrders(data.orders);
      localStorage.removeItem('nabrijan_cart');
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (successOrders) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-emerald-100 text-emerald-800 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h1>
        <p className="text-xs text-slate-600">
          Your order has been split and sent to the respective verified Bangladesh merchants for packing and shipment.
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2 max-w-md mx-auto text-left font-mono">
          <div className="font-bold text-slate-800 font-sans border-b pb-2">Order Summary ({successOrders.length} Order Records):</div>
          {successOrders.map((o) => (
            <div key={o.id} className="flex justify-between">
              <span>#{o.orderNumber}</span>
              <span className="font-bold text-emerald-700">৳{o.totalAmount} ({o.paymentMethod})</span>
            </div>
          ))}
        </div>

        <a href="/account" className="inline-block bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl">
          View Orders in Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-slate-900 mb-6">Secure Order Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl flex items-center space-x-2 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Address Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>1. Delivery Address (Bangladesh)</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number (+880)</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Division</label>
              <select value={division} onChange={(e) => setDivision(e.target.value)} className="w-full px-2 py-2 border rounded-lg">
                {BANGLADESH_ADMINISTRATIVE_DATA.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">District</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Upazila / Thana</label>
              <input type="text" value={upazila} onChange={(e) => setUpazila(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Detailed Street Address</label>
            <textarea rows={2} required value={detailedAddress} onChange={(e) => setDetailedAddress(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>2. Payment Option</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-3 border rounded-xl font-bold text-xs text-left transition ${
                  paymentMethod === 'BKASH' ? 'border-pink-600 bg-pink-50 text-pink-900' : 'border-slate-200'
                }`}
              >
                bKash Mobile Payment
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-3 border rounded-xl font-bold text-xs text-left transition ${
                  paymentMethod === 'NAGAD' ? 'border-orange-600 bg-orange-50 text-orange-900' : 'border-slate-200'
                }`}
              >
                Nagad Mobile Payment
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`p-3 border rounded-xl font-bold text-xs text-left transition ${
                  paymentMethod === 'CASH_ON_DELIVERY' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-200'
                }`}
              >
                Cash on Delivery (COD)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('WALLET')}
                className={`p-3 border rounded-xl font-bold text-xs text-left transition ${
                  paymentMethod === 'WALLET' ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-slate-200'
                }`}
              >
                Nabrijan User Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Complete Order Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit space-y-4 shadow-sm text-xs">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Order Confirmation</h2>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-slate-900">৳11,490</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee ({division})</span>
              <span className="font-bold text-slate-900">৳{division === 'Dhaka' ? 60 : 120}</span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between items-baseline font-bold text-sm text-slate-900">
            <span>Payable Amount</span>
            <span className="text-xl font-black text-emerald-700">৳11,550</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow text-xs flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Processing Order...' : 'Confirm & Place Order'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
