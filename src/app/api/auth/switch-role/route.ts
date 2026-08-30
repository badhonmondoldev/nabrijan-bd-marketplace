import { NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/auth';
import { SystemRole } from '@prisma/client';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newRole } = await request.json();
    const targetRole = newRole as SystemRole;

    if (!session.roles.includes(targetRole) && !session.roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'You do not have permission for this role.' }, { status: 403 });
    }

    const updatedSession = {
      ...session,
      activeRole: targetRole,
    };

    await setSessionCookie(updatedSession);

    await createAuditLog({
      userId: session.userId,
      action: 'ROLE_SWITCHED',
      entity: 'User',
      entityId: session.userId,
      metadata: { fromRole: session.activeRole, toRole: targetRole },
    });

    return NextResponse.json({ success: true, user: updatedSession });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
