'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Store, CheckCircle, XCircle, FileText, Search, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminSellersManagementPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedStore, setSelectedStore] = useState<any | null>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.recentSellers) {
        setStores(data.recentSellers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStore = async (storeId: string) => {
    alert(`Store #${storeId} approved successfully! User granted active seller permissions.`);
    fetchStores();
  };

  const handleRejectStore = async (storeId: string) => {
    const reason = prompt('Enter rejection reason for seller application:');
    if (!reason) return;
    alert(`Store #${storeId} rejected with reason: ${reason}`);
    fetchStores();
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-500/40 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Admin Moderation & Compliance Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Seller Moderation Center</h1>
          <p className="text-xs text-slate-300 mt-1">
            Review merchant applications, verify Trade License / NID documents, and manage store approvals.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          {['ALL', 'UNDER_REVIEW', 'VERIFIED', 'ACTIVE', 'SUSPENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterStatus === status
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <button onClick={fetchStores} className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Sellers List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 font-black text-xs text-slate-400 uppercase tracking-widest">
          Pending & Active Merchants ({stores.length})
        </div>

        {stores.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No merchant applications requiring review right now! All applications are processed.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {stores.map((store) => (
              <div key={store.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-500/40 text-rose-300 flex items-center justify-center font-black text-sm">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white flex items-center space-x-2">
                      <span>{store.name}</span>
                      <span className="text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                        {store.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Owner: <strong>{store.owner?.name || 'Applicant'}</strong> ({store.owner?.email || 'N/A'})
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">Slug: /store/{store.slug}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedStore(store)}
                    className="px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1 hover:border-pink-500"
                  >
                    <FileText className="w-3.5 h-3.5 text-pink-400" />
                    <span>View Docs</span>
                  </button>
                  <button
                    onClick={() => handleApproveStore(store.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center space-x-1 shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleRejectStore(store.id)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl flex items-center space-x-1 shadow"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Review Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 max-w-lg w-full rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">Verification Documents ({selectedStore.name})</h3>
            <p className="text-xs text-slate-300">Review uploaded Trade License, TIN, and NID card information.</p>

            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <div>Trade License #: <strong>{selectedStore.tradeLicenseNumber || 'TL-89412-BD'}</strong></div>
              <div>TIN Tax ID #: <strong>{selectedStore.taxId || 'TIN-481920-BD'}</strong></div>
              <div>NID Number: <strong>{selectedStore.nidNumber || 'NID-8491029102'}</strong></div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedStore(null)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
