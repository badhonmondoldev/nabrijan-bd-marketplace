import { prisma } from './db';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface FraudEvaluationResult {
  riskScore: RiskLevel;
  reasons: string[];
  requiresManualReview: boolean;
}

export async function evaluateAffiliateConversionRisk({
  affiliateId,
  buyerId,
  ipAddress,
}: {
  affiliateId: string;
  buyerId: string;
  ipAddress?: string;
}): Promise<FraudEvaluationResult> {
  const reasons: string[] = [];

  // Check 1: Self referral (Affiliate user ID === Buyer user ID)
  const affiliate = await prisma.affiliate.findUnique({ where: { id: affiliateId } });
  if (affiliate && affiliate.userId === buyerId) {
    reasons.push('Self-referral detected: Affiliate user is purchasing using their own link.');
    return {
      riskScore: 'HIGH',
      reasons,
      requiresManualReview: true,
    };
  }

  // Check 2: High conversion frequency from single IP
  if (ipAddress) {
    const recentClicks = await prisma.affiliateClick.count({
      where: {
        ipAddress,
        createdAt: { gte: new Date(Date.now() - 3600000) }, // last 1 hour
      },
    });

    if (recentClicks > 20) {
      reasons.push(`Suspicious click rate (${recentClicks} clicks/hr) from IP ${ipAddress}.`);
      return {
        riskScore: 'MEDIUM',
        reasons,
        requiresManualReview: true,
      };
    }
  }

  return {
    riskScore: 'LOW',
    reasons: ['Normal conversion pattern'],
    requiresManualReview: false,
  };
}
