import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({ store: auth.store });
}

export async function PUT(request: Request) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      name,
      description,
      logo,
      banner,
      bkashNumber,
      nagadNumber,
      bankName,
      bankAccountNo,
    } = body;

    const updatedStore = await prisma.store.update({
      where: { id: auth.store.id },
      data: {
        name: name || auth.store.name,
        description,
        logo,
        banner,
        bkashNumber,
        nagadNumber,
        bankName,
        bankAccountNo,
      },
    });

    await createAuditLog({
      userId: auth.userId,
      action: 'STORE_SETTINGS_UPDATED',
      entity: 'Store',
      entityId: updatedStore.id,
    });

    return NextResponse.json({ success: true, store: updatedStore });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Store update failed' }, { status: 500 });
  }
}
