import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ items: [] });

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: { include: { images: true, store: true } },
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { productId, variantId, quantity } = await request.json();

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Product ID and valid quantity are required.' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product || product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Product not available.' }, { status: 404 });
    }

    const currentPrice = product.salePrice || product.basePrice;

    // Check variant stock if specified, otherwise base product stock
    let availableStock = product.stockQuantity;
    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) availableStock = variant.stockQuantity;
    }

    if (availableStock < quantity) {
      return NextResponse.json({ error: `Insufficient stock available (${availableStock} items remaining).` }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (availableStock < newQty) {
        return NextResponse.json({ error: `Cannot add more. Max stock available: ${availableStock}` }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQty,
          priceAtAdd: currentPrice,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
          priceAtAdd: currentPrice,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { itemId } = await request.json();
    if (!itemId) return NextResponse.json({ error: 'Item ID required' }, { status: 400 });

    await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
