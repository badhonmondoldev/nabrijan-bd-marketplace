import { prisma } from './db';
import { cookies } from 'next/headers';

export async function processOrderCommission(params: {
  orderId: string;
  buyerId: string;
  totalAmount: number;
  referralCodeOverride?: string;
}) {
  const { orderId, buyerId, totalAmount, referralCodeOverride } = params;

  try {
    const cookieStore = cookies();
    const refCode = referralCodeOverride || cookieStore.get('nabrijan_ref')?.value;
    if (!refCode) return null;

    const affiliate = await prisma.affiliate.findUnique({
      where: { referralCode: refCode },
    });

    if (!affiliate || affiliate.status !== 'ACTIVE') return null;

    // Fraud Signal 1: Self-purchase check (Affiliate buying with own link)
    const isSelfPurchase = affiliate.userId === buyerId;

    // Fraud Signal 2: Conversion velocity check in last hour
    const recentCommissionsCount = await prisma.affiliateCommission.count({
      where: {
        affiliateId: affiliate.id,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });

    let riskScore = 'LOW';
    if (isSelfPurchase) {
      riskScore = 'HIGH';
    } else if (recentCommissionsCount > 10) {
      riskScore = 'MEDIUM';
    }

    const rate = 0.05; // 5% affiliate commission
    const commissionAmount = Math.round(totalAmount * rate * 100) / 100;

    const commission = await prisma.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        orderId,
        amount: commissionAmount,
        rate,
        status: 'PENDING',
        riskScore,
      },
    });

    return commission;
  } catch (error) {
    console.error('Error processing affiliate commission:', error);
    return null;
  }
}

export async function updateCommissionOnOrderStatus(orderId: string, newOrderStatus: string) {
  try {
    const commission = await prisma.affiliateCommission.findFirst({
      where: { orderId },
      include: { affiliate: true },
    });

    if (!commission) return;

    if (['CANCELLED', 'RETURNED', 'DISPUTED'].includes(newOrderStatus)) {
      // Reverse commission
      await prisma.affiliateCommission.update({
        where: { id: commission.id },
        data: { status: 'REVERSED' },
      });
      return;
    }

    if (newOrderStatus === 'DELIVERED') {
      // Transition to LOCKED pending return policy window
      if (commission.status === 'PENDING') {
        await prisma.affiliateCommission.update({
          where: { id: commission.id },
          data: { status: 'LOCKED' },
        });
      }
      return;
    }

    if (newOrderStatus === 'COMPLETED') {
      // Transition to APPROVED and credit affiliate wallet
      if (commission.status === 'LOCKED' || commission.status === 'PENDING') {
        await prisma.$transaction(async (tx) => {
          await tx.affiliateCommission.update({
            where: { id: commission.id },
            data: { status: 'APPROVED' },
          });

          await tx.affiliate.update({
            where: { id: commission.affiliateId },
            data: { commissionEarned: { increment: commission.amount } },
          });

          // Update or create affiliate wallet
          const wallet = await tx.wallet.findFirst({
            where: { userId: commission.affiliate.userId, type: 'AFFILIATE_WALLET' },
          });

          if (wallet) {
            await tx.wallet.update({
              where: { id: wallet.id },
              data: { balance: { increment: commission.amount } },
            });

            await tx.walletTransaction.create({
              data: {
                walletId: wallet.id,
                amount: commission.amount,
                type: 'CREDIT',
                currency: 'BDT',
                status: 'COMPLETED',
                referenceType: 'COMMISSION',
                referenceId: orderId,
                description: `Affiliate commission credited for order #${orderId.slice(0, 8)}`,
              },
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Error updating affiliate commission status:', error);
  }
}
