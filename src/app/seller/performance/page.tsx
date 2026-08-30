'use client';

import React, { useState } from 'react';
import { Award, CheckCircle, AlertTriangle, Clock, RotateCcw, TrendingUp, ShieldCheck, Heart } from 'lucide-react';

export default function SellerPerformancePage() {
  const metrics = {
    totalOrders: 148,
    completedOrders: 142,
    cancellationRate: 1.2, // %
    lateShipmentRate: 0.8, // %
    onTimeShipmentRate: 99.2, // %
    returnRate: 2.1, // %
    averageRating: 4.85,
    customerResponseRate: 98.5, // %
    healthStatus: 'EXCELLENT',
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <Award className="w-4 h-4 text-pink-400" />
            <span>Store Performance & Quality Scorecard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Seller Health & Rating</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time fulfillment metrics, buyer satisfaction rating, and store policy compliance score.
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-500/40 px-5 py-3 rounded-2xl shadow-inner flex items-center space-x-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">STORE HEALTH</div>
            <div className="text-lg font-black text-white">{metrics.healthStatus} (98.5%)</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>On-Time Shipping</span>
            <Clock className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.onTimeShipmentRate}%</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Target &gt; 95% (Passed)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Cancellation Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.cancellationRate}%</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Target &lt; 2.5% (Passed)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Return Request Rate</span>
            <RotateCcw className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.returnRate}%</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Target &lt; 3.0% (Passed)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Buyer Rating</span>
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          </div>
          <div className="text-2xl font-black text-white">⭐ {metrics.averageRating} / 5.0</div>
          <div className="text-[11px] text-pink-300 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Based on 148 verified purchases</span>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="bg-slate-900 border border-pink-500/30 p-6 rounded-3xl space-y-4">
        <h3 className="text-lg font-black text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-pink-400" />
          <span>Performance Recommendations for Your Store</span>
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start space-x-3 text-xs">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Express Dispatch Enabled</div>
              <div className="text-slate-400 mt-0.5">Your orders are packed within 12 hours on average. Keep maintaining your fast handling time for top store placement.</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start space-x-3 text-xs">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">High Customer Response Rate ({metrics.customerResponseRate}%)</div>
              <div className="text-slate-400 mt-0.5">You reply to buyer inquiries in under 15 minutes. High response rates improve buyer trust.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
