import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Share2, DollarSign, Link as LinkIcon, Award } from 'lucide-react';

export default async function AffiliateDashboardPage() {
  const session = await getSession();
  if (!session || (session.activeRole !== 'AFFILIATE' && session.activeRole !== 'SUPER_ADMIN')) {
    redirect('/account');
  }

  const affiliate = await prisma.affiliate.findUnique({
    where: { userId: session.userId },
    include: {
      links: { include: { product: true } },
      commissions: { include: { order: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-purple-950 text-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-black">Affiliate Marketer Hub</h1>
          </div>
          <p className="text-xs text-purple-200 mt-1">Unique Referral Code: <span className="font-mono text-amber-300 font-bold">{affiliate?.referralCode || 'NBD-REF-100'}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 mb-1">Total Earned Commissions</div>
          <div className="text-3xl font-black text-purple-700">৳{affiliate?.commissionEarned || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Payout via bKash / Nagad</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 mb-1">Active Referral Links</div>
          <div className="text-3xl font-black text-slate-900">{affiliate?.links.length || 0}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 mb-1">Commission Orders</div>
          <div className="text-3xl font-black text-slate-900">{affiliate?.commissions.length || 0}</div>
        </div>
      </div>

      {/* Referral Link Generator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-2">Share & Earn BDT Commission</h2>
        <p className="text-xs text-slate-500 mb-4">Promote any product on social media using your unique affiliate link code.</p>
        <div className="bg-slate-50 p-4 rounded-xl font-mono text-xs text-purple-900 border flex items-center justify-between">
          <span>https://nabrijan-bd.vercel.app/products?ref={affiliate?.referralCode}</span>
          <span className="bg-purple-700 text-white font-sans text-[10px] font-bold px-3 py-1 rounded">Copy Link</span>
        </div>
      </div>
    </div>
  );
}
