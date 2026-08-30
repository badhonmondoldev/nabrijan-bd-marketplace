'use client';

import { useState } from 'react';
import { SystemRole } from '@prisma/client';
import { UserCheck, Shield, Store, Share2, ShoppingBag, User } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: SystemRole;
  userRoles: SystemRole[];
}

export default function RoleSwitcher({ currentRole, userRoles }: RoleSwitcherProps) {
  const [loading, setLoading] = useState(false);

  const roleIcons: Record<SystemRole, any> = {
    SUPER_ADMIN: Shield,
    ADMIN: Shield,
    SUPPORT: Shield,
    SELLER: Store,
    AFFILIATE: Share2,
    CUSTOMER: ShoppingBag,
  };

  const handleRoleSwitch = async (role: SystemRole) => {
    if (role === currentRole || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole: role }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Role switch failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1 text-xs">
      <span className="text-emerald-800 font-medium hidden sm:inline">Active Mode:</span>
      <div className="flex items-center space-x-1">
        {userRoles.map((role) => {
          const Icon = roleIcons[role] || User;
          const isActive = role === currentRole;
          return (
            <button
              key={role}
              onClick={() => handleRoleSwitch(role)}
              disabled={loading}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-100 border border-slate-200'
              }`}
              title={`Switch view to ${role}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{role}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
