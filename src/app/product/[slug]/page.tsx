import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Store, ShieldCheck, Truck, Share2, Star, MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import RecentlyViewedTracker from '@/components/RecentlyViewedTracker';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return { title: 'Product Not Found | NABRIJAN MARKET' };
  }

  return {
    title: `${product.title} | NABRIJAN MARKET`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: any = null;
  let sameSellerProducts: any[] = [];
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: true,
        store: true,
        category: true,
        brand: true,
        variants: true,
        questions: { include: { user: true } },
        reviews: { include: { user: true } },
      },
    });

    if (product) {
      sameSellerProducts = await prisma.product.findMany({
        take: 4,
        where: { storeId: product.storeId, NOT: { id: product.id } },
        include: { images: true, store: true },
      });

      relatedProducts = await prisma.product.findMany({
        take: 4,
        where: { categoryId: product.categoryId, NOT: { id: product.id } },
        include: { images: true, store: true },
      });
    }
  } catch (e) {
    console.warn('Product detail query fallback');
  }

  if (!product) {
    notFound();
  }

  const primaryImg = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || 'https://picsum.photos/600/600';

  // JSON-LD Microdata for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: primaryImg,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'NABRIJAN Brand',
    },
    offers: {
      '@type': 'Offer',
      url: `https://nabrijan-bd.vercel.app/product/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.salePrice || product.basePrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RecentlyViewedTracker productId={product.id} />

      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 mb-6 flex items-center space-x-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        <span>/</span>
        <Link href={`/category/${product.category?.slug}`} className="hover:underline">{product.category?.name || 'Category'}</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
            <img src={primaryImg} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((img: any) => (
                <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Interactive Variant Selector */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2">
              {product.category?.name || 'General'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{product.title}</h1>
          </div>

          <ProductVariantSelector
            basePrice={product.basePrice}
            salePrice={product.salePrice}
            baseStock={product.stockQuantity}
            baseSku={product.sku}
            variants={product.variants || []}
            title={product.title}
          />

          {/* Seller Profile Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-700 text-white p-2.5 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Sold & Shipped By:</div>
                <div className="font-bold text-slate-900 text-sm">{product.store?.name || 'Partner Store'}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">★ {product.store?.rating || '4.8'} Store Rating • Verified BD Merchant</div>
              </div>
            </div>
            <Link
              href={`/stores`}
              className="text-xs font-semibold text-emerald-700 border border-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
            >
              Visit Store
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Fast 64-District Courier</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Server Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Q&A, Reviews */}
      <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Product Description & Specs</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Customer Reviews Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span>Customer Verified Reviews ({product.reviews?.length || 0})</span>
          </h2>

          {!product.reviews || product.reviews.length === 0 ? (
            <div className="text-xs text-slate-500">No reviews yet for this product.</div>
          ) : (
            <div className="space-y-3">
              {product.reviews.map((rev: any) => (
                <div key={rev.id} className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{rev.user?.name}</span>
                    <div className="flex text-amber-500 font-bold">★ {rev.rating}</div>
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Questions Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Questions & Answers ({product.questions?.length || 0})</span>
          </h2>

          {!product.questions || product.questions.length === 0 ? (
            <div className="text-xs text-slate-500">No questions asked yet for this item.</div>
          ) : (
            <div className="space-y-3">
              {product.questions.map((q: any) => (
                <div key={q.id} className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-800">Q: {q.question}</div>
                  {q.answer && <div className="text-emerald-700 font-semibold pt-1">A: {q.answer}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Same Seller Products */}
      {sameSellerProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">More Items from {product.store?.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {sameSellerProducts.map((p) => (
              <div key={p.id} className="bg-white border rounded-xl p-4 space-y-2">
                <img src={p.images?.[0]?.url || 'https://picsum.photos/400/400'} alt={p.title} className="w-full aspect-square object-cover rounded-lg" />
                <div className="font-bold text-xs line-clamp-1">{p.title}</div>
                <div className="text-sm font-black text-emerald-700">৳{p.salePrice || p.basePrice}</div>
                <Link href={`/product/${p.slug}`} className="block w-full bg-slate-900 text-white text-center text-xs font-semibold py-1.5 rounded-lg">View</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
