import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Eye, Truck, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  let store: any = null;
  let orders: any[] = [];
  const statusFilter = searchParams.status || 'ALL';

  try {
    store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
    if (!store) redirect('/seller/onboarding');

    const where: any = { storeId: store.id };
    if (statusFilter !== 'ALL') {
      where.orderStatus = statusFilter;
    }

    orders = await prisma.order.findMany({
      where,
      include: {
        buyer: { select: { name: true, email: true, phone: true } },
        items: true,
        shipments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('Seller orders query fallback');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Store Orders Management</h1>
            <p className="text-xs text-slate-400">Process incoming customer purchases, assign courier tracking, and update order fulfillment</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-2 text-xs shadow-sm">
        {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
          <Link
            key={st}
            href={st === 'ALL' ? '/seller/orders' : `/seller/orders?status=${st}`}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              statusFilter === st ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {st}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {orders.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-12 border border-dashed rounded-xl">
            No orders found under filter &quot;{statusFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Order #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total Payable</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">#{o.orderNumber}</td>
                    <td className="p-3 font-mono text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-semibold">{o.buyer?.name || 'Customer'}</td>
                    <td className="p-3 font-bold">{o.items?.length || 1} Items</td>
                    <td className="p-3 font-black text-emerald-700">৳{o.totalAmount}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/seller/orders/${o.id}`}
                        className="bg-slate-900 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
