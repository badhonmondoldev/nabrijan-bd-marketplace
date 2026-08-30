'use client';

import { useState } from 'react';
import { BANGLADESH_ADMINISTRATIVE_DATA } from '@/modules/addresses/data';
import { CreditCard, Truck, CheckCircle, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { createOwnPayIntent } from '@/lib/ownpay';

export default function CheckoutPage() {
  const [fullName, setFullName] = useState('Sajid Rahman');
  const [phone, setPhone] = useState('+8801900000001');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [detailedAddress, setDetailedAddress] = useState('Flat 4A, Green Peace Apartment, Road 27');
  const [paymentMethod, setPaymentMethod] = useState('OWNPAY_DIRECT');
  const [loading, setLoading] = useState(false);
  const [successOrders, setSuccessOrders] = useState<any[] | null>(null);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create order payload
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

      // 2. Handle OwnPay Direct Gateway Redirect
      if (paymentMethod === 'OWNPAY_DIRECT' || paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') {
        const primaryOrder = data.orders?.[0];
        const intentResult = await createOwnPayIntent({
          orderId: primaryOrder?.id || `ORD-${Date.now()}`,
          amount: primaryOrder?.totalAmount || 11550,
          customerName: fullName,
          customerEmail: 'customer@nabrijan.com',
          customerPhone: phone,
          returnUrl: `${window.location.origin}/checkout/success`,
        });

        if (intentResult.checkoutUrl) {
          window.location.href = intentResult.checkoutUrl;
          return;
        }
      }

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
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-white">Order Placed Successfully!</h1>
        <p className="text-xs text-slate-300">
          Your order has been split and sent to the respective verified Bangladesh merchants for packing and shipment.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 max-w-md mx-auto text-left font-mono">
          <div className="font-bold text-pink-300 font-sans border-b border-slate-800 pb-2">Order Summary ({successOrders.length} Order Records):</div>
          {successOrders.map((o) => (
            <div key={o.id} className="flex justify-between text-slate-300">
              <span>#{o.orderNumber}</span>
              <span className="font-bold text-emerald-400">৳{o.totalAmount} ({o.paymentMethod})</span>
            </div>
          ))}
        </div>

        <a href="/account" className="inline-block bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg hover:brightness-110">
          View Orders in Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-4 h-4 text-pink-400" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <h1 className="text-2xl font-black text-white">Secure Checkout</h1>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Address Form */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
          <h2 className="text-sm font-black text-white pb-2 border-b border-slate-800 flex items-center space-x-2">
            <Truck className="w-4 h-4 text-pink-400" />
            <span>1. Delivery Address (Bangladesh)</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Phone Number (+880)</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Division</label>
              <select value={division} onChange={(e) => setDivision(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-pink-500">
                {BANGLADESH_ADMINISTRATIVE_DATA.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">District</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Upazila / Thana</label>
              <input type="text" value={upazila} onChange={(e) => setUpazila(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Detailed Street Address</label>
            <textarea rows={2} required value={detailedAddress} onChange={(e) => setDetailedAddress(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500" />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h2 className="text-sm font-black text-white flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span>2. Select Payment Gateway</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('OWNPAY_DIRECT')}
                className={`p-4 border rounded-2xl font-bold text-xs text-left transition flex items-center justify-between ${
                  paymentMethod === 'OWNPAY_DIRECT' || paymentMethod === 'BKASH'
                    ? 'border-pink-500 bg-pink-950/60 text-white shadow-lg shadow-pink-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-black text-pink-300 flex items-center space-x-1">
                    <span>OwnPay Direct Gateway</span>
                    <Sparkles className="w-3 h-3 text-pink-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">bKash, Nagad, Rocket, Visa/Mastercard</div>
                </div>
                <span className="text-[10px] font-black bg-pink-950 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full">INSTANT</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`p-4 border rounded-2xl font-bold text-xs text-left transition flex items-center justify-between ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-emerald-500 bg-emerald-950/60 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-black text-emerald-300">Cash on Delivery (COD)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pay after inspecting package</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Complete Order Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit space-y-4 shadow-xl text-xs">
          <h2 className="text-sm font-black text-white pb-2 border-b border-slate-800">Order Confirmation</h2>
          <div className="space-y-2 text-slate-400">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-white">৳11,490</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee ({division})</span>
              <span className="font-bold text-white">৳{division === 'Dhaka' ? 60 : 120}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline font-bold text-sm text-white">
            <span>Payable Amount</span>
            <span className="text-xl font-black text-pink-400">৳11,550</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-pink-500/25 hover:brightness-110 text-xs flex items-center justify-center space-x-2 transition"
          >
            <span>{loading ? 'Initiating Gateway...' : 'Confirm & Proceed to Payment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
