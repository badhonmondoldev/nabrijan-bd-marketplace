'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Truck, ShieldCheck, Clock, XCircle, CheckCircle2 } from 'lucide-react';

export default function CustomerOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/account/orders')
      .then(() => {})
      .catch(() => {});
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order? Reserved stock will be released.')) return;
    setCancelling(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by buyer via account portal' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancellation failed');

      setMessage('Order cancelled successfully! Stock released back to store.');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b">
        <button onClick={() => router.back()} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">Purchase Order Details</h1>
          <p className="text-xs text-slate-500">Order Reference: #{orderId.slice(0, 8)}</p>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Courier & Shipping Status</span>
            </h2>
            <div className="space-y-1 text-slate-700">
              <div>Courier Provider: <strong className="text-slate-900">Nabrijan Express BD</strong></div>
              <div>Tracking Code: <span className="font-mono font-bold text-emerald-700">TRK-98213-BD</span></div>
              <div>Estimated Delivery: <span className="font-semibold text-slate-900">Within 48 Hours</span></div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Purchased Items</h2>
            <div className="divide-y">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">Walton Primo GH10 Smartphone 4GB/64GB</div>
                  <div className="text-slate-500">Qty: 1 • Unit Price: ৳11,490</div>
                </div>
                <div className="font-black text-emerald-700">৳11,490</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Order Summary</h2>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-slate-900">৳11,490</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900">৳60</span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-sm text-slate-900">
            <span>Paid Amount</span>
            <span className="text-lg font-black text-emerald-700">৳11,550</span>
          </div>

          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-xl border border-red-200 flex items-center justify-center space-x-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>{cancelling ? 'Cancelling...' : 'Cancel Order & Release Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
