import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, customerName, customerPhone, returnUrl } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Order amount is required' }, { status: 400 });
    }

    const intentToken = `op_intent_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Update order with intent token in DB if orderId provided
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { ownpayIntentToken: intentToken },
      }).catch((e) => console.warn('Order update intent token skipped (demo mode):', e));
    }

    // Return Serverless Gateway Intent Payload
    return NextResponse.json({
      success: true,
      token: intentToken,
      intent_token: intentToken,
      merchant_order_id: orderId || `ORD-${Date.now()}`,
      amount,
      currency: 'BDT',
      customer_name: customerName || 'Buyer',
      customer_phone: customerPhone || '01700000000',
      redirect_url: returnUrl || '/checkout/success',
    });
  } catch (error: any) {
    console.error('OwnPay Serverless Intent Error:', error);
    return NextResponse.json({ error: error.message || 'Payment intent initialization failed' }, { status: 500 });
  }
}
