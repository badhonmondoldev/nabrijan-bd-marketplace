import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  calculateListingQualityScore,
  generateAiProductTitle,
  generateAiProductDescription,
  generateAiKeywords,
} from '@/lib/seller-ai';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, keywords, category, title, productData } = body;

    if (action === 'TITLE') {
      const generatedTitle = generateAiProductTitle(keywords || '', category || '');
      return NextResponse.json({ success: true, title: generatedTitle });
    }

    if (action === 'DESCRIPTION') {
      const generatedDescription = generateAiProductDescription(title || '', category || '');
      return NextResponse.json({ success: true, description: generatedDescription });
    }

    if (action === 'KEYWORDS') {
      const generatedKeywords = generateAiKeywords(title || '');
      return NextResponse.json({ success: true, keywords: generatedKeywords });
    }

    if (action === 'QUALITY_SCORE') {
      const qualityScore = calculateListingQualityScore(productData || {});
      return NextResponse.json({ success: true, qualityScore });
    }

    return NextResponse.json({ error: 'Invalid AI action requested' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 });
  }
}
