import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.userId },
      include: {
        links: {
          include: {
            product: { select: { title: true, slug: true, images: true, salePrice: true, basePrice: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        commissions: {
          include: {
            order: { select: { id: true, totalAmount: true, orderStatus: true, createdAt: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json({ isAffiliate: false });
    }

    const totalClicks = affiliate.links.reduce((sum, l) => sum + l.clicksCount, 0);
    const totalConversions = affiliate.commissions.length;
    const conversionRate = totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 1000) / 10 : 0;

    const pendingCommission = affiliate.commissions
      .filter((c) => c.status === 'PENDING')
      .reduce((sum, c) => sum + c.amount, 0);

    const lockedCommission = affiliate.commissions
      .filter((c) => c.status === 'LOCKED')
      .reduce((sum, c) => sum + c.amount, 0);

    const approvedCommission = affiliate.commissions
      .filter((c) => c.status === 'APPROVED')
      .reduce((sum, c) => sum + c.amount, 0);

    const wallet = await prisma.wallet.findFirst({
      where: { userId: session.userId, type: 'AFFILIATE_WALLET' },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });

    return NextResponse.json({
      isAffiliate: true,
      affiliate,
      metrics: {
        totalClicks,
        totalConversions,
        conversionRate,
        pendingCommission,
        lockedCommission,
        approvedCommission,
        availableBalance: wallet ? wallet.balance : affiliate.commissionEarned,
      },
      payoutHistory: wallet?.transactions || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
