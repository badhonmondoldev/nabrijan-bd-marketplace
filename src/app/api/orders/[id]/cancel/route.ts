import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { canTransitionOrderStatus } from '@/lib/orders';
import { createAuditLog } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, payments: true, store: true },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Verify ownership or seller/admin privileges
    if (order.buyerId !== session.userId && session.activeRole !== 'ADMIN' && session.activeRole !== 'SUPER_ADMIN') {
      const isSeller = await prisma.store.findFirst({
        where: { id: order.storeId, ownerId: session.userId },
      });
      if (!isSeller) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!canTransitionOrderStatus(order.orderStatus, 'CANCELLED')) {
      return NextResponse.json({ error: `Order in state ${order.orderStatus} cannot be cancelled.` }, { status: 400 });
    }

    const { reason } = await request.json();

    await prisma.$transaction(async (tx) => {
      // 1. Release reserved stock back to products
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
          },
        });

        // Record stock release transaction log
        const inv = await tx.inventory.findFirst({ where: { productId: item.productId } });
        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: {
              totalStock: { increment: item.quantity },
            },
          });

          await tx.inventoryTransaction.create({
            data: {
              inventoryId: inv.id,
              type: 'RESTOCK',
              quantity: item.quantity,
              notes: `Stock released due to cancellation of Order #${order.orderNumber}`,
            },
          });
        }
      }

      // 2. Refund wallet if paid via WALLET
      if (order.paymentMethod === 'WALLET') {
        const buyerWallet = await tx.wallet.findFirst({
          where: { userId: order.buyerId, type: 'BUYER_WALLET' },
        });

        if (buyerWallet) {
          await tx.wallet.update({
            where: { id: buyerWallet.id },
            data: { balance: { increment: order.totalAmount } },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: buyerWallet.id,
              type: 'CREDIT',
              amount: order.totalAmount,
              currency: 'BDT',
              status: 'COMPLETED',
              referenceType: 'REFUND',
              referenceId: order.id,
              description: `Full refund for cancelled Order #${order.orderNumber}`,
            },
          });
        }
      }

      // 3. Update order status and log OrderEvent
      await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: 'CANCELLED',
          events: {
            create: {
              status: 'CANCELLED',
              notes: reason || 'Order cancelled by customer',
              createdBy: session.userId,
            },
          },
        },
      });
    });

    await createAuditLog({
      userId: session.userId,
      action: 'ORDER_CANCELLED_STOCK_RELEASED',
      entity: 'Order',
      entityId: order.id,
    });

    return NextResponse.json({ success: true, action: 'cancelled' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Cancellation failed' }, { status: 500 });
  }
}
