import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Search as SearchIcon, Filter, Sparkles } from 'lucide-react';
import { AIService } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string };
}) {
  const query = searchParams.q || '';
  const categorySlug = searchParams.category || '';
  const sort = searchParams.sort || 'relevance';
  const minPrice = parseFloat(searchParams.minPrice || '0');
  const maxPrice = parseFloat(searchParams.maxPrice || '999999');

  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];
  let aiAdvice = '';

  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

    const where: any = {
      status: 'ACTIVE',
      basePrice: { gte: minPrice, lte: maxPrice },
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_low') orderBy = { basePrice: 'asc' };
    if (sort === 'price_high') orderBy = { basePrice: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    products = await prisma.product.findMany({
      where,
      include: { images: true, store: true, category: true, brand: true },
      orderBy,
    });

    if (query) {
      const adviceRes = await AIService.getShoppingAdvice(query);
      aiAdvice = adviceRes.data;
    }
  } catch (e) {
    console.warn('Search query fallback');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 shadow-sm">
        <h1 className="text-2xl font-black mb-2">Marketplace Search Engine</h1>
        <p className="text-xs text-slate-400 mb-4">Supports English & Bangla queries across 50,000+ local products</p>

        <form method="GET" action="/search" className="flex items-center space-x-2 max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="e.g. Rice, Smartphone, Walton, বাটন ফোন..."
            className="w-full px-4 py-2.5 text-xs text-slate-900 rounded-lg focus:outline-none"
          />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center space-x-1">
            <SearchIcon className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* AI Assistant Advice Banner */}
      {aiAdvice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs mb-8 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold mb-0.5">AI Shopping Assistant Recommendation</div>
            <p className="text-slate-700">{aiAdvice}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 h-fit space-y-4 shadow-sm text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm border-b pb-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filter & Sort Options</span>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Sort Results By</label>
            <form method="GET" action="/search">
              <input type="hidden" name="q" value={query} />
              <input type="hidden" name="category" value={categorySlug} />
              <select
                name="sort"
                defaultValue={sort}
                onChange={(e) => e.target.form?.submit()}
                className="w-full px-2.5 py-2 border rounded-lg bg-white font-medium"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </form>
          </div>

          <div>
            <span className="block font-bold text-slate-700 mb-2 border-t pt-2">Category Filters</span>
            <div className="space-y-1">
              <Link
                href={query ? `/search?q=${query}` : '/search'}
                className={`block px-2.5 py-1.5 rounded-lg ${!categorySlug ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                All Categories
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/search?q=${query}&category=${c.slug}&sort=${sort}`}
                  className={`block px-2.5 py-1.5 rounded-lg ${categorySlug === c.slug ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Grid */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
              No products found matching &quot;{query}&quot;. Try another search term.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((p) => {
                const img = p.images?.find((i: any) => i.isPrimary)?.url || p.images?.[0]?.url || 'https://picsum.photos/400/400';
                return (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="aspect-square bg-slate-100 relative">
                        <img src={img} alt={p.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {p.store?.name || 'Verified Store'}
                        </span>
                      </div>
                      <div className="p-4 space-y-1">
                        <h3 className="font-bold text-slate-800 text-xs line-clamp-2">
                          <Link href={`/product/${p.slug}`}>{p.title}</Link>
                        </h3>
                        <div className="text-base font-black text-emerald-700">৳{p.salePrice || p.basePrice}</div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <Link href={`/product/${p.slug}`} className="w-full bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg text-center block">
                        View Product
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
