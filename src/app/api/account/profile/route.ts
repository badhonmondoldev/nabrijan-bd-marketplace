import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      userRoles: { include: { role: true } },
    },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 444 });

  const { passwordHash, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, phone, bio, gender, nidNumber, tradeLicense } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        phone: phone || null,
        profile: {
          upsert: {
            create: { bio, gender, nidNumber, tradeLicense },
            update: { bio, gender, nidNumber, tradeLicense },
          },
        },
      },
      include: { profile: true },
    });

    await createAuditLog({
      userId: session.userId,
      action: 'PROFILE_UPDATED',
      entity: 'User',
      entityId: session.userId,
    });

    const { passwordHash, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
