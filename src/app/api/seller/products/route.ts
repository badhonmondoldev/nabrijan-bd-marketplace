import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET(request: Request) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const where: any = { storeId: auth.store.id };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        brand: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      title,
      description,
      basePrice,
      salePrice,
      stockQuantity,
      sku,
      barcode,
      categoryId,
      brandId,
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
      metaTitle,
      metaDescription,
      isDraft,
      images,
      variants,
    } = body;

    if (!title || !basePrice || !sku) {
      return NextResponse.json({ error: 'Title, base price, and SKU are required.' }, { status: 400 });
    }

    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const productStatus = isDraft ? 'DRAFT' : 'PENDING_REVIEW';

    // Find default category if none provided
    let targetCatId = categoryId;
    if (!targetCatId) {
      const firstCat = await prisma.category.findFirst();
      targetCatId = firstCat?.id;
    }

    // Ensure warehouse exists for store
    let warehouse = await prisma.warehouse.findFirst({ where: { storeId: auth.store.id } });
    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: {
          storeId: auth.store.id,
          name: `${auth.store.name} Warehouse`,
          location: 'Dhaka',
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        storeId: auth.store.id,
        categoryId: targetCatId,
        brandId: brandId || null,
        title,
        slug: cleanSlug,
        description: description || '',
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQuantity: parseInt(stockQuantity || '0'),
        sku,
        barcode: barcode || null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        lengthCm: lengthCm ? parseFloat(lengthCm) : null,
        widthCm: widthCm ? parseFloat(widthCm) : null,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
        status: productStatus,
        images: {
          create: (images || ['https://picsum.photos/600/600']).map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
        variants: variants && Array.isArray(variants) ? {
          create: variants.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            price: parseFloat(v.price),
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            stockQuantity: parseInt(v.stockQuantity || '0'),
          })),
        } : undefined,
        inventories: {
          create: {
            warehouseId: warehouse.id,
            totalStock: parseInt(stockQuantity || '0'),
            reserved: 0,
          },
        },
      },
      include: { images: true, variants: true },
    });

    await createAuditLog({
      userId: auth.userId,
      action: isDraft ? 'SELLER_PRODUCT_DRAFT_CREATED' : 'SELLER_PRODUCT_SUBMITTED',
      entity: 'Product',
      entityId: product.id,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Product creation failed' }, { status: 500 });
  }
}
