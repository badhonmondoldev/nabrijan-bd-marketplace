import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, Eye, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { buyerId: session.userId },
      include: {
        store: { select: { name: true } },
        items: true,
        shipments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('Customer orders query fallback');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2.5 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">My Purchase Orders</h1>
            <p className="text-xs text-slate-400">Track shipments, view order timeline, or manage returns</p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
          You haven&apos;t placed any orders yet.
          <div className="mt-4">
            <Link href="/products" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-emerald-500 transition">
              <div className="flex flex-wrap justify-between items-center pb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Order #{o.orderNumber}</div>
                  <div className="text-[11px] text-slate-400">Placed on {new Date(o.createdAt).toLocaleDateString()} • Sold by <span className="font-bold text-slate-700">{o.store?.name}</span></div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {o.orderStatus}
                  </span>
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="bg-slate-900 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <span>Order Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items summary */}
              <div className="divide-y">
                {o.items?.map((item: any) => (
                  <div key={item.id} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">{item.title}</div>
                      <div className="text-slate-500 text-[11px]">Qty: {item.quantity} x ৳{item.price}</div>
                    </div>
                    <div className="font-black text-emerald-700">৳{item.totalAmount}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-between items-center font-bold text-slate-900">
                <span>Total Amount ({o.paymentMethod}):</span>
                <span className="text-sm text-emerald-700 font-black">৳{o.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
