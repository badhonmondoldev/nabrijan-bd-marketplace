import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  let wishlist: any = null;
  try {
    wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: { include: { images: true, store: true } },
          },
        },
      },
    });
  } catch (e) {}

  const items = wishlist?.items || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex items-center space-x-3">
        <Heart className="w-6 h-6 text-red-400 fill-current" />
        <div>
          <h1 className="text-2xl font-black">My Saved Wishlist</h1>
          <p className="text-xs text-slate-400">Keep track of products you want to buy later</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
          Your wishlist is empty right now.
          <div className="mt-4">
            <Link href="/products" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg">
              Explore Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {items.map((item: any) => {
            const p = item.product;
            const img = p.images?.[0]?.url || 'https://picsum.photos/400/400';
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                <img src={img} alt={p.title} className="w-full aspect-square object-cover rounded-lg" />
                <div className="font-bold text-xs text-slate-800 line-clamp-1">{p.title}</div>
                <div className="text-sm font-black text-emerald-700">৳{p.salePrice || p.basePrice}</div>
                <Link href={`/products/${p.slug}`} className="block w-full bg-slate-900 text-white text-center text-xs font-semibold py-2 rounded-lg">
                  View Item
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
