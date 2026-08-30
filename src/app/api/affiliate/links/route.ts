import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { productId, campaignSlug } = await request.json();

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.userId },
    });

    if (!affiliate || affiliate.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Active affiliate account required' }, { status: 403 });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const code = `${affiliate.referralCode}-${product.slug.slice(0, 10)}`;
    const url = `/product/${product.slug}?ref=${affiliate.referralCode}`;

    let link = await prisma.affiliateLink.findFirst({
      where: { affiliateId: affiliate.id, productId },
    });

    if (!link) {
      link = await prisma.affiliateLink.create({
        data: {
          affiliateId: affiliate.id,
          productId,
          code,
          url,
        },
      });
    }

    return NextResponse.json({ success: true, link, referralCode: affiliate.referralCode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
