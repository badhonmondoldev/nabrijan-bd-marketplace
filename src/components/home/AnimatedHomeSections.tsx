'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Truck, Store, Share2, Sparkles, ChevronRight, Star, Heart, ArrowRight, Zap, Award } from 'lucide-react';
import { FadeIn, ScaleIn, StaggerContainer, HoverCard, PulseBadge } from '@/components/animations/MotionWrappers';
import { motion } from 'framer-motion';
import { NabiMascot } from '@/components/mascot/NabiMascot';

export function AnimatedHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white py-16 md:py-20 px-4">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
        <FadeIn direction="up" delay={0.1} className="space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/60 border border-emerald-400/30 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>🇧🇩 Bangladesh Multi-Vendor E-Commerce Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
            Buy. Sell. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Earn. Grow.</span>
          </h1>

          <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl">
            Connecting authentic Bangladeshi merchants, verified sellers, door-to-door delivery network, wholesale MOQ tiering, and instant bKash / Nagad / COD payment options.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/products">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>

            <Link href="/register?role=SELLER">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-emerald-400/40 hover:border-emerald-400 text-white font-bold text-sm px-6 py-3.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 transition flex items-center space-x-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-emerald-300" />
                <span>Become a Seller</span>
              </motion.div>
            </Link>
          </div>

          {/* Quick Stats Banner (100% Truthful) */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/60 text-center">
            <div>
              <div className="text-xl md:text-2xl font-black text-amber-300">BD 🇧🇩</div>
              <div className="text-[11px] text-emerald-200">Nationwide Network</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-amber-300">Curated</div>
              <div className="text-[11px] text-emerald-200">Verified Products</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-amber-300">100%</div>
              <div className="text-[11px] text-emerald-200">Buyer Protection</div>
            </div>
          </div>
        </FadeIn>

        {/* NABI Mascot Card Visual */}
        <FadeIn direction="left" delay={0.2} className="relative">
          <NabiMascot variant="hero" />
        </FadeIn>
      </div>
    </section>
  );
}

export function AnimatedProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => {
        const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
        const discountPct = hasDiscount
          ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
          : 0;

        return (
          <HoverCard key={product.id}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
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
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    -{discountPct}% OFF
                  </span>
                )}

                {product.store && (
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {product.store.name}
                  </span>
                )}
              </div>

              <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
                <div>
                  <h4 className="text-xs md:text-sm font-semibold text-slate-800 line-clamp-2 hover:text-emerald-700 transition">
                    {product.title}
                  </h4>
                </div>

                <div className="pt-1 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm md:text-base font-extrabold text-emerald-800">
                      ৳{product.salePrice ? product.salePrice.toLocaleString('en-BD') : product.basePrice.toLocaleString('en-BD')}
                    </span>
                    {hasDiscount && (
                      <span className="text-[11px] text-slate-400 line-through ml-1.5">
                        ৳{product.basePrice.toLocaleString('en-BD')}
                      </span>
                    )}
                  </div>

                  <Link href={`/product/${product.slug}`}>
                    <span className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-1.5 rounded-lg text-xs font-bold flex items-center">
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
