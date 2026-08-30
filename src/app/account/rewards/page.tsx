'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Star, Gift, TrendingUp, History, Sparkles, LogIn } from 'lucide-react';

export default function CustomerRewardsPage() {
  const [account, setAccount] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rewards');
      const json = await res.json();
      if (res.status === 401) {
        setUnauthorized(true);
      } else if (res.ok) {
        setAccount(json.account);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 text-xs">
        <div className="inline-block p-4 bg-amber-100 text-amber-700 rounded-full animate-pulse">
          <Award className="w-8 h-8" />
        </div>
        <div className="font-bold text-slate-800 text-sm">Loading Nabrijan Rewards Club...</div>
        <p className="text-slate-500">Checking your points balance & membership tier</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 text-xs">
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-4">
          <div className="bg-amber-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-slate-950">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black">Login Required</h1>
          <p className="text-slate-300 leading-relaxed">
            Please log in to your account to view your Nabrijan Rewards Points balance, check membership tier multipliers, and track activity history.
          </p>
          <div className="pt-2">
            <Link
              href="/login?redirect=/account/rewards"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In To Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="bg-amber-500/20 p-4 rounded-2xl border border-amber-400/30">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black">Nabrijan Rewards Club</h1>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                {account?.tier || 'BRONZE'} TIER
              </span>
            </div>
            <p className="text-xs text-slate-300">Earn points on every Bangladeshi marketplace transaction</p>
          </div>
        </div>

        <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-right space-y-1">
          <div className="text-slate-300 font-semibold">Available Points Balance</div>
          <div className="text-3xl font-black text-amber-300 flex items-center justify-end space-x-1">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>{account?.points || 0} PTS</span>
          </div>
        </div>
      </div>

      {/* Tier Progress & Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="font-bold text-slate-900 flex items-center space-x-2">
            <Star className="w-4 h-4 text-emerald-600" />
            <span>How to Earn Points</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Earn 1 Reward Point for every ৳100 spent on verified Bangladeshi marketplace products.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="font-bold text-slate-900 flex items-center space-x-2">
            <Gift className="w-4 h-4 text-indigo-600" />
            <span>Future Redemption</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Redeem accumulated points for discount vouchers, free shipping coupons, and flash sale perks.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Membership Tiers</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Unlock Gold & Platinum tiers for double points multipliers and priority customer support.
          </p>
        </div>
      </div>

      {/* Points History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
          <History className="w-4 h-4 text-slate-600" />
          <span>Reward Points Activity History</span>
        </h2>

        {account?.transactions?.length === 0 ? (
          <div className="text-slate-400 py-8 text-center border border-dashed rounded-xl">
            No points transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Date</th>
                  <th className="p-3">Activity Description</th>
                  <th className="p-3">Transaction Type</th>
                  <th className="p-3 text-right">Points Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {account?.transactions?.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{tx.description}</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700">+{tx.points} PTS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
