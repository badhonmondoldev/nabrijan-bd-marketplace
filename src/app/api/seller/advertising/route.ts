import { NextResponse } from 'next/server';
import { getAuthenticatedSellerStore } from '@/lib/seller-auth';
import { prisma } from '@/lib/db';
import { AdType } from '@prisma/client';

export async function GET() {
  const seller = await getAuthenticatedSellerStore();
  if (!seller) return NextResponse.json({ error: 'Unauthorized seller access' }, { status: 401 });

  try {
    const campaigns = await prisma.adCampaign.findMany({
      where: { storeId: seller.store.id },
      include: {
        product: { select: { title: true, images: true, basePrice: true, salePrice: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalSpend = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const averageCtr = totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 1000) / 10 : 0;

    return NextResponse.json({
      campaigns,
      metrics: {
        totalSpend,
        totalImpressions,
        totalClicks,
        averageCtr,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const seller = await getAuthenticatedSellerStore();
  if (!seller) return NextResponse.json({ error: 'Unauthorized seller access' }, { status: 401 });

  try {
    const { productId, type, budget } = await request.json();

    if (!productId || !budget) {
      return NextResponse.json({ error: 'Product ID and budget required' }, { status: 400 });
    }

    const campaign = await prisma.adCampaign.create({
      data: {
        storeId: seller.store.id,
        productId,
        type: (type as AdType) || AdType.SPONSORED_PRODUCT,
        budget: parseFloat(budget),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
