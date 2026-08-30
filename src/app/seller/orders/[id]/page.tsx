'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Truck, PackageCheck, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export default function SellerOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');
  const [trackingCode, setTrackingCode] = useState('');
  const [courierName, setCourierName] = useState('NABRIJAN_EXPRESS');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/seller/orders`);
      // Fallback query if list API available
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus,
          trackingCode,
          courierName,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Status update failed');

      setMessage(`Order updated to ${newStatus}. Shipment tracking assigned.`);
    } catch (err: any) {
      setError(err.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b">
        <button onClick={() => router.back()} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">Store Order Fulfillment Manager</h1>
          <p className="text-xs text-slate-500">Order ID: #{orderId.slice(0, 8)}</p>
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
        {/* Status Transition Control Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
            <PackageCheck className="w-4 h-4 text-emerald-600" />
            <span>Fulfillment Action</span>
          </h2>

          <form onSubmit={handleUpdateStatus} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white font-bold"
              >
                <option value="CONFIRMED">CONFIRMED (Order Packed)</option>
                <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                <option value="DELIVERED">DELIVERED (Customer Received)</option>
                <option value="CANCELLED">CANCELLED (Store Refund)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Courier Partner</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="NABRIJAN_EXPRESS">Nabrijan Express BD</option>
                <option value="PATHAO">Pathao Courier</option>
                <option value="STEADFAST">Steadfast Courier</option>
                <option value="REDX">RedX Logistics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Courier Tracking Code</label>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="e.g. TRK-98213-BD"
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Internal Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dispatched via Dhaka Express Hub..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow"
            >
              {updating ? 'Updating Order...' : 'Update Order & Dispatch'}
            </button>
          </form>
        </div>

        {/* Customer & Delivery Information */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Customer Delivery Information (Privacy Protected)</span>
            </h2>

            <div className="space-y-1 text-slate-700">
              <div>Customer Name: <strong className="text-slate-900">Sajid Rahman</strong></div>
              <div>Phone Contact: <span className="font-mono text-slate-800">+88019******001</span></div>
              <div>Delivery Address: <span className="text-slate-900 font-medium">Road 27, House 4A, Dhanmondi, Dhaka</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Ordered Products Breakdown</h2>
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
      </div>
    </div>
  );
}
