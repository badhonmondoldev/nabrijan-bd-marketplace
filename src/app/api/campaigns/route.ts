import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { CampaignType } from '@prisma/client';

export async function GET() {
  try {
    const now = new Date();

    const campaigns = await prisma.campaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        products: {
          include: {
            product: {
              include: { images: true, store: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { endDate: 'asc' },
    });

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { title, type, bannerUrl, startDate, endDate, products } = await request.json();

    if (!title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required campaign parameters' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);

    const campaign = await prisma.campaign.create({
      data: {
        title,
        slug,
        type: (type as CampaignType) || CampaignType.FLASH_SALE,
        bannerUrl: bannerUrl || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true,
        products: {
          create: (products || []).map((p: any) => ({
            productId: p.productId,
            promoPrice: parseFloat(p.promoPrice),
            stockLimit: parseInt(p.stockLimit, 10),
          })),
        },
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
