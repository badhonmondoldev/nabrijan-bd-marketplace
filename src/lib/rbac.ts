import { SystemRole } from '@prisma/client';

export const SYSTEM_PERMISSIONS = {
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_SUSPEND: 'users.suspend',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_UPDATE: 'products.update',
  PRODUCTS_APPROVE: 'products.approve',
  ORDERS_READ: 'orders.read',
  ORDERS_UPDATE: 'orders.update',
  FINANCE_READ: 'finance.read',
  FINANCE_MANAGE: 'finance.manage',
  STORES_MANAGE: 'stores.manage',
  AFFILIATE_MANAGE: 'affiliate.manage',
} as const;

export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRole, string[]> = {
  SUPER_ADMIN: Object.values(SYSTEM_PERMISSIONS),
  ADMIN: [
    SYSTEM_PERMISSIONS.USERS_READ,
    SYSTEM_PERMISSIONS.USERS_UPDATE,
    SYSTEM_PERMISSIONS.PRODUCTS_CREATE,
    SYSTEM_PERMISSIONS.PRODUCTS_UPDATE,
    SYSTEM_PERMISSIONS.PRODUCTS_APPROVE,
    SYSTEM_PERMISSIONS.ORDERS_READ,
    SYSTEM_PERMISSIONS.ORDERS_UPDATE,
    SYSTEM_PERMISSIONS.FINANCE_READ,
    SYSTEM_PERMISSIONS.STORES_MANAGE,
  ],
  SUPPORT: [
    SYSTEM_PERMISSIONS.USERS_READ,
    SYSTEM_PERMISSIONS.ORDERS_READ,
    SYSTEM_PERMISSIONS.ORDERS_UPDATE,
  ],
  SELLER: [
    SYSTEM_PERMISSIONS.PRODUCTS_CREATE,
    SYSTEM_PERMISSIONS.PRODUCTS_UPDATE,
    SYSTEM_PERMISSIONS.ORDERS_READ,
    SYSTEM_PERMISSIONS.ORDERS_UPDATE,
    SYSTEM_PERMISSIONS.FINANCE_READ,
  ],
  AFFILIATE: [
    SYSTEM_PERMISSIONS.AFFILIATE_MANAGE,
    SYSTEM_PERMISSIONS.FINANCE_READ,
  ],
  CUSTOMER: [
    SYSTEM_PERMISSIONS.ORDERS_READ,
  ],
};

export function userHasRole(userRoles: SystemRole[], role: SystemRole): boolean {
  if (userRoles.includes('SUPER_ADMIN')) return true;
  return userRoles.includes(role);
}

export function userHasPermission(userRoles: SystemRole[], permission: string): boolean {
  if (userRoles.includes('SUPER_ADMIN')) return true;
  return userRoles.some((role) => {
    const perms = DEFAULT_ROLE_PERMISSIONS[role] || [];
    return perms.includes(permission);
  });
}
