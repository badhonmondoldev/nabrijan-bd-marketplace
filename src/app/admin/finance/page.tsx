'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Wallet, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminFinancePage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/finance');
      const json = await res.json();
      if (res.ok) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Finance & Master Ledger Control</h1>
            <p className="text-xs text-slate-400">Monitor wallet ledger balances, payout requests, and platform commission intake</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500 py-12 text-center">Loading master ledger financial data...</div>
      ) : (
        <div className="space-y-6 text-xs">
          {/* Overview Metric */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-500 font-bold">Total Customer & Merchant Wallet Holdings</div>
              <div className="text-3xl font-black text-emerald-700">৳{data?.totalWalletBalances || 0}</div>
            </div>
            <Wallet className="w-8 h-8 text-emerald-600" />
          </div>

          {/* Payout Requests Manager */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Seller Payout Withdrawal Requests</h2>
            {data?.payoutRequests?.length === 0 ? (
              <div className="text-slate-400 py-6 text-center">No seller payout requests recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b font-bold text-slate-700">
                      <th className="p-3">Payout ID</th>
                      <th className="p-3">Store / User</th>
                      <th className="p-3">Requested Amount</th>
                      <th className="p-3">Payout Method</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {data?.payoutRequests?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold">#{p.id.slice(0, 8)}</td>
                        <td className="p-3 font-semibold">{p.wallet?.store?.name || p.wallet?.user?.name}</td>
                        <td className="p-3 font-black text-emerald-700">৳{p.amount}</td>
                        <td className="p-3 font-bold">{p.payoutMethod}</td>
                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg">
                            Approve Payout
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
