import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';
import { OrderStatus } from '@prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { shipments: true },
    });

    if (!order || order.storeId !== auth.store.id) {
      return NextResponse.json({ error: 'Order not found or access denied.' }, { status: 403 });
    }

    const { newStatus, trackingCode, courierName, notes } = await request.json();

    if (!newStatus) {
      return NextResponse.json({ error: 'New status is required.' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: newStatus as OrderStatus,
        events: {
          create: {
            status: newStatus as OrderStatus,
            notes: notes || `Order status updated to ${newStatus} by store merchant`,
            createdBy: auth.userId,
          },
        },
      },
    });

    // Update courier shipment details if provided
    if (trackingCode && order.shipments.length > 0) {
      await prisma.shipment.update({
        where: { id: order.shipments[0].id },
        data: {
          trackingCode,
          courierName: courierName || 'NABRIJAN_EXPRESS',
          status: newStatus === 'SHIPPED' ? 'IN_TRANSIT' : newStatus === 'DELIVERED' ? 'DELIVERED' : 'PENDING',
        },
      });
    }

    await createAuditLog({
      userId: auth.userId,
      action: 'SELLER_ORDER_STATUS_UPDATE',
      entity: 'Order',
      entityId: order.id,
      metadata: { newStatus },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Status update failed' }, { status: 500 });
  }
}
