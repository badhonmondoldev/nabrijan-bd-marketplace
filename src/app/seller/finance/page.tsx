import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DollarSign, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerFinancePage() {
  const session = await getSession();
  if (!session || (session.activeRole !== 'SELLER' && session.activeRole !== 'SUPER_ADMIN')) {
    redirect('/account');
  }

  let wallet: any = null;
  let payouts: any[] = [];

  try {
    const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
    if (store) {
      wallet = await prisma.wallet.findFirst({
        where: { storeId: store.id },
        include: { transactions: { take: 10, orderBy: { createdAt: 'desc' } } },
      });

      if (wallet) {
        payouts = await prisma.payout.findMany({
          where: { walletId: wallet.id },
          orderBy: { createdAt: 'desc' },
        });
      }
    }
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Vendor Financial Ledger & Payouts</h1>
            <p className="text-xs text-slate-400">Net Settlement = Gross Sales - Platform Commission (5%)</p>
          </div>
        </div>

        <div className="bg-emerald-800 text-white px-6 py-3 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-emerald-200">Withdrawable Balance</div>
          <div className="text-2xl font-black">৳{wallet?.balance || 0} BDT</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ledger Transactions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b">Settlement Ledger Log</h2>
          {!wallet || wallet.transactions.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-6">No settlement transactions yet.</div>
          ) : (
            <div className="divide-y text-xs">
              {wallet.transactions.map((tx: any) => (
                <div key={tx.id} className="py-3 flex justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{tx.description || tx.referenceType}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="font-black text-emerald-700">৳{tx.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payout History */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-base font-bold text-slate-900">Payout Requests</h2>
            <button className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              Request Payout
            </button>
          </div>
          {payouts.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-6">No payout requests submitted yet.</div>
          ) : (
            <div className="space-y-3 text-xs">
              {payouts.map((p) => (
                <div key={p.id} className="border p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">৳{p.amount} ({p.method})</div>
                    <div className="text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
