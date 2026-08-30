'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Send, FileText } from 'lucide-react';

export default function SellerViolationsPage() {
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [selectedViolationId, setSelectedViolationId] = useState<string | null>(null);
  const [appealReason, setAppealReason] = useState('');

  const sampleViolations = [
    {
      id: 'VIOL-9012',
      category: 'MISLEADING_LISTING',
      severity: 'LOW',
      title: 'Missing Warranty Information in Title',
      reason: 'Product title indicated official warranty without stating warranty duration in description.',
      penalty: 'Listing Warning',
      status: 'RESOLVED',
      createdAt: '10 days ago',
    },
  ];

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Appeal for violation ${selectedViolationId} submitted to compliance team!`);
    setAppealReason('');
    setShowAppealModal(false);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <AlertTriangle className="w-4 h-4 text-pink-400" />
            <span>Store Policy & Compliance Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Violations & Appeals</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track account warnings, policy compliance records, and submit dispute appeals to admin moderation.
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-500/40 px-5 py-3 rounded-2xl flex items-center space-x-3 shadow-inner">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
          <div>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">ACCOUNT STATUS</div>
            <div className="text-base font-black text-white">100% Compliant (0 Active Strikes)</div>
          </div>
        </div>
      </div>

      {/* Violations List */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white">Violation History & Records</h3>

        {sampleViolations.map((v) => (
          <div key={v.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-black text-pink-400 text-xs">{v.id}</span>
                <span className="text-white font-bold text-sm">{v.title}</span>
              </div>
              <span className="text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                {v.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
              {v.reason}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Category: <strong className="text-slate-300">{v.category}</strong> ({v.severity} Severity)</span>
              <span>Logged {v.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Appeal Form Modal */}
      {showAppealModal && (
        <form onSubmit={handleAppealSubmit} className="bg-slate-900 border border-pink-500/30 p-6 rounded-3xl space-y-4 shadow-2xl">
          <h3 className="text-base font-black text-white">Submit Policy Appeal ({selectedViolationId})</h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Reason for Appeal</label>
            <textarea
              rows={4}
              required
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              placeholder="Provide evidence or clarification explaining why this violation record should be cleared..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAppealModal(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black rounded-xl flex items-center space-x-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Appeal</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
