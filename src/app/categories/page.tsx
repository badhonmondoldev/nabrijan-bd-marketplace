import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Grid, ChevronRight, ShoppingBag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories | NABRIJAN MARKET',
  description: 'Explore all product categories, local Bangladeshi brands, and imported goods.',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  let mainCategories: any[] = [];
  try {
    mainCategories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.warn('Categories query fallback');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2.5 rounded-xl">
            <Grid className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">All Product Categories</h1>
            <p className="text-xs text-slate-400">Discover items grouped by category and subcategory across Bangladesh</p>
          </div>
        </div>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((cat) => (
          <div key={cat.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base hover:text-emerald-700">
                      <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                    </h2>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {cat._count?.products || 0} Products
                    </span>
                  </div>
                </div>
              </div>

              {/* Subcategories list */}
              {cat.children && cat.children.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Subcategories:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.children.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={`/category/${sub.slug}`}
                        className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium transition"
                      >
                        {sub.name} <span className="text-[10px] text-slate-400">({sub._count?.products || 0})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/category/${cat.slug}`}
              className="w-full bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition text-center flex items-center justify-center space-x-1"
            >
              <span>Explore {cat.name}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
