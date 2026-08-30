import { getSession } from './auth';
import { prisma } from './db';

export interface SellerAuthResult {
  userId: string;
  store: any;
}

export async function getAuthenticatedSellerStore(): Promise<SellerAuthResult | null> {
  const session = await getSession();
  if (!session) return null;

  try {
    const store = await prisma.store.findFirst({
      where: { ownerId: session.userId },
    });

    if (!store) return null;

    return {
      userId: session.userId,
      store,
    };
  } catch (e) {
    return null;
  }
}

export async function verifyStoreOwnership(userId: string, storeId: string): Promise<boolean> {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    return store ? store.ownerId === userId : false;
  } catch (e) {
    return false;
  }
}
