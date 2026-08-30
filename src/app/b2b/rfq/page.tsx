'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle2, Building2, DollarSign, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function B2bRfqPortalPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/b2b/rfq');
      const data = await res.json();
      if (res.ok) setRfqs(data.rfqs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/b2b/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, quantity, targetPrice }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setMessage('RFQ submitted to verified suppliers marketplace!');
      setTitle('');
      setDescription('');
      setQuantity('');
      setTargetPrice('');
      fetchRfqs();
    } catch (err: any) {
      alert(err.message || 'RFQ creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-xs">
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-2xl font-black">Request for Quotation (RFQ) Marketplace</h1>
            <p className="text-xs text-slate-400">Post product sourcing requirements, receive factory quotations, and compare lead times</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RFQ Submission Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Submit Sourcing Requirement</span>
          </h2>

          <form onSubmit={handleCreateRfq} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Requirement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 500 pcs Cotton Men Polo Shirts"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Detailed Specifications & Terms</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify fabric GSM, dimensions, packaging, delivery location..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Quantity Required (Units)</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Target Budget Per Unit (BDT, Optional)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 350 (BDT)"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow"
            >
              {submitting ? 'Posting RFQ...' : 'Post Sourcing Request'}
            </button>
          </form>
        </div>

        {/* Active RFQ List */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b">Open Sourcing RFQs ({rfqs.length})</h2>

          {loading ? (
            <div className="text-slate-500 py-12 text-center">Loading RFQ marketplace...</div>
          ) : rfqs.length === 0 ? (
            <div className="text-slate-400 py-12 text-center border border-dashed rounded-xl">No active RFQs posted yet.</div>
          ) : (
            <div className="space-y-4">
              {rfqs.map((rfq) => (
                <div key={rfq.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-slate-300 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">Posted by: {rfq.buyer?.name || 'Buyer'}</div>
                      <h3 className="font-bold text-base text-slate-900">{rfq.title}</h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {rfq.status}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{rfq.description}</p>

                  <div className="flex flex-wrap gap-4 pt-2 border-t text-[11px]">
                    <span className="font-bold text-slate-900">Quantity: {rfq.quantity} units</span>
                    <span className="text-emerald-700 font-bold">Target Budget: ৳{rfq.targetPrice || 'Open'} / unit</span>
                    <span className="text-slate-500">Submitted Quotes: {rfq.quotes?.length || 0}</span>
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
