import { NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { SystemRole } from '@prisma/client';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { roleToEnable } = await request.json();
    const targetRole = roleToEnable as SystemRole;

    const allowedSelfAdd: SystemRole[] = ['SELLER', 'AFFILIATE', 'CUSTOMER'];
    if (!allowedSelfAdd.includes(targetRole)) {
      return NextResponse.json({ error: 'Role cannot be self-assigned.' }, { status: 400 });
    }

    const roleRecord = await prisma.role.findUnique({ where: { name: targetRole } });
    if (!roleRecord) return NextResponse.json({ error: 'Role invalid' }, { status: 400 });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: session.userId,
          roleId: roleRecord.id,
        },
      },
      update: {},
      create: {
        userId: session.userId,
        roleId: roleRecord.id,
      },
    });

    // If seller role, ensure a default store is created or pending setup
    if (targetRole === 'SELLER') {
      const existingStore = await prisma.store.findFirst({ where: { ownerId: session.userId } });
      if (!existingStore) {
        const user = await prisma.user.findUnique({ where: { id: session.userId } });
        const storeName = `${user?.name || 'Vendor'}'s Store`;
        const slug = `${storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

        await prisma.store.create({
          data: {
            ownerId: session.userId,
            name: storeName,
            slug,
            description: 'New multi-vendor store on Nabrijan Market',
            status: 'PENDING',
          },
        });
      }
    }

    // If affiliate role, create affiliate profile
    if (targetRole === 'AFFILIATE') {
      const existingAff = await prisma.affiliate.findUnique({ where: { userId: session.userId } });
      if (!existingAff) {
        const refCode = `NBD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await prisma.affiliate.create({
          data: {
            userId: session.userId,
            referralCode: refCode,
            status: 'ACTIVE',
          },
        });
      }
    }

    const allUserRoles = await prisma.userRole.findMany({
      where: { userId: session.userId },
      include: { role: true },
    });

    const roles = allUserRoles.map((ur) => ur.role.name);

    const newSession = {
      ...session,
      activeRole: targetRole,
      roles,
    };

    await setSessionCookie(newSession);

    await createAuditLog({
      userId: session.userId,
      action: 'ROLE_ENABLED',
      entity: 'UserRole',
      metadata: { role: targetRole },
    });

    return NextResponse.json({ success: true, user: newSession });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
