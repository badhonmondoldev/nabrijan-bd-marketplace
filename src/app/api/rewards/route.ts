import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    let account = await prisma.rewardAccount.findUnique({
      where: { userId: session.userId },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!account) {
      account = await prisma.rewardAccount.create({
        data: {
          userId: session.userId,
          points: 100, // Welcome signup bonus 100 pts
          tier: 'BRONZE',
          transactions: {
            create: {
              points: 100,
              type: 'BONUS',
              description: 'Welcome signup reward points',
            },
          },
        },
        include: {
          transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
        },
      });
    }

    return NextResponse.json({ account });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
