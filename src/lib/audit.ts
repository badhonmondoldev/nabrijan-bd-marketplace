import { prisma } from './db';

export async function createAuditLog({
  userId,
  action,
  entity,
  entityId,
  metadata,
  ipAddress,
}: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any> | string;
  ipAddress?: string;
}) {
  try {
    const metaString = typeof metadata === 'object' ? JSON.stringify(metadata) : metadata;
    return await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entity,
        entityId: entityId || null,
        metadata: metaString || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}
