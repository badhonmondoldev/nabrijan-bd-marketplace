'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Lock, Smartphone, CreditCard, Sparkles, ArrowRight } from 'lucide-react';

interface OwnPayModalProps {
  orderId: string;
  amount: number;
  customerName: string;
  onSuccess: (trxId: string) => void;
  onClose: () => void;
}

export default function OwnPayModal({
  orderId,
  amount,
  customerName,
  onSuccess,
  onClose,
}: OwnPayModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD'>('BKASH');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const gatewayNumbers = {
    BKASH: '01700000000',
    NAGAD: '01800000000',
    ROCKET: '01900000000-1',
    CARD: 'VISA / MasterCard Gateway Active',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError('Please enter the 8-10 digit TrxID from your SMS receipt');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/ownpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          transactionId,
          paymentMethod: selectedGateway,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      onSuccess(transactionId);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-pink-500/40 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-black text-pink-400 text-xs">
                OP
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center space-x-1.5">
                <span>OwnPay Direct Gateway</span>
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-[10px] text-slate-400">Order ID: #{orderId}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Amount</div>
            <div className="text-lg font-black text-emerald-400">৳{amount} BDT</div>
          </div>
        </div>

        {/* Gateway Selection Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'BKASH', label: 'bKash', color: 'pink' },
            { id: 'NAGAD', label: 'Nagad', color: 'orange' },
            { id: 'ROCKET', label: 'Rocket', color: 'purple' },
            { id: 'CARD', label: 'Card', color: 'blue' },
          ].map((gw) => (
            <button
              key={gw.id}
              type="button"
              onClick={() => setSelectedGateway(gw.id as any)}
              className={`py-2 px-1 rounded-xl font-black text-xs transition border ${
                selectedGateway === gw.id
                  ? 'bg-pink-950 border-pink-500 text-pink-300 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {gw.label}
            </button>
          ))}
        </div>

        {/* Instructions Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span>Send Money / Payment to:</span>
            <button
              type="button"
              onClick={() => handleCopy(gatewayNumbers[selectedGateway])}
              className="text-pink-400 flex items-center space-x-1 hover:underline text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Number'}</span>
            </button>
          </div>

          <div className="font-mono text-base font-black text-white bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>{gatewayNumbers[selectedGateway]}</span>
            <span className="text-[10px] font-black text-pink-400 bg-pink-950 border border-pink-500/30 px-2 py-0.5 rounded-md uppercase">
              {selectedGateway}
            </span>
          </div>

          <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1 font-medium">
            <li>Open your <strong>{selectedGateway}</strong> App or dial USSD.</li>
            <li>Select <strong>Send Money</strong> or <strong>Make Payment</strong>.</li>
            <li>Enter exact amount: <strong className="text-white">৳{amount} BDT</strong>.</li>
            <li>Copy the <strong>TrxID</strong> from your SMS receipt and paste below.</li>
          </ol>
        </div>

        {/* TrxID Verification Form */}
        <form onSubmit={handleVerifyPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Enter {selectedGateway} Transaction ID (TrxID)
            </label>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
              placeholder="e.g. 9H4102910A"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase focus:outline-none focus:border-pink-500"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 font-bold bg-rose-950/60 p-3 rounded-xl border border-rose-500/30">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-2xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={verifying}
              className="w-2/3 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-pink-500/25 hover:brightness-110 flex items-center justify-center space-x-2"
            >
              <span>{verifying ? 'Verifying TrxID...' : 'Verify & Complete Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
