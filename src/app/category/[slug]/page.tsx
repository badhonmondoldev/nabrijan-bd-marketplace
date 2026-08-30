import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Filter, ChevronRight, ShoppingBag } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: 'Category Not Found | NABRIJAN MARKET' };
  }

  return {
    title: `${category.name} | NABRIJAN MARKET`,
    description: `Shop authentic ${category.name} products from verified Bangladeshi vendors with bKash and cash on delivery.`,
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string; minPrice?: string; maxPrice?: string; page?: string };
}) {
  let category: any = null;
  let products: any[] = [];
  let totalCount = 0;

  const sort = searchParams.sort || 'newest';
  const minPrice = parseFloat(searchParams.minPrice || '0');
  const maxPrice = parseFloat(searchParams.maxPrice || '999999');
  const page = parseInt(searchParams.page || '1');
  const pageSize = 12;

  try {
    category = await prisma.category.findUnique({
      where: { slug: params.slug },
      include: {
        children: true,
        parent: true,
      },
    });

    if (category) {
      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'price_low') orderBy = { basePrice: 'asc' };
      if (sort === 'price_high') orderBy = { basePrice: 'desc' };

      const categoryIds = [category.id, ...category.children.map((c: any) => c.id)];

      products = await prisma.product.findMany({
        where: {
          categoryId: { in: categoryIds },
          status: 'ACTIVE',
          basePrice: { gte: minPrice, lte: maxPrice },
        },
        include: {
          images: true,
          store: true,
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      totalCount = await prisma.product.count({
        where: {
          categoryId: { in: categoryIds },
          status: 'ACTIVE',
          basePrice: { gte: minPrice, lte: maxPrice },
        },
      });
    }
  } catch (e) {
    console.warn('Category detail fallback');
  }

  if (!category) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 mb-6 flex items-center space-x-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:underline">Categories</Link>
        {category.parent && (
          <>
            <span>/</span>
            <Link href={`/category/${category.parent.slug}`} className="hover:underline">{category.parent.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-800 font-semibold">{category.name}</span>
      </div>

      {/* Category Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black">{category.name}</h1>
          <p className="text-xs text-slate-400 mt-1">{category.description || `Browse quality ${category.name} items`}</p>
        </div>
        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
          {totalCount} Items Available
        </span>
      </div>

      {/* Subcategories bar if available */}
      {category.children && category.children.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8">
          <div className="text-xs font-bold text-slate-700 mb-2">Explore Subcategories:</div>
          <div className="flex flex-wrap gap-2">
            {category.children.map((sub: any) => (
              <Link
                key={sub.id}
                href={`/category/${sub.slug}`}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-semibold"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 h-fit space-y-4 shadow-sm text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm border-b pb-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filter & Sort</span>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Sort By</label>
            <form method="GET">
              <select
                name="sort"
                defaultValue={sort}
                onChange={(e) => e.target.form?.submit()}
                className="w-full px-2.5 py-2 border rounded-lg bg-white font-medium"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
              No products found under {category.name}.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((p) => {
                const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || 'https://picsum.photos/400/400';
                return (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="aspect-square bg-slate-100 relative">
                        <img src={primaryImg} alt={p.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {p.store?.name || 'Verified Store'}
                        </span>
                      </div>
                      <div className="p-4 space-y-1">
                        <h3 className="font-bold text-slate-800 text-xs line-clamp-2 hover:text-emerald-700">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/category/${params.slug}?page=${i + 1}&sort=${sort}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    page === i + 1 ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
