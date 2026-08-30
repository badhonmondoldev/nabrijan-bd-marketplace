import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { SystemRole } from '@prisma/client';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, password, requestedRole } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    let existingUser = null;
    let dbError = false;

    try {
      existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, ...(phone ? [{ phone }] : [])],
        },
      });
    } catch (err: any) {
      console.warn('Database error in register route, evaluating fallback:', err?.message);
      dbError = true;
    }

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email or phone already exists.' }, { status: 409 });
    }

    const targetRole: SystemRole = (requestedRole as SystemRole) || 'CUSTOMER';

    // Demo Mode Fallback if DB is unlinked or offline
    if (dbError || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_DATABASE_URL')) {
      const sessionPayload = {
        userId: `demo-user-${Date.now()}`,
        email,
        name,
        activeRole: targetRole,
        roles: [targetRole, 'CUSTOMER'] as SystemRole[],
      };
      await setSessionCookie(sessionPayload);
      return NextResponse.json({ success: true, user: sessionPayload, isDemoMode: true });
    }

    const hashedPassword = await hashPassword(password);

    // Find role ID in DB
    const roleRecord = await prisma.role.findUnique({
      where: { name: targetRole },
    });

    const customerRoleRecord = await prisma.role.findUnique({
      where: { name: 'CUSTOMER' },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: hashedPassword,
        defaultRole: targetRole,
        userRoles: {
          create: [
            ...(roleRecord ? [{ roleId: roleRecord.id }] : []),
            ...(customerRoleRecord && targetRole !== 'CUSTOMER' ? [{ roleId: customerRoleRecord.id }] : []),
          ],
        },
        profile: {
          create: {},
        },
        carts: {
          create: {},
        },
      },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    const roles = user.userRoles.map((ur) => ur.role.name);

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      activeRole: targetRole,
      roles,
    };

    await setSessionCookie(sessionPayload);

    try {
      await createAuditLog({
        userId: user.id,
        action: 'USER_REGISTERED',
        entity: 'User',
        entityId: user.id,
        metadata: { email: user.email, activeRole: targetRole },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, user: sessionPayload });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration service encountered an issue. Please try again or use Demo Login.' },
      { status: 500 }
    );
  }
}
