'use client';

import React from 'react';
import { BookOpen, Sparkles, Clock, ArrowRight, PlayCircle, ShieldCheck, CheckCircle } from 'lucide-react';

export default function SellerLearningPage() {
  const articles = [
    {
      id: 1,
      title: 'How to Optimize Your Product Listings for Higher Search Visibility',
      category: 'LISTING_TIPS',
      readTime: '4 min read',
      summary: 'Learn best practices for writing Bangladesh market titles, adding specifications, and uploading clear high-resolution product photos.',
    },
    {
      id: 2,
      title: 'Understanding Seller Wallet Settlements & Instant Payout Rules',
      category: 'FINANCE',
      readTime: '6 min read',
      summary: 'Detailed guide on how earnings transition from Pending Balance to Available Balance after buyer order delivery confirmation.',
    },
    {
      id: 3,
      title: 'Packaging & Courier Dispatch Guidelines across 64 Districts',
      category: 'SHIPPING',
      readTime: '5 min read',
      summary: 'Ensure your products arrive undamaged with proper bubble wrapping, box labeling, and express courier handoff procedures.',
    },
    {
      id: 4,
      title: 'Marketplace Policy & Prohibited Items Checklist for Bangladesh',
      category: 'POLICY',
      readTime: '8 min read',
      summary: 'Review forbidden product categories, trademark policies, and fake discount regulations to maintain a 100% EXCELLENT store rating.',
    },
  ];

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 p-6 rounded-3xl shadow-xl">
        <div className="inline-flex items-center space-x-2 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full mb-2">
          <BookOpen className="w-4 h-4 text-pink-400" />
          <span>Seller Knowledge Base & University</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Seller Learning Center</h1>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          Master marketplace sales techniques, fulfillment optimization, pricing strategies, and compliance guidelines to grow your business nationwide.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {articles.map((art) => (
          <div key={art.id} className="bg-slate-900 border border-slate-800 hover:border-pink-500/40 p-6 rounded-3xl transition flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black bg-pink-950 text-pink-300 border border-pink-500/30 px-2.5 py-0.5 rounded-full">
                  {art.category}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-pink-400" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-pink-300 transition">
                {art.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-pink-400 group-hover:text-pink-300">
              <span>Read Guide</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
