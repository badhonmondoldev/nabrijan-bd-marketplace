import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  let wallet: any = null;
  try {
    wallet = await prisma.wallet.findFirst({
      where: { userId: session.userId, type: 'BUYER_WALLET' },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
  } catch (e) {}

  const balance = wallet?.balance || 0.0;
  const transactions = wallet?.transactions || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-3 rounded-xl">
            <WalletIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Nabrijan Customer Wallet</h1>
            <p className="text-xs text-slate-400">Atomic ledger balance for fast single-click order checkout</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl text-right">
          <div className="text-[11px] text-slate-300 font-semibold uppercase">Available Balance</div>
          <div className="text-3xl font-black text-amber-300">৳{balance} BDT</div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b">Recent Wallet Ledger Transactions</h2>
        {transactions.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-8 border border-dashed rounded-xl">
            No wallet ledger transactions recorded yet.
          </div>
        ) : (
          <div className="divide-y text-xs">
            {transactions.map((tx: any) => (
              <div key={tx.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{tx.description || tx.referenceType}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className={`font-black text-sm ${tx.type === 'CREDIT' ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'}৳{tx.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
