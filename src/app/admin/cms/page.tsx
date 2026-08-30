import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Layout, Plus, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCmsPage() {
  const session = await getSession();
  if (!session || (session.activeRole !== 'ADMIN' && session.activeRole !== 'SUPER_ADMIN')) {
    redirect('/account');
  }

  let banners: any[] = [];
  try {
    banners = await prisma.cmsBanner.findMany({ orderBy: { sortOrder: 'asc' } });
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-950 text-white rounded-2xl p-6 mb-8 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <Layout className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-2xl font-black">Dynamic CMS & Promotional Manager</h1>
            <p className="text-xs text-red-200">Control homepage banners, hero promotions & seasonal campaigns</p>
          </div>
        </div>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1">
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b">Active Homepage Banners</h2>
        {banners.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-8 border border-dashed rounded-xl">
            No custom CMS banners registered yet. Default system banner is active.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="border p-4 rounded-xl text-xs space-y-2 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">{b.title}</div>
                  <div className="text-slate-500 text-[10px] font-mono">Position: {b.position}</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
