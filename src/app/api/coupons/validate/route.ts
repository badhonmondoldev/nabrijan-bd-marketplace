import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { code, cartSubtotal, storeId, buyerId } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { usages: true },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' }, { status: 404 });
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return NextResponse.json({ valid: false, message: 'Coupon code has expired or is not yet active' });
    }

    if (coupon.storeId && storeId && coupon.storeId !== storeId) {
      return NextResponse.json({ valid: false, message: 'Coupon is not valid for this merchant store' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: 'Coupon maximum total usage limit reached' });
    }

    if (buyerId) {
      const userUsage = coupon.usages.find((u) => u.userId === buyerId);
      if (userUsage) {
        return NextResponse.json({ valid: false, message: 'You have already used this coupon code' });
      }
    }

    if (coupon.minOrderValue && cartSubtotal < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of ৳${coupon.minOrderValue} required for this coupon`,
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'FIXED_DISCOUNT') {
      discountAmount = coupon.discountValue;
    } else if (coupon.type === 'FREE_SHIPPING') {
      discountAmount = 60; // Standard 60 BDT delivery fee waiver
    }

    return NextResponse.json({
      valid: true,
      discountAmount: Math.min(discountAmount, cartSubtotal),
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
