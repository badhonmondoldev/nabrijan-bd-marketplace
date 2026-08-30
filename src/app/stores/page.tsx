import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Store, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StoresPage() {
  let stores: any[] = [];
  try {
    stores = await prisma.store.findMany({
      where: { status: 'ACTIVE' },
      include: {
        owner: true,
        products: { take: 3 },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('Stores query skipped during build');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Verified Multi-Vendor Stores</h1>
        <p className="text-xs text-slate-500">Explore authentic registered sellers across Bangladesh ({stores.length} stores active)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((s) => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-emerald-700 text-white p-3.5 rounded-xl font-bold text-lg">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">{s.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                  <div className="flex items-center space-x-3 text-xs text-slate-600 mt-2">
                    <span className="text-amber-500 font-bold flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{s.rating} Rating</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-emerald-700">{s.products?.length || 0}+ Items</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md">
                Verified Seller: {s.owner?.name || 'Partner'}
              </span>
              <Link
                href={`/products?store=${s.slug}`}
                className="text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 px-4 py-2 rounded-lg transition"
              >
                Browse Store Products
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
