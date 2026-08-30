import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';
import { processOrderCommission } from '@/lib/affiliate';
import { recordLedgerTransaction, getOrCreateWallet } from '@/lib/ledger';
import { PaymentMethod, OrderStatus, PaymentStatus } from '@prisma/client';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required.' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.division) {
      return NextResponse.json({ error: 'Valid delivery address is required.' }, { status: 400 });
    }

    // Step 1: Server-side price & stock verification
    const itemIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: itemIds } },
      include: { store: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Group items by seller/store ID to handle multi-vendor order splitting
    const storeOrdersMap = new Map<string, any[]>();

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      if (dbProduct.stockQuantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${dbProduct.title}` }, { status: 400 });
      }

      const verifiedPrice = dbProduct.salePrice || dbProduct.basePrice;
      const storeId = dbProduct.storeId;

      if (!storeOrdersMap.has(storeId)) {
        storeOrdersMap.set(storeId, []);
      }

      storeOrdersMap.get(storeId)!.push({
        product: dbProduct,
        quantity: item.quantity,
        verifiedPrice,
        totalAmount: verifiedPrice * item.quantity,
      });
    }

    // Step 2: Database transaction execution
    const createdOrders: any[] = [];

    await prisma.$transaction(async (tx) => {
      let orderIndex = 1;

      for (const [storeId, storeItems] of storeOrdersMap.entries()) {
        const subtotal = storeItems.reduce((acc, i) => acc + i.totalAmount, 0);
        const shippingFee = shippingAddress.division.toLowerCase() === 'dhaka' ? 60.0 : 120.0;
        const totalAmount = subtotal + shippingFee;

        const orderNumber = `NBD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

        const order = await tx.order.create({
          data: {
            orderNumber,
            buyerId: session.userId,
            storeId,
            subtotal,
            shippingFee,
            totalAmount,
            paymentStatus: paymentMethod === 'WALLET' ? PaymentStatus.PAID : PaymentStatus.PENDING,
            orderStatus: OrderStatus.PENDING,
            paymentMethod: (paymentMethod as PaymentMethod) || PaymentMethod.CASH_ON_DELIVERY,
            shippingAddressJson: JSON.stringify(shippingAddress),
            items: {
              create: storeItems.map((si) => ({
                productId: si.product.id,
                title: si.product.title,
                price: si.verifiedPrice,
                quantity: si.quantity,
                totalAmount: si.totalAmount,
              })),
            },
            events: {
              create: [
                {
                  status: OrderStatus.PENDING,
                  notes: `Order created via ${paymentMethod || 'COD'}`,
                  createdBy: session.userId,
                },
              ],
            },
            payments: {
              create: {
                amount: totalAmount,
                method: (paymentMethod as PaymentMethod) || PaymentMethod.CASH_ON_DELIVERY,
                status: paymentMethod === 'WALLET' ? PaymentStatus.PAID : PaymentStatus.PENDING,
              },
            },
            shipments: {
              create: {
                trackingCode: `TRK-${orderNumber}`,
                courierName: 'NABRIJAN_EXPRESS',
                status: 'PENDING',
              },
            },
          },
        });

        // Decrement product inventory stock
        for (const si of storeItems) {
          await tx.product.update({
            where: { id: si.product.id },
            data: {
              stockQuantity: Math.max(0, si.product.stockQuantity - si.quantity),
            },
          });
        }

        // If paying via wallet, debit buyer wallet atomically via ledger
        if (paymentMethod === 'WALLET') {
          const buyerWallet = await tx.wallet.findFirst({
            where: { userId: session.userId, type: 'BUYER_WALLET' },
          });

          if (!buyerWallet || buyerWallet.balance < totalAmount) {
            throw new Error(`Insufficient wallet balance to complete order #${orderNumber}`);
          }

          await tx.wallet.update({
            where: { id: buyerWallet.id },
            data: { balance: buyerWallet.balance - totalAmount },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: buyerWallet.id,
              type: 'DEBIT',
              amount: totalAmount,
              currency: 'BDT',
              referenceType: 'ORDER_PAYMENT',
              referenceId: order.id,
              description: `Payment for Order #${orderNumber}`,
            },
          });
        }

        createdOrders.push(order);

        await processOrderCommission({
          orderId: order.id,
          buyerId: session.userId,
          totalAmount,
        });

        await createAuditLog({
          userId: session.userId,
          action: 'ORDER_CREATED',
          entity: 'Order',
          entityId: order.id,
          metadata: { orderNumber, totalAmount, storeId },
        });

        orderIndex++;
      }
    });

    return NextResponse.json({ success: true, count: createdOrders.length, orders: createdOrders });
  } catch (error: any) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
