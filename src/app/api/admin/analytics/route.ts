import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const orders = await prisma.order.findMany({
      include: {
        store: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const gmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const platformCommission = Math.round(gmv * 0.05);

    const totalOrdersCount = orders.length;
    const cancelledOrdersCount = orders.filter((o) => ['CANCELLED', 'RETURNED', 'REFUNDED'].includes(o.orderStatus)).length;
    const refundRate = totalOrdersCount > 0 ? Math.round((cancelledOrdersCount / totalOrdersCount) * 1000) / 10 : 0;

    const topStores = await prisma.store.findMany({
      where: { status: 'VERIFIED' },
      take: 5,
      select: { id: true, name: true, _count: { select: { orders: true, products: true } } },
    });

    const topProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      take: 5,
      select: { id: true, title: true, basePrice: true, salePrice: true, stockQuantity: true },
    });

    return NextResponse.json({
      bi: {
        gmv,
        platformCommission,
        totalOrdersCount,
        refundRate,
      },
      topStores,
      topProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
