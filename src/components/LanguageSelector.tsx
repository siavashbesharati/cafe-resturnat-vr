import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
}

const flags = [
  { code: 'UK', label: 'English', flag: '🇬🇧' },
  { code: 'AM', label: 'Հայերեն', flag: '🇦🇲' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'TR', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'IR', label: 'فارسی', flag: '🇮🇷' },
];

export default function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-light tracking-[0.2em] text-white uppercase mb-2">Quantivo</h1>
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Select Language</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 max-w-md px-6">
        {flags.map((lang, index) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(lang.code as Language)}
            className="w-20 h-20 rounded-full border border-zinc-800 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">{lang.code}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
