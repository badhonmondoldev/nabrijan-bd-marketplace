import { getSession } from './auth';
import { prisma } from './db';
import { SystemRole } from '@prisma/client';

export async function getAuthenticatedAdmin() {
  const session = await getSession();
  if (!session) return null;

  // Check if activeRole is ADMIN or SUPER_ADMIN
  if (session.activeRole === SystemRole.ADMIN || session.activeRole === SystemRole.SUPER_ADMIN) {
    return { userId: session.userId, session };
  }

  // Check user_roles database table for explicit ADMIN or SUPER_ADMIN permission
  const adminRole = await prisma.userRole.findFirst({
    where: {
      userId: session.userId,
      role: {
        name: { in: [SystemRole.ADMIN, SystemRole.SUPER_ADMIN] },
      },
    },
    include: { role: true },
  });

  if (!adminRole) return null;

  return { userId: session.userId, session };
}
