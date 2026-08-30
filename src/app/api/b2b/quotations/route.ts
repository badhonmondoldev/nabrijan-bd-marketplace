import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const { action, quoteId, rfqId, unitPrice, totalPrice, notes } = await request.json();

  if (action === 'SUBMIT_QUOTE') {
    const seller = await getAuthenticatedSellerStore();
    if (!seller) return NextResponse.json({ error: 'Unauthorized seller access' }, { status: 401 });

    try {
      const quote = await prisma.rfqQuote.create({
        data: {
          rfqId,
          storeId: seller.store.id,
          unitPrice: parseFloat(unitPrice),
          totalPrice: parseFloat(totalPrice),
          notes: notes || null,
          status: 'SENT',
        },
      });

      await prisma.rfq.update({
        where: { id: rfqId },
        data: { status: 'QUOTED' },
      });

      return NextResponse.json({ success: true, quote });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (action === 'ACCEPT_QUOTE' || action === 'REJECT_QUOTE') {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
      const status = action === 'ACCEPT_QUOTE' ? 'ACCEPTED' : 'REJECTED';

      const quote = await prisma.rfqQuote.update({
        where: { id: quoteId },
        data: { status },
      });

      if (action === 'ACCEPT_QUOTE') {
        await prisma.rfq.update({
          where: { id: quote.rfqId },
          data: { status: 'ACCEPTED' },
        });
      }

      return NextResponse.json({ success: true, quote });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
