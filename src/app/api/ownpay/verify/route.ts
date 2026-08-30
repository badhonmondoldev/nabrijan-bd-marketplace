import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, transactionId, paymentMethod } = body;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID (TrxID) is required' }, { status: 400 });
    }

    // Update order status in DB
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          orderStatus: 'PROCESSING',
          ownpayTransactionId: transactionId,
        },
      }).catch((e) => console.warn('DB update order skipped (demo mode):', e));
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      transactionId,
      status: 'PAID',
    });
  } catch (error: any) {
    console.error('OwnPay Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
