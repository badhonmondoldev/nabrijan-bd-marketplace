'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Store, Share2, Sparkles, ArrowRight, Zap, Heart, Eye, PackageCheck } from 'lucide-react';
import { FadeIn, StaggerContainer, HoverCard } from '@/components/animations/MotionWrappers';
import { motion, AnimatePresence } from 'framer-motion';
import { NabiMascot } from '@/components/mascot/NabiMascot';

const LIVE_ORDERS_SAMPLE = [
  { id: '#9481', item: 'Xiaomi Redmi Note 13 Pro 5G', location: 'Dhaka, BD', time: '1 min ago', tag: '⚡ Fast Delivery' },
  { id: '#9482', item: 'Aarong Hand-Embroidered Jamdani Saree', location: 'Chittagong, BD', time: '3 mins ago', tag: '🛍️ Verified Merchant' },
  { id: '#9483', item: 'Square Organic Pure Mustard Oil 5L', location: 'Sylhet, BD', time: '5 mins ago', tag: '📦 COD Dispatch' },
  { id: '#9484', item: 'Apex Leather Formal Shoes for Men', location: 'Rajshahi, BD', time: '7 mins ago', tag: '✨ Express Shipping' },
  { id: '#9485', item: 'Walton Primo S8 Mini Smart TV 43"', location: 'Khulna, BD', time: '10 mins ago', tag: '🛡️ Buyer Guarantee' },
];

export function AnimatedHeroSection() {
  const [activeOrderIdx, setActiveOrderIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOrderIdx((prev) => (prev + 1) % LIVE_ORDERS_SAMPLE.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentLiveOrder = LIVE_ORDERS_SAMPLE[activeOrderIdx];

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Cyberpunk Pink Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950 text-white py-14 sm:py-20 px-4 max-w-full overflow-x-hidden border-b border-pink-500/30">
        {/* Glowing Background Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10 max-w-full">
          <FadeIn direction="up" delay={0.1} className="space-y-5 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-black px-3.5 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>🌸 Modern Anime Girl Aesthetic Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
              Buy. Sell.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-fuchsia-400 drop-shadow">
                Earn. Grow.
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Discover authentic Bangladeshi merchants, verified local vendors, wholesale MOQ tiering, and instant bKash / Nagad / COD payments in a vibrant modern girl aesthetic platform.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link href="/products">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:brightness-110 text-white font-black text-sm px-6 sm:px-7 py-3.5 rounded-2xl shadow-xl shadow-pink-500/25 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>

              <Link href="/register?role=SELLER">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="border-2 border-pink-500/40 hover:border-pink-400 text-pink-200 font-bold text-sm px-5 sm:px-6 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 transition flex items-center space-x-2 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-pink-400" />
                  <span>Become a Seller</span>
                </motion.div>
              </Link>
            </div>

            {/* Quick Stats Highlights */}
            <div className="pt-5 grid grid-cols-3 gap-3 border-t border-pink-900/40 text-center">
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-pink-300">BD 🇧🇩</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Nationwide Network</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-rose-300">Curated</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Verified Products</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-fuchsia-300">100%</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Buyer Guarantee</div>
              </div>
            </div>
          </FadeIn>

          {/* NABI Anime Mascot Visual Component */}
          <FadeIn direction="left" delay={0.2} className="relative w-full max-w-full">
            <NabiMascot variant="hero" />
          </FadeIn>
        </div>
      </section>

      {/* Live Activity & Live Viewers Banner (Directly Below Hero Section) */}
      <section className="bg-slate-900 border-b border-pink-500/30 py-4 px-4 max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-full">
          {/* Live Shoppers Counter */}
          <div className="flex items-center space-x-2.5 bg-pink-950/80 border border-pink-500/40 px-4 py-2 rounded-2xl shadow-md flex-shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
            </span>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
              <Eye className="w-3.5 h-3.5 text-pink-400" />
              <span><strong className="text-pink-300 font-black">1,482</strong> Shoppers Live Browsing</span>
            </div>
          </div>

          {/* Real-time Order Ticker */}
          <div className="flex-1 w-full max-w-xl bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl flex items-center justify-between overflow-hidden shadow-inner text-xs">
            <div className="flex items-center space-x-2 min-w-0">
              <PackageCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLiveOrder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2 truncate"
                >
                  <span className="font-black text-pink-300">{currentLiveOrder.id}</span>
                  <span className="text-slate-300 truncate">{currentLiveOrder.item}</span>
                  <span className="text-slate-400 font-medium text-[11px]">({currentLiveOrder.location})</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-lg flex-shrink-0 ml-2">
              {currentLiveOrder.tag}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export function AnimatedProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 max-w-full">
      {products.map((product) => {
        const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
        const discountPct = hasDiscount
          ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
          : 0;

        return (
          <HoverCard key={product.id}>
            <div className="bg-slate-900 border border-pink-500/20 rounded-2xl overflow-hidden flex flex-col h-full hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all group">
              <div className="relative aspect-square bg-slate-950 overflow-hidden">
                <img
                  src={
                    product.images && product.images[0]?.url
                      ? product.images[0].url
                      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60'
                  }
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    -{discountPct}% OFF
                  </span>
                )}

                {product.store && (
                  <span className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-pink-500/30">
                    {product.store.name}
                  </span>
                )}
              </div>

              <div className="p-3 flex flex-col flex-1 justify-between space-y-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 group-hover:text-pink-400 transition">
                    {product.title}
                  </h4>
                </div>

                <div className="pt-1 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-black text-pink-400">
                      ৳{product.salePrice ? product.salePrice.toLocaleString('en-BD') : product.basePrice.toLocaleString('en-BD')}
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] text-slate-500 line-through ml-1">
                        ৳{product.basePrice.toLocaleString('en-BD')}
                      </span>
                    )}
                  </div>

                  <Link href={`/product/${product.slug}`}>
                    <span className="bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/40 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center">
                      Buy
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </HoverCard>
        );
      })}
    </StaggerContainer>
  );
}
