import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        category: true,
        brand: true,
        variants: true,
        inventories: true,
      },
    });

    if (!product || product.storeId !== auth.store.id) {
      return NextResponse.json({ error: 'Product not found or access denied.' }, { status: 403 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing || existing.storeId !== auth.store.id) {
      return NextResponse.json({ error: 'Access denied to this product.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      basePrice,
      salePrice,
      stockQuantity,
      sku,
      barcode,
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
      metaTitle,
      metaDescription,
      status,
    } = body;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        title,
        description,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQuantity: parseInt(stockQuantity),
        sku,
        barcode: barcode || null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        lengthCm: lengthCm ? parseFloat(lengthCm) : null,
        widthCm: widthCm ? parseFloat(widthCm) : null,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        metaTitle,
        metaDescription,
        status: status || existing.status,
      },
    });

    await createAuditLog({
      userId: auth.userId,
      action: 'SELLER_PRODUCT_UPDATED',
      entity: 'Product',
      entityId: updated.id,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Product update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing || existing.storeId !== auth.store.id) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const archived = await prisma.product.update({
      where: { id: params.id },
      data: { status: 'ARCHIVED' },
    });

    await createAuditLog({
      userId: auth.userId,
      action: 'SELLER_PRODUCT_ARCHIVED',
      entity: 'Product',
      entityId: archived.id,
    });

    return NextResponse.json({ success: true, action: 'archived' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
