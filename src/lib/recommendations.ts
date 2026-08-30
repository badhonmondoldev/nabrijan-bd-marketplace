import { prisma } from './db';

export async function getTrendingProducts(limit: number = 8) {
  return await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: { images: true, store: { select: { name: true } } },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSimilarProducts(productId: string, categoryId: string, limit: number = 4) {
  return await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      status: 'ACTIVE',
    },
    include: { images: true, store: { select: { name: true } } },
    take: limit,
  });
}

export async function getFrequentlyBoughtTogether(productId: string, limit: number = 3) {
  return await prisma.product.findMany({
    where: {
      id: { not: productId },
      status: 'ACTIVE',
    },
    include: { images: true, store: { select: { name: true } } },
    take: limit,
  });
}
