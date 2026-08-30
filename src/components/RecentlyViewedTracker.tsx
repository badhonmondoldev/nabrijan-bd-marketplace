'use client';

import { useEffect } from 'react';

export default function RecentlyViewedTracker({ productId }: { productId: string }) {
  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem('nabrijan_recent_products') || '[]');
      const filtered = recent.filter((id: string) => id !== productId);
      filtered.unshift(productId);
      localStorage.setItem('nabrijan_recent_products', JSON.stringify(filtered.slice(0, 10)));
    } catch (e) {}
  }, [productId]);

  return null;
}
