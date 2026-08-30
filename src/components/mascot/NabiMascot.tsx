'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, Heart, Gift, ShoppingBag, Zap } from 'lucide-react';

export function NabiMascot({
  variant = 'hero',
  message,
}: {
  variant?: 'hero' | 'search' | 'empty' | 'gift' | 'guide';
  message?: string;
}) {
  const [showGift, setShowGift] = useState(false);

  if (variant === 'search') {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center space-x-3 bg-slate-900/90 border border-pink-500/40 p-3 rounded-2xl shadow-xl text-white text-xs backdrop-blur-xl"
      >
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-fuchsia-500 p-0.5 shadow-lg flex-shrink-0">
          <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center font-black text-pink-300 text-xs tracking-tighter overflow-hidden border border-pink-400/40">
            <span className="text-pink-400 font-black text-sm drop-shadow-md">ナビ</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-pink-400 rounded-full border-2 border-slate-950 animate-ping" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 font-bold text-pink-300 text-[11px]">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>NABI Anime Guide</span>
          </div>
          <p className="text-[10px] text-slate-300 truncate">
            {message || 'Searching authentic BD products for you!'}
          </p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-full">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 p-1 shadow-2xl pink-glow"
        >
          <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-pink-300 border border-pink-400/40">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-fuchsia-300 drop-shadow">
              ナビ
            </span>
            <span className="text-[9px] font-extrabold tracking-widest text-pink-400 uppercase mt-0.5">
              NABI VIRTUAL
            </span>
          </div>
        </motion.div>
        <div className="max-w-xs space-y-1.5">
          <h3 className="font-bold text-white text-base">NABI couldn&apos;t find any matches! 🌸</h3>
          <p className="text-xs text-slate-400">
            {message || 'Try exploring our active categories or search with different keywords.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* NABI 3D Anime Mascot Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/98 border border-pink-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl overflow-hidden group"
      >
        {/* Holographic Glowing Backdrop Aura */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-pink-500/25 via-rose-500/20 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-fuchsia-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 relative z-10">
          {/* Cyber-Anime Mascot Avatar Ring */}
          <motion.div
            animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-fuchsia-500 p-1 shadow-2xl pink-glow flex-shrink-0 cursor-pointer"
            onClick={() => setShowGift(!showGift)}
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-2 relative overflow-hidden border border-pink-400/50 shadow-inner">
              {/* Anime Character Stylized Mark */}
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-300 tracking-widest drop-shadow-lg">
                ナビ
              </span>
              <span className="text-[10px] font-black tracking-widest text-pink-300 uppercase mt-1">
                NABI (ナビ)
              </span>
              <span className="text-[8px] text-rose-300/80 font-mono mt-0.5">
                AI SHOPPING GUIDE 🌸
              </span>
            </div>
            
            {/* Pulsing Status Badge */}
            <span className="absolute bottom-1 right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-slate-950 flex items-center space-x-1">
              <Zap className="w-2.5 h-2.5 text-amber-300" />
              <span>ONLINE</span>
            </span>
          </motion.div>

          <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
            <div className="inline-flex items-center space-x-1.5 bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-black px-3 py-1 rounded-full shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Meet NABI (ナビ) — Anime Mascot & Guide</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Konnichiwa! I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400">NABI</span> 🌸✨
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed max-w-lg">
              Welcome to <span className="font-extrabold text-pink-300">NABRIJAN MARKET</span>! I am your cyber shopping companion. Browse verified merchants, track live orders, and enjoy a modern e-commerce experience!
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px]">
              <span className="bg-pink-950/60 border border-pink-500/30 text-pink-200 px-2.5 py-1 rounded-xl flex items-center space-x-1 font-semibold">
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                <span>Anime Girl Aesthetic</span>
              </span>
              <span className="bg-rose-950/60 border border-rose-500/30 text-rose-200 px-2.5 py-1 rounded-xl flex items-center space-x-1 font-semibold">
                <Gift className="w-3 h-3 text-rose-400" />
                <span>Instant Deals</span>
              </span>
              <span className="bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-200 px-2.5 py-1 rounded-xl flex items-center space-x-1 font-semibold">
                <ShoppingBag className="w-3 h-3 text-fuchsia-400" />
                <span>64 BD Districts</span>
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Speech Gift Popup */}
        <AnimatePresence>
          {showGift && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3 bg-gradient-to-r from-pink-900/90 to-rose-900/90 border border-pink-400/50 rounded-2xl text-xs text-white flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>🎁 <strong>NABI Special Gift:</strong> Enjoy free delivery & cashback on your first purchase!</span>
              </div>
              <button
                onClick={() => setShowGift(false)}
                className="text-pink-200 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
