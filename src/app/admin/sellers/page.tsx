'use client';

import { useState, useEffect } from 'react';
import { Store, ShieldCheck, XCircle, CheckCircle2, AlertCircle, FileText, Lock } from 'lucide-react';

export default function AdminSellersPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('UNDER_REVIEW');
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchStores();
  }, [statusFilter]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sellers?status=${statusFilter}`);
      const data = await res.json();
      if (res.ok) setStores(data.stores || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewStore = async (storeId: string, decisionStatus: string) => {
    setActionMessage('');
    try {
      const res = await fetch(`/api/admin/sellers/${storeId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decisionStatus,
          rejectionReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Review failed');

      setActionMessage(`Store decision updated to ${decisionStatus}!`);
      setSelectedStore(null);
      fetchStores();
    } catch (err: any) {
      alert(err.message || 'Review failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Store className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Seller Onboarding & Verification Desk</h1>
            <p className="text-xs text-slate-400">Inspect merchant NID, Trade License, and approve or reject store applications</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {['UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition uppercase ${
                statusFilter === st ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Stores List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="text-xs text-slate-500 py-12 text-center">Loading seller applications...</div>
        ) : stores.length === 0 ? (
          <div className="text-xs text-slate-500 py-12 text-center border border-dashed rounded-xl">
            No store applications under status &quot;{statusFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Store Name & Slug</th>
                  <th className="p-3">Owner Contact</th>
                  <th className="p-3">Business Profile</th>
                  <th className="p-3">Legal Verification Data</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">/store/{s.slug}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{s.owner?.name}</div>
                      <div className="text-slate-500">{s.owner?.email}</div>
                      <div className="font-mono text-[11px] text-slate-500">{s.owner?.phone}</div>
                    </td>
                    <td className="p-3 font-semibold">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {s.businessType || 'INDIVIDUAL'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5 text-[11px]">
                        <div>Trade Lic: <span className="font-mono font-bold">{s.tradeLicenseNumber || 'N/A'}</span></div>
                        <div>TIN / NID: <span className="font-mono font-bold">{s.nidNumber || s.taxId || 'N/A'}</span></div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedStore(s)}
                        className="bg-slate-900 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow"
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <h2 className="text-sm font-bold text-slate-900">Verification Review: {selectedStore.name}</h2>
              <button onClick={() => setSelectedStore(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2 text-slate-700 bg-slate-50 p-4 rounded-xl">
              <div>Store Name: <strong className="text-slate-900">{selectedStore.name}</strong></div>
              <div>Merchant Owner: <span className="font-bold text-slate-900">{selectedStore.owner?.name}</span> ({selectedStore.owner?.email})</div>
              <div>Business Entity: <span className="font-mono font-bold text-emerald-800">{selectedStore.businessType}</span></div>
              <div>Trade License #: <span className="font-mono font-bold">{selectedStore.tradeLicenseNumber || 'N/A'}</span></div>
              <div>Tax ID / NID #: <span className="font-mono font-bold">{selectedStore.nidNumber || selectedStore.taxId || 'N/A'}</span></div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Rejection Reason (if rejecting)</label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Invalid NID document or trade license expired..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => handleReviewStore(selectedStore.id, 'VERIFIED')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow"
              >
                Approve Store (VERIFIED)
              </button>
              <button
                onClick={() => handleReviewStore(selectedStore.id, 'REJECTED')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleReviewStore(selectedStore.id, 'SUSPENDED')}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl shadow"
              >
                Suspend Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
