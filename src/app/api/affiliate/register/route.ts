import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { SystemRole } from '@prisma/client';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { payoutMethod } = await request.json().catch(() => ({}));

    let affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.userId },
    });

    if (affiliate) {
      if (affiliate.status === 'SUSPENDED') {
        return NextResponse.json({ error: 'Affiliate account is suspended' }, { status: 403 });
      }
      return NextResponse.json({ success: true, affiliate });
    }

    const referralCode = 'REF-BD-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    affiliate = await prisma.affiliate.create({
      data: {
        userId: session.userId,
        referralCode,
        status: 'ACTIVE',
        payoutMethod: payoutMethod || 'bKash',
      },
    });

    // Ensure user has AFFILIATE system role
    const affiliateRole = await prisma.role.findFirst({ where: { name: SystemRole.AFFILIATE } });
    if (affiliateRole) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: session.userId,
            roleId: affiliateRole.id,
          },
        },
        create: {
          userId: session.userId,
          roleId: affiliateRole.id,
        },
        update: {},
      });
    }

    return NextResponse.json({ success: true, affiliate });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Onboarding failed' }, { status: 500 });
  }
}
