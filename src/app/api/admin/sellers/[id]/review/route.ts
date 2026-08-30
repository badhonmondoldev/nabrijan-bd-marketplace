import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { status, rejectionReason, commissionRate } = await request.json();

    if (!['VERIFIED', 'REJECTED', 'SUSPENDED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid store status decision' }, { status: 400 });
    }

    const store = await prisma.store.update({
      where: { id: params.id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason || 'Application rejected' : null,
      },
    });

    await createAuditLog({
      userId: admin.userId,
      action: `SELLER_VERIFICATION_${status}`,
      entity: 'Store',
      entityId: store.id,
      metadata: { status, rejectionReason, commissionRate },
    });

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Review execution failed' }, { status: 500 });
  }
}
