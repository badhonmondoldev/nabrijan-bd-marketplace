'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export function NabiMascot({
  variant = 'hero',
  message,
}: {
  variant?: 'hero' | 'search' | 'empty' | 'celebration' | 'guide';
  message?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'search') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center space-x-3 bg-slate-900/90 border border-cyan-500/30 p-2.5 rounded-2xl shadow-lg text-white text-xs backdrop-blur-md"
      >
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-md flex-shrink-0">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black text-cyan-300 text-xs tracking-tighter overflow-hidden">
            <span className="text-emerald-400 font-extrabold text-sm">ナビ</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-950 animate-ping" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 font-bold text-cyan-300 text-[11px]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>NABI Search Assistant</span>
          </div>
          <p className="text-[10px] text-slate-300 truncate">
            {message || 'Type Bangla or English queries below!'}
          </p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-xl"
        >
          <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-cyan-300">
            <span className="text-2xl font-black tracking-tighter text-emerald-400">ナビ</span>
            <span className="text-[9px] font-bold tracking-widest text-cyan-300 uppercase">NABI</span>
          </div>
        </motion.div>
        <div className="max-w-xs space-y-1">
          <h3 className="font-bold text-slate-800 text-sm">NABI couldn&apos;t find any results!</h3>
          <p className="text-xs text-slate-500">
            {message || 'Try searching with different keywords or check our growing category list.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* NABI Hero Mascot Avatar Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden group"
      >
        {/* Holographic Glowing Backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-500/20 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Cyberpunk Original Anime Avatar Badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 p-1 shadow-2xl flex-shrink-0"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-2 relative overflow-hidden border border-cyan-500/30">
              {/* Anime Stylized Name & Symbol */}
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 tracking-widest drop-shadow">
                ナビ
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-cyan-300 uppercase mt-1">
                NABI VIRTUAL GUIDE
              </span>
              <span className="text-[8px] text-emerald-400/80 font-mono mt-0.5">
                NABRIJAN AI ASSISTANT
              </span>
            </div>
            {/* Pulsing Status ring */}
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-950 shadow flex items-center justify-center">
              <span className="w-2 h-2 bg-slate-950 rounded-full animate-ping" />
            </span>
          </motion.div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-400/40 text-cyan-300 text-xs font-extrabold px-3 py-1 rounded-full shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Meet NABI — Your Shopping Companion</span>
            </div>

            <h3 className="text-lg md:text-xl font-black text-white">
              Hi! I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">NABI</span> 🌸
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              Welcome to <span className="font-bold text-amber-300">NABRIJAN MARKET</span>! I help you discover verified local merchants, calculate wholesale RFQ quotes, and guide your shopping experience across Bangladesh.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-[11px] text-slate-300 font-semibold">
              <span className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg">🇧🇩 Local Verified Sellers</span>
              <span className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg">⚡ bKash / Nagad / COD</span>
              <span className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg">📦 Wholesale Tiering</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
