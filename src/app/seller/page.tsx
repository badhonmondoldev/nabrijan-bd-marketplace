import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Store, DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerDashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  let store: any = null;
  let metrics = {
    todaySales: 0,
    todayOrdersCount: 0,
    totalOrdersCount: 0,
    totalProductsCount: 0,
    lowStockCount: 0,
    totalRevenue: 0,
  };
  let recentOrders: any[] = [];
  let topProducts: any[] = [];

  try {
    store = await prisma.store.findFirst({
      where: { ownerId: session.userId },
    });

    if (!store) {
      redirect('/seller/onboarding');
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.findMany({
      where: { storeId: store.id, createdAt: { gte: todayStart } },
    });
    metrics.todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    metrics.todayOrdersCount = todayOrders.length;

    metrics.totalOrdersCount = await prisma.order.count({ where: { storeId: store.id } });
    metrics.totalProductsCount = await prisma.product.count({ where: { storeId: store.id, status: 'ACTIVE' } });
    metrics.lowStockCount = await prisma.product.count({
      where: { storeId: store.id, stockQuantity: { lte: 10 } },
    });

    const allStoreOrders = await prisma.order.findMany({
      where: { storeId: store.id },
      select: { totalAmount: true },
    });
    metrics.totalRevenue = allStoreOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    recentOrders = await prisma.order.findMany({
      where: { storeId: store.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { name: true, email: true } } },
    });

    topProducts = await prisma.product.findMany({
      where: { storeId: store.id },
      take: 5,
      include: { images: true },
      orderBy: { stockQuantity: 'desc' },
    });
  } catch (e) {
    console.warn('Seller dashboard query fallback');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Seller Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-3 rounded-xl">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">{store?.name || 'Seller Dashboard'}</h1>
            <p className="text-xs text-slate-400">Merchant Store Manager • nabrijan.com/store/{store?.slug}</p>
          </div>
        </div>

        <Link
          href="/seller/products/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Today&apos;s Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">৳{metrics.todaySales}</div>
          <div className="text-[10px] text-slate-400 font-mono">{metrics.todayOrdersCount} Orders Today</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">৳{metrics.totalRevenue}</div>
          <div className="text-[10px] text-slate-400 font-mono">Gross Sales to Date</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalProductsCount}</div>
          <div className="text-[10px] text-slate-400 font-mono">Listed in Catalog</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-1">
          <div className="text-slate-500 font-bold flex items-center justify-between">
            <span>Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{metrics.lowStockCount}</div>
          <div className="text-[10px] text-slate-400 font-mono">Stock &le; 10 items</div>
        </div>
      </div>

      {/* Tables: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-sm font-bold text-slate-900">Recent Store Orders</h2>
            <Link href="/seller/orders" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-8 border border-dashed rounded-xl">
              No orders received yet for this store.
            </div>
          ) : (
            <div className="divide-y text-xs">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">#{o.orderNumber}</div>
                    <div className="text-[11px] text-slate-500">{o.buyer?.name || 'Customer'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700">৳{o.totalAmount}</div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-sm font-bold text-slate-900">Active Inventory Products</h2>
            <Link href="/seller/products" className="text-xs font-semibold text-emerald-700 hover:underline">
              Manage Products
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-8 border border-dashed rounded-xl">
              No products added yet. Click &quot;Add New Product&quot; to list items.
            </div>
          ) : (
            <div className="divide-y text-xs">
              {topProducts.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img src={p.images?.[0]?.url || 'https://picsum.photos/100/100'} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                    <div>
                      <div className="font-bold text-slate-900 truncate max-w-[200px]">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">৳{p.salePrice || p.basePrice}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{p.stockQuantity} in Stock</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
