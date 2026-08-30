import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CouponType } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  try {
    const where: any = {};
    if (storeId) where.storeId = storeId;

    const coupons = await prisma.coupon.findMany({
      where,
      include: {
        store: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { code, type, discountValue, minOrderValue, maxDiscount, usageLimit, startDate, endDate, storeId } =
      await request.json();

    if (!code || !discountValue || !endDate) {
      return NextResponse.json({ error: 'Missing required coupon fields' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type: (type as CouponType) || CouponType.PERCENTAGE,
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        storeId: storeId || null,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
