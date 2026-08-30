import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        user: { select: { name: true, email: true } },
        store: { select: { name: true } },
      },
      orderBy: { balance: 'desc' },
      take: 50,
    });

    const payoutRequests = await prisma.payout.findMany({
      include: {
        wallet: {
          include: {
            store: { select: { name: true } },
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalWalletBalances = wallets.reduce((sum, w) => sum + w.balance, 0);

    return NextResponse.json({
      totalWalletBalances,
      wallets,
      payoutRequests,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
