import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Refresh user state from DB
  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!dbUser || dbUser.status === 'SUSPENDED') {
    return NextResponse.json({ user: null });
  }

  const roles = dbUser.userRoles.map((ur) => ur.role.name);

  return NextResponse.json({
    user: {
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      phone: dbUser.phone,
      activeRole: session.activeRole,
      roles,
    },
  });
}
