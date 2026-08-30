import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminRiskPage() {
  const session = await getSession();
  if (!session || (session.activeRole !== 'ADMIN' && session.activeRole !== 'SUPER_ADMIN')) {
    redirect('/account');
  }

  let flaggedCommissions: any[] = [];
  try {
    flaggedCommissions = await prisma.affiliateCommission.findMany({
      where: { riskScore: { in: ['MEDIUM', 'HIGH'] } },
      include: { affiliate: { include: { user: true } }, order: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-950 text-white rounded-2xl p-6 mb-8 flex items-center space-x-3">
        <ShieldAlert className="w-6 h-6 text-red-400" />
        <div>
          <h1 className="text-2xl font-black">Fraud Engine & Risk Review Queue</h1>
          <p className="text-xs text-red-200">Inspect suspicious affiliate conversions & self-referral indicators</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b">Flagged Affiliate Conversions</h2>
        {flaggedCommissions.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-8 border border-dashed rounded-xl">
            No high-risk affiliate conversions flagged. Risk Engine score: Clear.
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {flaggedCommissions.map((c) => (
              <div key={c.id} className="border p-4 rounded-xl flex justify-between items-center bg-red-50/50">
                <div>
                  <div className="font-bold text-slate-900">Affiliate: {c.affiliate.user.name} ({c.affiliate.referralCode})</div>
                  <div className="text-[11px] text-slate-500 font-mono">Order #{c.order.orderNumber} • Amount: ৳{c.amount}</div>
                </div>
                <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  Risk Level: {c.riskScore}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
