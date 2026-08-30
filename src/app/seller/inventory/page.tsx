'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SellerInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [txType, setTxType] = useState('RESTOCK');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/inventory');
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
        if (data.products?.length > 0 && !selectedProductId) {
          setSelectedProductId(data.products[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/seller/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          type: txType,
          quantity,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Stock transaction failed');

      setMessage(`Stock successfully updated (${txType}). Audit trail logged.`);
      setQuantity('');
      setNotes('');
      fetchInventory();
    } catch (err: any) {
      setError(err.message || 'Stock adjustment failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Flatten all transactions for audit log table
  const allTransactions = products.flatMap((p) => {
    const inv = p.inventories?.[0];
    return (inv?.transactions || []).map((t: any) => ({
      ...t,
      productTitle: p.title,
      sku: p.sku,
    }));
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-black">Stock Inventory Control & Transaction Ledger</h1>
            <p className="text-xs text-slate-400">Available Stock = Total Stock - Reserved Stock • Silent stock edits prohibited</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stock Adjustment Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Record Stock Transaction</span>
          </h2>

          <form onSubmit={handleStockAdjust} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (Qty: {p.stockQuantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Transaction Type</label>
              <select
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white font-bold"
              >
                <option value="RESTOCK">RESTOCK (+ Addition)</option>
                <option value="SALE">SALE (- Reduction)</option>
                <option value="RETURN">RETURN (+ Customer Return)</option>
                <option value="ADJUSTMENT">ADJUSTMENT (= Exact Correction)</option>
                <option value="DAMAGE">DAMAGE (- Damaged Items)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Quantity Units</label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Transaction Notes & Reference</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Supplier Shipment Invoice #9821"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow flex items-center justify-center space-x-1.5"
            >
              <span>{submitting ? 'Recording Log...' : 'Record Stock Transaction'}</span>
            </button>
          </form>
        </div>

        {/* Product Stock Table */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Store Inventory Stock Levels</h2>
          {loading ? (
            <div className="text-xs text-slate-500 py-6 text-center">Loading stock levels...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-700">
                    <th className="p-3">Product Title</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Total Stock</th>
                    <th className="p-3">Reserved</th>
                    <th className="p-3">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {products.map((p) => {
                    const inv = p.inventories?.[0];
                    const total = inv?.totalStock || p.stockQuantity;
                    const reserved = inv?.reserved || 0;
                    const available = Math.max(0, total - reserved);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{p.title}</td>
                        <td className="p-3 font-mono text-slate-500">{p.sku}</td>
                        <td className="p-3 font-bold">{total}</td>
                        <td className="p-3 text-amber-600 font-bold">{reserved}</td>
                        <td className="p-3 text-emerald-700 font-black">{available}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Transaction History Audit Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b">Inventory Transaction History (Audit Trail)</h2>
        {allTransactions.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-6 border border-dashed rounded-xl">
            No stock transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b font-bold text-slate-700">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Product SKU</th>
                  <th className="p-3">Transaction Type</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {allTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-bold text-slate-900">{tx.productTitle} ({tx.sku})</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'RESTOCK' || tx.type === 'RETURN' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{tx.quantity} pcs</td>
                    <td className="p-3 text-slate-500">{tx.notes || '—'}</td>
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
