import { aiService, IntentSearchResult } from './ai-service';
import { prisma } from './db';

export async function smartSearchProducts(query: string) {
  const intent: IntentSearchResult = await aiService.searchProductsByIntent(query);

  const where: any = {
    status: 'ACTIVE',
  };

  if (intent.maxPrice) {
    where.basePrice = { lte: intent.maxPrice };
  }

  if (intent.categoryName) {
    where.category = {
      name: { contains: intent.categoryName, mode: 'insensitive' },
    };
  }

  if (intent.extractedKeywords.length > 0) {
    where.OR = intent.extractedKeywords.map((kw) => ({
      OR: [
        { title: { contains: kw, mode: 'insensitive' } },
        { description: { contains: kw, mode: 'insensitive' } },
      ],
    }));
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      images: true,
      store: { select: { name: true } },
    },
    take: 24,
    orderBy: { createdAt: 'desc' },
  });

  return {
    query,
    intent,
    products,
  };
}
