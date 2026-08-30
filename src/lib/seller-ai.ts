/**
 * NABRIJAN MARKET — Modular Seller AI Assistant & Quality Score Engine
 */

export interface ListingQualityScoreResult {
  score: number; // 0 to 100
  grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'POOR';
  recommendations: string[];
}

export function calculateListingQualityScore(product: {
  title?: string;
  description?: string;
  categoryId?: string;
  basePrice?: number;
  sku?: string;
  images?: any[];
  variants?: any[];
  isWholesale?: boolean;
}): ListingQualityScoreResult {
  let score = 0;
  const recommendations: string[] = [];

  // Title Quality (Max 25 pts)
  if (product.title) {
    if (product.title.length >= 15 && product.title.length <= 100) {
      score += 25;
    } else if (product.title.length > 5) {
      score += 15;
      recommendations.push('Title is short. Add brand, key specification, or model for better search visibility.');
    }
  } else {
    recommendations.push('Product title is required.');
  }

  // Description Quality (Max 25 pts)
  if (product.description) {
    if (product.description.length >= 100) {
      score += 25;
    } else if (product.description.length >= 30) {
      score += 15;
      recommendations.push('Add more details to description (warranty, package contents, origin).');
    }
  } else {
    recommendations.push('Product description is missing.');
  }

  // Product Images (Max 25 pts)
  if (product.images && product.images.length > 0) {
    if (product.images.length >= 3) {
      score += 25;
    } else {
      score += 15;
      recommendations.push('Upload at least 3 high-resolution images showing different angles.');
    }
  } else {
    recommendations.push('At least 1 product image is required.');
  }

  // Pricing & SKU (Max 15 pts)
  if (product.basePrice && product.basePrice > 0) {
    score += 10;
  } else {
    recommendations.push('Valid base price is required.');
  }

  if (product.sku && product.sku.trim().length > 3) {
    score += 5;
  } else {
    recommendations.push('Add a unique SKU code for inventory tracking.');
  }

  // Category & Wholesale/Variants (Max 10 pts)
  if (product.categoryId) {
    score += 5;
  } else {
    recommendations.push('Select a specific product category.');
  }

  if ((product.variants && product.variants.length > 0) || product.isWholesale) {
    score += 5;
  } else {
    recommendations.push('Add product variants (Color/Size) or wholesale MOQ tiers for higher buyer conversion.');
  }

  let grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'POOR' = 'POOR';
  if (score >= 85) grade = 'EXCELLENT';
  else if (score >= 70) grade = 'GOOD';
  else if (score >= 50) grade = 'NEEDS_ATTENTION';

  return { score, grade, recommendations };
}

export function generateAiProductTitle(keywords: string, category: string): string {
  const cleanKeywords = keywords.trim() || 'Premium BD Product';
  return `[Official BD] ${cleanKeywords} — Authentic ${category || 'Marketplace'} Edition`;
}

export function generateAiProductDescription(title: string, category: string): string {
  const itemTitle = title || 'High Quality Bangladesh Product';
  return `Discover authentic ${itemTitle}. Carefully curated for Bangladeshi buyers with official warranty, door-to-door nationwide delivery, and cash on delivery enablement.\n\nKey Highlights:\n- 100% Authentic Guaranteed\n- Fast Express Shipping across 64 Districts\n- bKash / Nagad / COD Payment Ready`;
}

export function generateAiKeywords(title: string): string[] {
  const words = (title || 'bangladesh product ecommerce').toLowerCase().split(/\s+/);
  const baseTags = ['bangladesh', 'online shopping', 'nabrijan', 'best price', 'express delivery'];
  return Array.from(new Set([...words.filter((w) => w.length > 3), ...baseTags])).slice(0, 8);
}
