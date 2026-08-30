'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Share2,
  MousePointer,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Lock,
  CheckCircle2,
  Copy,
  Award,
  LogIn,
  Sparkles,
} from 'lucide-react';

export default function AccountAffiliatePage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newProductId, setNewProductId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/affiliate/dashboard');
      const json = await res.json();
      if (res.status === 401) {
        setUnauthorized(true);
      } else if (res.ok) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAffiliate = async () => {
    setRegistering(true);
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutMethod: 'bKash' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Activation failed');
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Activation failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedLink('');

    try {
      const res = await fetch('/api/affiliate/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: newProductId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Link generation failed');

      const fullUrl = `${window.location.origin}${json.link.url}`;
      setGeneratedLink(fullUrl);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 text-xs">
        <div className="inline-block p-4 bg-emerald-100 text-emerald-700 rounded-full animate-pulse">
          <Share2 className="w-8 h-8" />
        </div>
        <div className="font-bold text-slate-800 text-sm">Loading Nabrijan Affiliate Partner Portal...</div>
        <p className="text-slate-500">Connecting referral dashboard & commission ledger</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 text-xs">
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-4">
          <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black">Login Required</h1>
          <p className="text-slate-300 leading-relaxed">
            Please log in to your Nabrijan Market account to access your Affiliate Partner Dashboard, generate referral links, and view commission earnings.
          </p>
          <div className="pt-2">
            <Link
              href="/login?redirect=/account/affiliate"
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

  if (!data?.isAffiliate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-xs">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-8 space-y-6 text-center shadow-xl">
          <div className="bg-emerald-700/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
            <Share2 className="w-8 h-8 text-amber-300" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black">Become a Nabrijan Affiliate Partner</h1>
            <p className="text-slate-300 max-w-lg mx-auto leading-relaxed">
              Earn 5% commission on every order generated through your referral links. Share Bangladeshi products, track conversions in real-time, and get paid directly to your bKash or Nagad wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-4">
            <div className="bg-white/10 p-4 rounded-xl space-y-1 border border-white/10">
              <div className="font-bold text-amber-300">1. Share Links</div>
              <div className="text-[11px] text-slate-300">Generate referral tracking links for any marketplace product</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl space-y-1 border border-white/10">
              <div className="font-bold text-amber-300">2. Track Orders</div>
              <div className="text-[11px] text-slate-300">Automatic 30-day cookie attribution for referred shoppers</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl space-y-1 border border-white/10">
              <div className="font-bold text-amber-300">3. Earn BDT</div>
              <div className="text-[11px] text-slate-300">Instant commission payout to bKash, Nagad, or Wallet</div>
            </div>
          </div>

          <button
            onClick={handleActivateAffiliate}
            disabled={registering}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg transition"
          >
            {registering ? 'Activating Affiliate Partner...' : 'Activate Affiliate Account Now'}
          </button>
        </div>
      </div>
    );
  }

  const { affiliate, metrics } = data;
  const referralCode = affiliate.referralCode;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-xs">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-3 rounded-xl shadow">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Affiliate Partner Dashboard</h1>
            <p className="text-xs text-slate-400">Referral Code: <span className="font-mono font-bold text-amber-400">{referralCode}</span></p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
          <span className="text-[11px] text-slate-300 font-mono">Code: {referralCode}</span>
          <button
            onClick={() => handleCopyLink(referralCode)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Link Clicks</span>
            <MousePointer className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalClicks}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Conversions</span>
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalConversions}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Conv. Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.conversionRate}%</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Pending</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600">৳{metrics.pendingCommission}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Locked</span>
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-700">৳{metrics.lockedCommission}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700">৳{metrics.approvedCommission}</div>
        </div>

        <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-sm space-y-1">
          <div className="text-emerald-300 font-bold">Wallet Balance</div>
          <div className="text-2xl font-black text-amber-300">৳{metrics.availableBalance}</div>
        </div>
      </div>

      {/* Link Builder Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-emerald-600" />
          <span>Product Referral Link Generator</span>
        </h2>

        <form onSubmit={handleGenerateLink} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newProductId}
            onChange={(e) => setNewProductId(e.target.value)}
            placeholder="Enter Product ID or Select Product..."
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={generating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow"
          >
            {generating ? 'Generating Link...' : 'Generate Tracking Link'}
          </button>
        </form>

        {generatedLink && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
            <span className="font-mono text-emerald-900 truncate">{generatedLink}</span>
            <button
              onClick={() => handleCopyLink(generatedLink)}
              className="bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg hover:bg-emerald-800"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>

      {/* Referral History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Referred Orders & Commission Lifecycle</h2>

        {affiliate.commissions?.length === 0 ? (
          <div className="text-slate-400 py-8 text-center border border-dashed rounded-xl">
            No referred orders recorded yet. Share your referral links to start earning!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Commission ID</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Order Amount</th>
                  <th className="p-3">Earned Commission (5%)</th>
                  <th className="p-3">Commission Lifecycle</th>
                  <th className="p-3">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {affiliate.commissions.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">#{c.id.slice(0, 8)}</td>
                    <td className="p-3 font-mono font-semibold text-slate-800">#{c.orderId.slice(0, 8)}</td>
                    <td className="p-3 font-bold text-slate-900">৳{c.order?.totalAmount || '—'}</td>
                    <td className="p-3 font-black text-emerald-700">৳{c.amount}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.riskScore === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.riskScore}
                      </span>
                    </td>
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
