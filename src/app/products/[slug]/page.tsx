import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Store, ShieldCheck, Truck, ShoppingCart, Share2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: true,
        store: true,
        category: true,
        brand: true,
        variants: true,
        reviews: {
          include: { user: true },
        },
      },
    });
  } catch (e) {
    console.warn('Product detail query skipped during build');
  }

  if (!product) {
    notFound();
  }

  const primaryImg = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || 'https://picsum.photos/600/600';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 mb-6 flex items-center space-x-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category?.slug}`} className="hover:underline">{product.category?.name || 'Category'}</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            <img
              src={primaryImg}
              alt={product.title}
              className="w-full h-full object-cover"
            />
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

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2">
              {product.category?.name || 'General'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{product.title}</h1>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-2">
              <span>SKU: <span className="font-mono text-slate-700">{product.sku}</span></span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">In Stock ({product.stockQuantity} available)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-baseline space-x-3">
            <span className="text-3xl font-black text-emerald-700">৳{product.salePrice || product.basePrice}</span>
            {product.salePrice && (
              <span className="text-sm text-slate-400 line-through">৳{product.basePrice}</span>
            )}
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold ml-auto">
              bKash / Nagad / COD Ready
            </span>
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Available Variants:</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    className="border border-slate-300 hover:border-emerald-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-white"
                  >
                    {v.name} (৳{v.price})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-700 text-white p-2.5 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Sold & Shipped By:</div>
                <div className="font-bold text-slate-900 text-sm">{product.store?.name || 'Partner Store'}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">★ {product.store?.rating || '4.8'} Rating • Verified Merchant</div>
              </div>
            </div>
            <Link
              href={`/products?store=${product.store?.slug}`}
              className="text-xs font-semibold text-emerald-700 border border-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
            >
              Visit Store
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Affiliate Share</span>
            </button>
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

      {/* Description & Reviews */}
      <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Product Description</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Customer Reviews ({product.reviews?.length || 0})</h2>
          {!product.reviews || product.reviews.length === 0 ? (
            <div className="text-xs text-slate-500">No reviews yet for this product.</div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((rev: any) => (
                <div key={rev.id} className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{rev.user?.name}</span>
                    <div className="flex text-amber-500">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
