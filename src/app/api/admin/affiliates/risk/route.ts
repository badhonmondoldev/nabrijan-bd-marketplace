import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const flaggedCommissions = await prisma.affiliateCommission.findMany({
      where: {
        riskScore: { in: ['HIGH', 'MEDIUM'] },
      },
      include: {
        affiliate: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        order: { select: { id: true, totalAmount: true, buyerId: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const affiliates = await prisma.affiliate.findMany({
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { commissions: true, links: true } },
      },
      orderBy: { commissionEarned: 'desc' },
    });

    return NextResponse.json({ flaggedCommissions, affiliates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { commissionId, affiliateId, action, notes } = await request.json();

    if (action === 'CLEAR_RISK' && commissionId) {
      await prisma.affiliateCommission.update({
        where: { id: commissionId },
        data: { riskScore: 'LOW' },
      });
    } else if (action === 'REVERSE_COMMISSION' && commissionId) {
      await prisma.affiliateCommission.update({
        where: { id: commissionId },
        data: { status: 'REVERSED', riskScore: 'LOW' },
      });
    } else if (action === 'SUSPEND_AFFILIATE' && affiliateId) {
      await prisma.affiliate.update({
        where: { id: affiliateId },
        data: { status: 'SUSPENDED' },
      });
    }

    await createAuditLog({
      userId: admin.userId,
      action: `AFFILIATE_RISK_ACTION_${action}`,
      entity: 'AffiliateCommission',
      entityId: commissionId || affiliateId,
      metadata: { action, notes },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
