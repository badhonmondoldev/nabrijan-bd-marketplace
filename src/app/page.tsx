import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ShoppingBag, ShieldCheck, Truck, Store, Share2, Sparkles, ChevronRight, Award, Zap } from 'lucide-react';
import { AnimatedHeroSection, AnimatedProductGrid } from '@/components/home/AnimatedHomeSections';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let stores: any[] = [];

  try {
    categories = await prisma.category.findMany({
      take: 8,
      orderBy: { name: 'asc' },
    });

    featuredProducts = await prisma.product.findMany({
      take: 8,
      where: { status: 'ACTIVE' },
      include: {
        images: true,
        store: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    stores = await prisma.store.findMany({
      take: 4,
      where: { status: 'ACTIVE' },
    });
  } catch (e) {
    console.warn('Database query skipped during build/runtime fallback');
  }

  return (
    <div className="space-y-12 pb-12">
      {/* ANIMATED HERO BANNER */}
      <AnimatedHeroSection />

      {/* VALUE PROPOSITION BADGES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">64 District Delivery</div>
              <div className="text-xs text-slate-500">Fast local courier shipment</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
            <div className="bg-pink-100 text-pink-700 p-3 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">bKash / Nagad Ready</div>
              <div className="text-xs text-slate-500">Server verified transactions</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
            <div className="bg-amber-100 text-amber-700 p-3 rounded-lg">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">Verified BD Vendors</div>
              <div className="text-xs text-slate-500">Authentic store guarantee</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
            <div className="bg-purple-100 text-purple-700 p-3 rounded-lg">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">Earn with Affiliate</div>
              <div className="text-xs text-slate-500">Share links & earn BDT</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Browse Categories</h2>
          <Link href="/products" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center">
            <span>View All</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-3 text-center hover:border-emerald-600 hover:shadow-md transition group"
            >
              <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-600 group-hover:text-white transition">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-emerald-700">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Featured Products</h2>
            <p className="text-xs text-slate-500">Real marketplace products from top verified Bangladeshi vendors</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center">
            <span>Explore Catalog</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <AnimatedProductGrid products={featuredProducts} />
      </section>

      {/* FEATURED VENDORS SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Top Verified BD Stores</h2>
              <p className="text-xs text-slate-400">Authentic multi-vendor sellers across Bangladesh</p>
            </div>
            <Link href="/stores" className="text-xs font-semibold text-emerald-400 hover:underline">
              View All Stores
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stores.map((s) => (
              <div key={s.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-2">
                <div className="font-bold text-emerald-300 text-sm">{s.name}</div>
                <p className="text-xs text-slate-300 line-clamp-2">{s.description}</p>
                <div className="text-[11px] text-amber-400 font-semibold">★ {s.rating} Store Rating</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
