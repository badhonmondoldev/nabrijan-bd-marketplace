import React from 'react';
import { SellerSidebar } from '@/components/seller/SellerSidebar';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row max-w-full overflow-x-hidden">
      <div className="hidden md:block">
        <SellerSidebar />
      </div>
      <div className="flex-1 max-w-full overflow-x-hidden min-w-0">
        <main className="p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
