import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDisputesPage() {
  const session = await getSession();
  if (!session || (session.activeRole !== 'ADMIN' && session.activeRole !== 'SUPER_ADMIN')) {
    redirect('/account');
  }

  let disputes: any[] = [];
  try {
    disputes = await prisma.dispute.findMany({
      include: { order: true, raisedBy: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-950 text-white rounded-2xl p-6 mb-8 flex items-center space-x-3">
        <AlertCircle className="w-6 h-6 text-amber-400" />
        <div>
          <h1 className="text-2xl font-black">Customer & Merchant Dispute Resolution</h1>
          <p className="text-xs text-red-200">Formal arbitration platform for order claims and returns</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b">Active Dispute Tickets</h2>
        {disputes.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-8 border border-dashed rounded-xl">
            No open disputes logged. All orders operating normally.
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {disputes.map((d) => (
              <div key={d.id} className="border p-4 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">Order #{d.order.orderNumber} - {d.reason}</div>
                  <div className="text-[11px] text-slate-500">Raised By: {d.raisedBy.name} ({d.raisedBy.email})</div>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
