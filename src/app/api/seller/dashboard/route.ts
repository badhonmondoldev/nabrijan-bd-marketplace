import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized or store not found' }, { status: 401 });

  const storeId = auth.store.id;

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.findMany({
      where: {
        storeId,
        createdAt: { gte: todayStart },
      },
    });

    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrdersCount = await prisma.order.count({ where: { storeId } });
    const totalProductsCount = await prisma.product.count({ where: { storeId, status: 'ACTIVE' } });
    const lowStockCount = await prisma.product.count({
      where: { storeId, stockQuantity: { lte: 10 } },
    });

    const allStoreOrders = await prisma.order.findMany({
      where: { storeId },
      select: { totalAmount: true },
    });
    const totalRevenue = allStoreOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const recentOrders = await prisma.order.findMany({
      where: { storeId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { name: true, email: true } } },
    });

    const topProducts = await prisma.product.findMany({
      where: { storeId, status: 'ACTIVE' },
      take: 5,
      include: { images: true },
      orderBy: { stockQuantity: 'desc' },
    });

    return NextResponse.json({
      store: auth.store,
      metrics: {
        todaySales,
        todayOrdersCount: todayOrders.length,
        totalOrdersCount,
        totalProductsCount,
        lowStockCount,
        totalRevenue,
      },
      recentOrders,
      topProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch metrics' }, { status: 500 });
  }
}
