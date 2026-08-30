'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2, Calendar, DollarSign, Percent } from 'lucide-react';

export default function SellerCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (res.ok) setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          type,
          discountValue,
          minOrderValue,
          maxDiscount,
          usageLimit,
          endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Creation failed');

      setMessage(`Coupon "${code.toUpperCase()}" created successfully!`);
      setCode('');
      setDiscountValue('');
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-xs">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Tag className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-2xl font-black">Promotional Coupons & Voucher Manager</h1>
            <p className="text-xs text-slate-400">Configure discount vouchers, minimum order thresholds, and usage caps</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Creation Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Create Discount Voucher</span>
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. EID500"
                className="w-full px-3 py-2 border rounded-lg uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Discount Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="PERCENTAGE">Percentage Discount (%)</option>
                <option value="FIXED_DISCOUNT">Fixed Amount Discount (BDT)</option>
                <option value="FREE_SHIPPING">Free Shipping Waiver</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Discount Value</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={type === 'PERCENTAGE' ? 'e.g. 10 (%)' : 'e.g. 200 (BDT)'}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Min Order Amount (Optional)</label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                placeholder="e.g. 1000 (BDT)"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Max Discount Cap (Optional)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="e.g. 500 (BDT)"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Usage Limit Count</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="e.g. 100 uses"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Expiration Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow"
            >
              {saving ? 'Creating Voucher...' : 'Publish Coupon'}
            </button>
          </form>
        </div>

        {/* Coupons Table */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Active Store Coupons ({coupons.length})</h2>

          {loading ? (
            <div className="text-slate-500 py-12 text-center">Loading vouchers...</div>
          ) : coupons.length === 0 ? (
            <div className="text-slate-400 py-12 text-center border border-dashed rounded-xl">No active store coupons found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-700">
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Discount Rule</th>
                    <th className="p-3">Thresholds</th>
                    <th className="p-3">Usage Count</th>
                    <th className="p-3">Expires On</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-800 text-sm">{c.code}</td>
                      <td className="p-3 font-semibold">
                        {c.type === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`}
                      </td>
                      <td className="p-3 text-[11px] text-slate-500">
                        Min: ৳{c.minOrderValue || 0} {c.maxDiscount ? `• Max: ৳${c.maxDiscount}` : ''}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {c.usedCount} / {c.usageLimit || '∞'}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {new Date(c.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
