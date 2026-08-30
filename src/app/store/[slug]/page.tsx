'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Heart, Star, Sparkles, MapPin, ShoppingBag } from 'lucide-react';
import { AnimatedProductGrid } from '@/components/home/AnimatedHomeSections';

export default function PublicStorePage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<any | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(148);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreData();
  }, [params.slug]);

  const fetchStoreData = async () => {
    try {
      const res = await fetch(`/api/seller/store`);
      if (res.ok) {
        const data = await res.json();
        setStore(data.store || {
          name: 'Dhaka Tech Plaza',
          slug: params.slug,
          description: 'Official Bangladeshi verified electronics, smartphones, and home audio merchant.',
          status: 'VERIFIED',
          rating: 4.9,
          products: [
            {
              id: 'p-1',
              title: 'Xiaomi Redmi Note 13 Pro 5G (8GB/256GB)',
              slug: 'xiaomi-redmi-note-13-pro',
              basePrice: 32999,
              salePrice: 29999,
              images: [{ url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60' }],
            },
            {
              id: 'p-2',
              title: 'Walton Primo S8 Mini LED Smart TV 43 Inch',
              slug: 'walton-primo-s8-tv',
              basePrice: 38500,
              salePrice: 34999,
              images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=60' }],
            },
          ],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading store profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 max-w-full overflow-x-hidden">
      {/* Store Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 border border-pink-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 p-0.5 shadow-xl flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-black text-pink-400 text-xl">
                <Store className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{store?.name || 'Dhaka Tech Plaza'}</h1>
                <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>VERIFIED VENDOR</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 max-w-lg">{store?.description}</p>

              <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                <span>⭐ <strong>4.9 / 5.0</strong> Rating</span>
                <span>👥 <strong>{followersCount}</strong> Followers</span>
                <span>🇧🇩 Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleFollow}
            className={`px-6 py-3 rounded-2xl font-black text-xs transition shadow-lg flex items-center space-x-2 ${
              isFollowing
                ? 'bg-slate-800 text-pink-300 border border-pink-500/40'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white hover:brightness-110 shadow-pink-500/25'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFollowing ? 'fill-pink-400 text-pink-400' : ''}`} />
            <span>{isFollowing ? 'Following Store' : '+ Follow Store'}</span>
          </button>
        </div>
      </div>

      {/* Store Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-pink-400" />
            <span>Store Products Catalog</span>
          </h2>
        </div>

        <AnimatedProductGrid products={store?.products || []} />
      </div>
    </div>
  );
}
