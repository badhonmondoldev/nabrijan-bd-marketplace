'use client';

import { useState, useEffect } from 'react';
import { Store, Save, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SellerStoreSettingsPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [businessType, setBusinessType] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await fetch('/api/seller/store');
      const data = await res.json();
      if (res.ok && data.store) {
        const s = data.store;
        setName(s.name || '');
        setSlug(s.slug || '');
        setDescription(s.description || '');
        setLogo(s.logo || '');
        setBanner(s.banner || '');
        setBkashNumber(s.bkashNumber || '');
        setNagadNumber(s.nagadNumber || '');
        setBankName(s.bankName || '');
        setBankAccountNo(s.bankAccountNo || '');
        setBusinessType(s.businessType || 'INDIVIDUAL');
      }
    } catch (e) {
      setError('Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        name,
        description,
        logo,
        banner,
        bkashNumber,
        nagadNumber,
        bankName,
        bankAccountNo,
      };

      const res = await fetch('/api/seller/store', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      setMessage('Store profile and payment settings updated!');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading store settings...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Store className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Store Profile & Payment Settings</h1>
            <p className="text-xs text-slate-400">Customize store branding, logo, banner, and settlement payout accounts</p>
          </div>
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

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Branding Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Store Branding & Customization</h2>
          <div>
            <label className="block font-semibold mb-1">Store Display Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Store Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Logo Image URL</label>
              <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Banner Image URL</label>
              <input type="text" value={banner} onChange={(e) => setBanner(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Financial Payout Account */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Settlement Payout Accounts</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">bKash Merchant Account Number</label>
              <input type="text" value={bkashNumber} onChange={(e) => setBkashNumber(e.target.value)} placeholder="+8801700000000" className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Nagad Merchant Account Number</label>
              <input type="text" value={nagadNumber} onChange={(e) => setNagadNumber(e.target.value)} placeholder="+8801800000000" className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Bank Name</label>
              <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Islami Bank Bangladesh Ltd." className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Bank Account Number</label>
              <input type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} placeholder="2050123456789" className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
          </div>
        </div>

        {/* Locked Verification Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Verified Identity Data (Locked)</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Business Entity Type: <strong className="text-slate-800">{businessType}</strong>. Modifications to NID or Trade License require re-verification by Nabrijan Admin.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Settings...' : 'Save Store Profile Settings'}</span>
        </button>
      </form>
    </div>
  );
}
