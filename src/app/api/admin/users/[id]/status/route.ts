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
    const { isSuspended, reason } = await request.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        status: isSuspended ? 'SUSPENDED' : 'ACTIVE',
      },
    });

    await createAuditLog({
      userId: admin.userId,
      action: isSuspended ? 'USER_ACCOUNT_SUSPENDED' : 'USER_ACCOUNT_ACTIVATED',
      entity: 'User',
      entityId: user.id,
      metadata: { isSuspended: !!isSuspended, reason },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Status update failed' }, { status: 500 });
  }
}
