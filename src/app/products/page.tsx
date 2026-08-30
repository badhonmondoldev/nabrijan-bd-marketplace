import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Search, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const query = searchParams.search || '';
  const categorySlug = searchParams.category || '';

  let categories: any[] = [];
  let products: any[] = [];

  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    const whereClause: any = {
      status: 'PUBLISHED',
    };

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: true,
        store: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('Products query skipped during build');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Marketplace Catalog</h1>
          <p className="text-xs text-slate-500">Discover authentic items from local Bangladesh stores ({products.length} items found)</p>
        </div>

        {/* Search Bar */}
        <form method="GET" className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="text"
            name="search"
            defaultValue={query}
            placeholder="Search products..."
            className="px-3.5 py-2 text-xs border border-slate-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
          <button type="submit" className="bg-emerald-600 text-white p-2 rounded-lg text-xs font-semibold">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 h-fit space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm border-b pb-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Categories</span>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/products"
              className={`block px-3 py-2 rounded-lg font-medium transition ${
                !categorySlug ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`block px-3 py-2 rounded-lg font-medium transition ${
                  categorySlug === cat.slug ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
              No products found matching your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((p) => {
                const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || 'https://picsum.photos/400/400';
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square bg-slate-100 relative overflow-hidden">
                        <img
                          src={primaryImg}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex flex-col space-y-1">
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            {p.store?.name || 'Store'}
                          </span>
                          {(p.isSponsored || p.adCampaigns?.length > 0) && (
                            <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow uppercase">
                              Sponsored
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <h3 className="font-bold text-slate-800 text-xs line-clamp-2 hover:text-emerald-700">
                          <Link href={`/products/${p.slug}`}>{p.title}</Link>
                        </h3>
                        <div className="flex items-baseline space-x-2 pt-1">
                          <span className="text-base font-black text-emerald-700">
                            ৳{p.salePrice || p.basePrice}
                          </span>
                          {p.salePrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳{p.basePrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Link
                        href={`/products/${p.slug}`}
                        className="w-full bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition text-center block"
                      >
                        View Details
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
