import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize Prisma client with safe default environment variable handling
const getPrismaClient = (): PrismaClient => {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_DATABASE_URL')) {
    // Provide safe fallback database string so Prisma Client initialization does not throw at startup
    process.env.DATABASE_URL = 'postgresql://postgres:fallback_password_2026@localhost:5432/nabrijan_fallback_db';
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
