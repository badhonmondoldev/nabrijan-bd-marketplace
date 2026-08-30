'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Award, AlertCircle, CheckCircle2, UserX, RotateCcw } from 'lucide-react';

export default function AdminAffiliatesPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRiskQueue();
  }, []);

  const fetchRiskQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/affiliates/risk');
      const json = await res.json();
      if (res.ok) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (commissionId: string | null, affiliateId: string | null, action: string) => {
    setMessage('');
    try {
      const res = await fetch('/api/admin/affiliates/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionId, affiliateId, action, notes: `Action ${action} executed by admin` }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Action failed');

      setMessage(`Affiliate risk decision executed: ${action}`);
      fetchRiskQueue();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-xs">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-2xl font-black">Affiliate Risk Control & Fraud Queue</h1>
            <p className="text-xs text-slate-400">Inspect self-purchase signals, velocity anomalies, and manage referral governance</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-12 text-center">Fetching affiliate risk signals...</div>
      ) : (
        <div className="space-y-6">
          {/* Flagged Risk Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Flagged Risk Queue ({data?.flaggedCommissions?.length || 0})</span>
            </h2>

            {data?.flaggedCommissions?.length === 0 ? (
              <div className="text-slate-400 py-8 text-center border border-dashed rounded-xl">
                No high or medium risk commissions flagged.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b font-bold text-slate-700">
                      <th className="p-3">Affiliate Partner</th>
                      <th className="p-3">Referred Order</th>
                      <th className="p-3">Commission Amount</th>
                      <th className="p-3">Risk Assessment</th>
                      <th className="p-3 text-right">Governance Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {data?.flaggedCommissions?.map((fc: any) => (
                      <tr key={fc.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{fc.affiliate?.user?.name}</div>
                          <div className="text-[10px] text-slate-500">{fc.affiliate?.user?.email}</div>
                          <div className="font-mono text-[10px] text-amber-700">Code: {fc.affiliate?.referralCode}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-mono font-bold">#{fc.orderId?.slice(0, 8)}</div>
                          <div className="text-[10px] text-slate-500">Order Amount: ৳{fc.order?.totalAmount}</div>
                          {fc.affiliate?.userId === fc.order?.buyerId && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              Self-Purchase Signal Detected
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-black text-emerald-700">৳{fc.amount}</td>
                        <td className="p-3">
                          <span className={`font-bold text-[10px] px-2 py-0.5 rounded uppercase ${
                            fc.riskScore === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {fc.riskScore} RISK
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleAction(fc.id, null, 'CLEAR_RISK')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg"
                          >
                            Clear Risk
                          </button>
                          <button
                            onClick={() => handleAction(fc.id, null, 'REVERSE_COMMISSION')}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-lg"
                          >
                            Reverse Commission
                          </button>
                          <button
                            onClick={() => handleAction(null, fc.affiliateId, 'SUSPEND_AFFILIATE')}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg"
                          >
                            Suspend Partner
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
