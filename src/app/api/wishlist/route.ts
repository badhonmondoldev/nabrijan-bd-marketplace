import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ wishlist: [] });

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: { include: { images: true, store: true } },
          },
        },
      },
    });

    return NextResponse.json({ wishlist: wishlist?.items || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { productId, variantId } = await request.json();

    let wishlist = await prisma.wishlist.findUnique({ where: { userId: session.userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: session.userId } });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId_variantId: {
          wishlistId: wishlist.id,
          productId,
          variantId: variantId || null,
        },
      },
    });

    if (existingItem) {
      await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      const item = await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
          variantId: variantId || null,
        },
      });

      await createAuditLog({
        userId: session.userId,
        action: 'WISHLIST_ADD',
        entity: 'WishlistItem',
        entityId: item.id,
      });

      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
