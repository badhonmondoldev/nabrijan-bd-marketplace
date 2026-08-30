'use client';

import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, CheckCircle, Send, CreditCard } from 'lucide-react';

export default function SellerWalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('BKASH');
  const [accountNumber, setAccountNumber] = useState('01700000000');
  const [loading, setLoading] = useState(false);

  const availableBalance = 48500;
  const pendingBalance = 12400;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) > availableBalance) {
      alert('Invalid withdrawal amount');
      return;
    }

    alert(`Withdrawal request of ৳${withdrawAmount} via ${payoutMethod} (${accountNumber}) submitted to finance team!`);
    setWithdrawAmount('');
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <Wallet className="w-4 h-4 text-pink-400" />
            <span>Merchant Financial Wallet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Earnings & Withdrawals</h1>
        </div>

        {/* Balance Cards */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-950 border border-emerald-500/40 px-4 py-2.5 rounded-2xl text-right">
            <div className="text-[10px] font-bold text-slate-400">Available Balance</div>
            <div className="text-lg font-black text-emerald-400">৳{availableBalance.toLocaleString()}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl text-right">
            <div className="text-[10px] font-bold text-slate-400">Pending Clearance</div>
            <div className="text-lg font-black text-slate-300">৳{pendingBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdraw} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">Request Payout Withdrawal</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Withdrawal Amount (৳)</label>
            <input
              type="number"
              required
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Payout Method</label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
            >
              <option value="BKASH">bKash Merchant / Personal</option>
              <option value="NAGAD">Nagad Wallet</option>
              <option value="BANK">Bank Wire Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Receiving Account Number</label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="01712345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white text-xs font-black rounded-xl shadow flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Withdrawal Request</span>
          </button>
        </div>
      </form>
    </div>
  );
}
