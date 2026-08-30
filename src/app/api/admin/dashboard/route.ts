import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const activeSellers = await prisma.store.count({ where: { status: { in: ['VERIFIED', 'ACTIVE'] } } });
    const pendingSellers = await prisma.store.count({ where: { status: { in: ['UNDER_REVIEW', 'PENDING'] } } });
    const pendingProducts = await prisma.product.count({ where: { status: 'PENDING_REVIEW' } });
    
    const orders = await prisma.order.findMany({ select: { totalAmount: true, orderStatus: true } });
    const totalOrders = orders.length;
    const gmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const platformRevenue = Math.round(gmv * 0.05); // 5% marketplace commission foundation

    const returnRequestsCount = await prisma.returnRequest.count({ where: { status: 'SUBMITTED' } });
    const openDisputesCount = await prisma.dispute.count({ where: { status: 'OPEN' } });
    const pendingPayoutsCount = await prisma.payout.count({ where: { status: 'PENDING' } });

    const recentSellers = await prisma.store.findMany({
      where: { status: 'UNDER_REVIEW' },
      take: 5,
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const recentProducts = await prisma.product.findMany({
      where: { status: 'PENDING_REVIEW' },
      take: 5,
      include: { store: { select: { name: true } }, images: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      metrics: {
        totalUsers,
        activeSellers,
        pendingSellers,
        pendingProducts,
        totalOrders,
        gmv,
        platformRevenue,
        returnRequestsCount,
        openDisputesCount,
        pendingPayoutsCount,
      },
      recentSellers,
      recentProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
