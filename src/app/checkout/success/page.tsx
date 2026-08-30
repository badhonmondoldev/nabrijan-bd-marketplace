'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 max-w-full overflow-x-hidden">
      <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 mx-auto flex items-center justify-center shadow-2xl">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>

      <div className="space-y-2">
        <span className="bg-pink-950 border border-pink-500/40 text-pink-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          PAYMENT VERIFIED VIA OWNPAY
        </span>
        <h1 className="text-3xl font-black text-white">Payment Received Successfully!</h1>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Your transaction has been securely processed via OwnPay Gateway. The merchant is preparing your package for nationwide delivery.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 max-w-md mx-auto text-left text-xs font-mono">
        <div className="flex justify-between border-b border-slate-800 pb-2 font-sans font-bold text-white">
          <span>Payment Reference:</span>
          <span className="text-pink-400">#OP-TXN-849120</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Payment Gateway:</span>
          <span className="font-bold text-white">OwnPay (bKash / Direct)</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Amount Paid:</span>
          <span className="font-bold text-emerald-400">৳11,550 BDT</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Order Status:</span>
          <span className="font-bold text-emerald-400">PROCESSING</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/account"
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-black text-xs rounded-2xl shadow-lg hover:brightness-110 flex items-center justify-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Track Order in Dashboard</span>
        </Link>

        <Link
          href="/products"
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4 text-pink-400" />
        </Link>
      </div>
    </div>
  );
}
