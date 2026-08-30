import { prisma } from './db';
import { LedgerTxType, WalletType } from '@prisma/client';

export async function getOrCreateWallet(owner: { userId?: string; storeId?: string }, type: WalletType) {
  let wallet = await prisma.wallet.findFirst({
    where: {
      userId: owner.userId || null,
      storeId: owner.storeId || null,
      type,
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId: owner.userId || null,
        storeId: owner.storeId || null,
        type,
        balance: 0.0,
        frozenBalance: 0.0,
        currency: 'BDT',
      },
    });
  }

  return wallet;
}

export async function recordLedgerTransaction({
  walletId,
  type,
  amount,
  referenceType,
  referenceId,
  description,
}: {
  walletId: string;
  type: LedgerTxType;
  amount: number;
  referenceType?: string;
  referenceId?: string;
  description?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    let newBalance = wallet.balance;
    let newFrozen = wallet.frozenBalance;

    if (type === 'CREDIT' || type === 'RELEASE') {
      newBalance += amount;
      if (type === 'RELEASE') newFrozen = Math.max(0, newFrozen - amount);
    } else if (type === 'DEBIT' || type === 'PAYOUT' || type === 'REFUND') {
      if (wallet.balance < amount) {
        throw new Error('Insufficient wallet balance for ledger operation.');
      }
      newBalance -= amount;
    } else if (type === 'HOLD') {
      if (wallet.balance < amount) {
        throw new Error('Insufficient wallet balance to hold funds.');
      }
      newBalance -= amount;
      newFrozen += amount;
    }

    await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: newBalance,
        frozenBalance: newFrozen,
      },
    });

    const ledgerTx = await tx.walletTransaction.create({
      data: {
        walletId,
        type,
        amount,
        currency: 'BDT',
        status: 'COMPLETED',
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        description: description || null,
      },
    });

    return ledgerTx;
  });
}
