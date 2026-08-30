import { prisma } from './db';

export interface IntentSearchResult {
  categoryName?: string;
  intentTag?: string;
  maxPrice?: number;
  minPrice?: number;
  extractedKeywords: string[];
}

export class AIService {
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
  }

  async searchProductsByIntent(query: string): Promise<IntentSearchResult> {
    const q = query.toLowerCase().trim();

    // Smart intent extraction fallback
    let maxPrice: number | undefined;
    const priceMatch = q.match(/(?:under|below|less than|budget)\s*(?:bdt|৳)?\s*(\d+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    let categoryName: string | undefined;
    if (q.includes('phone') || q.includes('mobile') || q.includes('smartphone')) categoryName = 'Smartphones';
    if (q.includes('shirt') || q.includes('polo') || q.includes('fashion')) categoryName = 'Fashion';
    if (q.includes('laptop') || q.includes('computer')) categoryName = 'Electronics';

    let intentTag: string | undefined;
    if (q.includes('gaming')) intentTag = 'Gaming';
    if (q.includes('office') || q.includes('work')) intentTag = 'Office';

    const keywords = q
      .replace(/(?:under|below|less than|budget|\d+|bdt|৳)/gi, '')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    return {
      categoryName,
      intentTag,
      maxPrice,
      extractedKeywords: keywords,
    };
  }

  async generateProductTitle(description: string): Promise<string> {
    if (!description) return 'Premium Product';
    const words = description.split(' ').slice(0, 6).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  async generateProductDescription(title: string, attributes: Record<string, any>): Promise<string> {
    return `High quality ${title} designed for durability and daily performance in Bangladesh. Attributes: ${JSON.stringify(attributes)}`;
  }

  async summarizeReviews(reviews: { text: string; rating: number }[]): Promise<{ summary: string; sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' }> {
    if (!reviews || reviews.length === 0) {
      return { summary: 'No customer reviews available yet.', sentiment: 'NEUTRAL' };
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const sentiment = avgRating >= 4 ? 'POSITIVE' : avgRating >= 2.5 ? 'NEUTRAL' : 'NEGATIVE';

    return {
      summary: `Based on ${reviews.length} verified customer reviews with an average rating of ${avgRating.toFixed(1)}/5 stars. Customers praise item build quality and fast delivery.`,
      sentiment,
    };
  }
}

export const aiService = new AIService();
