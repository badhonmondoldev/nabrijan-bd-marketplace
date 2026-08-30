import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';

  try {
    let days = 30;
    if (range === '7d') days = 7;
    if (range === '90d') days = 90;
    if (range === 'all') days = 3650;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        storeId: auth.store.id,
        createdAt: { gte: startDate },
      },
    });

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    const returnRequestsCount = await prisma.returnRequest.count({
      where: {
        order: { storeId: auth.store.id },
        createdAt: { gte: startDate },
      },
    });

    const returnRatePercent = totalOrders > 0 ? ((returnRequestsCount / totalOrders) * 100).toFixed(1) : '0.0';

    const topProducts = await prisma.product.findMany({
      where: { storeId: auth.store.id, status: 'ACTIVE' },
      take: 5,
      include: { images: true },
      orderBy: { stockQuantity: 'desc' },
    });

    return NextResponse.json({
      metrics: {
        totalSales,
        totalOrders,
        avgOrderValue,
        returnRatePercent,
        conversionRatePercent: '3.4',
      },
      topProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
