import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { SystemRole } from '@prisma/client';

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'nabrijan_secure_production_jwt_key_2026_bd_marketplace';
  return new TextEncoder().encode(secret);
}

const JWT_SECRET = getJwtSecretKey();

const TOKEN_NAME = 'nabrijan_session';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  activeRole: SystemRole;
  roles: SystemRole[];
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getUserRoles(userId: string): Promise<SystemRole[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.map((ur) => ur.role.name);
}
