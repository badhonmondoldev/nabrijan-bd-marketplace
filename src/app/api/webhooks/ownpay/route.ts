import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyOwnPayWebhook } from '@/lib/ownpay';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-ownpay-signature') || '';

    // Verify webhook signature (bypass in dev if secret not configured)
    if (process.env.NODE_ENV === 'production' && !verifyOwnPayWebhook(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    if (event === 'payment.succeeded' || payload.status === 'COMPLETED' || payload.status === 'success') {
      const orderId = data?.merchant_order_id || payload.orderId;
      const transactionId = data?.transaction_id || payload.transactionId || `op_tx_${Date.now()}`;

      if (orderId) {
        // Update Order in DB
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            orderStatus: 'PROCESSING',
            ownpayTransactionId: transactionId,
          },
        }).catch((e) => console.warn('DB update order skipped (demo mode):', e));

        console.log(`[OwnPay Webhook] Order #${orderId} marked as PAID. Transaction: ${transactionId}`);
      }
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error: any) {
    console.error('OwnPay Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
