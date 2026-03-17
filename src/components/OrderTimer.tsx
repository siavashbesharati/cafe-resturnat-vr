import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, ChefHat } from 'lucide-react';
import { Language } from '../types';
import { uiTranslations } from '../translations';

interface OrderTimerProps {
  startTime: number;
  onClose: () => void;
  language: Language;
}

export default function OrderTimer({ startTime, onClose, language }: OrderTimerProps) {
  const [remaining, setRemaining] = useState(900);
  const t = uiTranslations[language];

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const timeLeft = Math.max(0, 900 - elapsedSeconds);
      setRemaining(timeLeft);
      
      if (timeLeft === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -150, right: 150, top: -500, bottom: 50 }}
      dragElastic={0.1}
      dragMomentum={false}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl select-none">
        <div className="flex items-center gap-2">
          <div className="relative">
            <ChefHat size={18} className="text-amber-500 animate-pulse" />
            <motion.div 
              className="absolute -inset-1 bg-amber-500/20 rounded-full blur-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">{t.preparing}</span>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10" />
        
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-zinc-500" />
          <span className="text-sm font-mono text-white tabular-nums">{formatTime(remaining)}</span>
        </div>

        <button 
          onClick={onClose}
          className="ml-2 text-zinc-600 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}
