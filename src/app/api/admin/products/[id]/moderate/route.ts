import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { status, notes } = await request.json();

    if (!['ACTIVE', 'REJECTED', 'DRAFT', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid product moderation status' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { status },
    });

    await createAuditLog({
      userId: admin.userId,
      action: `PRODUCT_MODERATED_${status}`,
      entity: 'Product',
      entityId: product.id,
      metadata: { status, notes },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Moderation failed' }, { status: 500 });
  }
}
