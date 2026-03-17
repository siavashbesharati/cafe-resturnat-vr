import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface LanguageLandingProps {
  onSelect: (lang: Language) => void;
}

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'am', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: 'Farsi', nativeName: 'فارسی', flag: '🇮🇷' },
];

export default function LanguageLanding({ onSelect }: LanguageLandingProps) {
  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center space-y-12 max-w-md w-full"
      >
        <div className="space-y-4">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-light tracking-[0.2em] text-white uppercase"
          >
            Quantivo
          </motion.h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">Smart Gastronomy Experience</p>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(lang.code)}
              className="group relative flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{lang.flag}</span>
                <div className="text-left">
                  <p className={`text-white text-sm font-medium ${lang.code === 'fa' ? 'font-vazir' : ''}`}>{lang.nativeName}</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{lang.name}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <span className="text-xs">→</span>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-zinc-600 text-[10px] uppercase tracking-widest">Select your preferred language to begin</p>
      </motion.div>
    </div>
  );
}
