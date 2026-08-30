import { NextResponse } from 'next/server';
import { clearSessionCookie, getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST() {
  const session = await getSession();
  if (session) {
    await createAuditLog({
      userId: session.userId,
      action: 'USER_LOGOUT',
      entity: 'User',
      entityId: session.userId,
    });
  }
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
