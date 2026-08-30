import { OrderStatus } from '@prisma/client';
import { prisma } from './db';
import { createAuditLog } from './audit';
import { updateCommissionOnOrderStatus } from './affiliate';

/**
 * Validates if an order status transition is allowed by controlled business rules.
 */
export function canTransitionOrderStatus(current: OrderStatus, target: OrderStatus): boolean {
  if (current === target) return true;

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    PROCESSING: [OrderStatus.PACKED, OrderStatus.CANCELLED],
    PACKED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    SHIPPED: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.RETURN_REQUESTED, OrderStatus.DISPUTED],
    OUT_FOR_DELIVERY: [OrderStatus.DELIVERED, OrderStatus.RETURN_REQUESTED, OrderStatus.DISPUTED],
    DELIVERED: [OrderStatus.COMPLETED, OrderStatus.RETURN_REQUESTED, OrderStatus.DISPUTED],
    COMPLETED: [OrderStatus.RETURN_REQUESTED, OrderStatus.DISPUTED],
    CANCELLED: [],
    RETURN_REQUESTED: [OrderStatus.RETURN_APPROVED, OrderStatus.DISPUTED],
    RETURN_APPROVED: [OrderStatus.RETURNED, OrderStatus.REFUNDED],
    RETURNED: [OrderStatus.REFUNDED],
    REFUNDED: [],
    DISPUTED: [OrderStatus.CANCELLED, OrderStatus.REFUNDED, OrderStatus.COMPLETED],
  };

  return validTransitions[current]?.includes(target) || false;
}

/**
 * Executes an order status transition, logs an OrderEvent, and records an audit log entry.
 */
export async function transitionOrderStatus({
  orderId,
  targetStatus,
  userId,
  notes,
}: {
  orderId: string;
  targetStatus: OrderStatus;
  userId: string;
  notes?: string;
}) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error('Order not found');
  }

  if (!canTransitionOrderStatus(order.orderStatus, targetStatus)) {
    throw new Error(`Invalid status transition from ${order.orderStatus} to ${targetStatus}`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: targetStatus,
      events: {
        create: {
          status: targetStatus,
          notes: notes || `Order transitioned to ${targetStatus}`,
          createdBy: userId,
        },
      },
    },
    include: { events: true },
  });

  await createAuditLog({
    userId,
    action: 'ORDER_STATUS_TRANSITION',
    entity: 'Order',
    entityId: orderId,
    metadata: { previousStatus: order.orderStatus, newStatus: targetStatus },
  });

  // Update affiliate commission state machine
  await updateCommissionOnOrderStatus(orderId, targetStatus);

  return updatedOrder;
}
