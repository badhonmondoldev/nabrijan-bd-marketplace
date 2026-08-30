import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';
import { InventoryTxType } from '@prisma/client';

export async function GET() {
  const auth = await getAuthenticatedSellerStore();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      where: { storeId: auth.store.id },
      include: {
        inventories: {
          include: {
            transactions: {
              take: 50,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
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
    const { productId, type, quantity, notes } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json({ error: 'Product ID, transaction type, and quantity are required.' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventories: true },
    });

    if (!product || product.storeId !== auth.store.id) {
      return NextResponse.json({ error: 'Product not found or access denied.' }, { status: 403 });
    }

    const delta = parseInt(quantity);
    let inventory = product.inventories[0];

    // Ensure warehouse and inventory record exist
    if (!inventory) {
      let warehouse = await prisma.warehouse.findFirst({ where: { storeId: auth.store.id } });
      if (!warehouse) {
        warehouse = await prisma.warehouse.create({
          data: {
            storeId: auth.store.id,
            name: `${auth.store.name} Primary Hub`,
            location: 'Dhaka Hub',
          },
        });
      }

      inventory = await prisma.inventory.create({
        data: {
          warehouseId: warehouse.id,
          productId: product.id,
          totalStock: product.stockQuantity,
          reserved: 0,
        },
      });
    }

    // Execute atomic transaction for inventory update and transaction log record
    let newTotalStock = inventory.totalStock;
    if (type === 'RESTOCK' || type === 'RETURN') {
      newTotalStock += delta;
    } else if (type === 'DAMAGE' || type === 'SALE') {
      newTotalStock = Math.max(0, newTotalStock - delta);
    } else if (type === 'ADJUSTMENT') {
      newTotalStock = delta; // Set exact value
    }

    await prisma.$transaction([
      prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          totalStock: newTotalStock,
        },
      }),
      prisma.product.update({
        where: { id: product.id },
        data: { stockQuantity: newTotalStock },
      }),
      prisma.inventoryTransaction.create({
        data: {
          inventoryId: inventory.id,
          type: type as InventoryTxType,
          quantity: delta,
          notes: notes || `Stock ${type} update by seller`,
        },
      }),
    ]);

    await createAuditLog({
      userId: auth.userId,
      action: 'INVENTORY_STOCK_TRANSACTION',
      entity: 'Inventory',
      entityId: inventory.id,
      metadata: { type, quantity: delta, newTotalStock },
    });

    return NextResponse.json({ success: true, newTotalStock });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Inventory transaction failed' }, { status: 500 });
  }
}
