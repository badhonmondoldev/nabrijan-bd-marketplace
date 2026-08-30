import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const rfqs = await prisma.rfq.findMany({
      include: {
        buyer: { select: { name: true, email: true } },
        quotes: {
          include: { store: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ rfqs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, description, quantity, targetPrice } = await request.json();

    if (!title || !description || !quantity) {
      return NextResponse.json({ error: 'Missing required RFQ fields' }, { status: 400 });
    }

    const rfq = await prisma.rfq.create({
      data: {
        buyerId: session.userId,
        title,
        description,
        quantity: parseInt(quantity, 10),
        targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        status: 'OPEN',
      },
    });

    return NextResponse.json({ success: true, rfq });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
