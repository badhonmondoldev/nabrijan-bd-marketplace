import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'ALL';

  try {
    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        owner: { select: { name: true, email: true, phone: true } },
        products: { select: { id: true } },
        orders: { select: { id: true, totalAmount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ stores });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
