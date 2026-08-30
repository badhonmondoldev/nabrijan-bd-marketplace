import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: { isDefault: 'desc' },
    });
    return NextResponse.json({ addresses });
  } catch (err) {
    console.warn('Addresses GET DB query fallback engaged:', err);
    return NextResponse.json({ addresses: [] });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { fullName, phone, division, district, upazila, area, detailedAddress, postalCode, isDefault } = body;

    if (!fullName || !phone || !division || !district || !upazila || !detailedAddress) {
      return NextResponse.json({ error: 'All address fields are required.' }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        fullName,
        phone,
        division,
        district,
        upazila,
        area,
        detailedAddress,
        postalCode,
        isDefault: !!isDefault,
      },
    });

    await createAuditLog({
      userId: session.userId,
      action: 'ADDRESS_CREATED',
      entity: 'Address',
      entityId: address.id,
    });

    return NextResponse.json({ success: true, address });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
