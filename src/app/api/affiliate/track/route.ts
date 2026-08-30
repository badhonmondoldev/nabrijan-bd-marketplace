import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { refCode, productId } = await request.json();
    if (!refCode) return NextResponse.json({ error: 'Referral code required' }, { status: 400 });

    const affiliate = await prisma.affiliate.findUnique({
      where: { referralCode: refCode },
    });

    if (!affiliate || affiliate.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, reason: 'Invalid or inactive referral code' });
    }

    // Set 30-day HTTP-only referral cookie
    const cookieStore = cookies();
    cookieStore.set('nabrijan_ref', refCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Log click if product link match exists
    if (productId) {
      const link = await prisma.affiliateLink.findFirst({
        where: { affiliateId: affiliate.id, productId },
      });

      if (link) {
        await prisma.affiliateLink.update({
          where: { id: link.id },
          data: { clicksCount: { increment: 1 } },
        });

        await prisma.affiliateClick.create({
          data: {
            linkId: link.id,
            ipAddress: 'ANONYMIZED_IP',
            userAgent: 'PRIVACY_PRESERVED',
          },
        });
      }
    }

    return NextResponse.json({ success: true, trackedCode: refCode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
