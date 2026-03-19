import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Instagram, Sparkles, ChefHat } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  rank: string;
  label: string;
  language: string;
}

export default function ShareCard({ isOpen, onClose, rank, label, language }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    // Small delay to ensure rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#000',
      scale: 3, // Higher scale for better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Ensure the cloned element is visible for capture
        const el = clonedDoc.querySelector('[data-capture-card="true"]') as HTMLElement;
        if (el) el.style.visibility = 'visible';
      }
    });
    
    const link = document.createElement('a');
    link.download = `quantivo-genius-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <div className="max-w-sm w-full space-y-6">
            <div className="flex justify-between items-center text-white">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">Achievement Unlocked</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* The Card to be captured - Simplified "Pure" Design */}
            <div 
              ref={cardRef}
              data-capture-card="true"
              className="aspect-[4/5] w-full rounded-2xl p-12 flex flex-col justify-between relative overflow-hidden border"
              style={{ backgroundColor: '#000000', borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full -ml-16 -mb-16" />

              <div className="space-y-12 relative z-10">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black mb-6">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
                    YOU ARE A<br />
                    <span className="text-amber-500">{label}</span>
                  </h2>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    You solved a riddle that <span className="text-white font-bold">{rank}</span> of our customers could not solve.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <span className="text-[8px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Official Recognition</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                  </div>
                  <p className="text-[10px] text-center text-zinc-300 italic">
                    "Intelligence is the ability to adapt to change."
                  </p>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-end border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.5em] font-black" style={{ color: '#ffffff' }}>Quantivo AI</p>
                  <p className="text-[8px] uppercase tracking-[0.2em]" style={{ color: '#52525b' }}>Verified Achievement • 2026</p>
                </div>
                <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center opacity-50">
                  <ChefHat size={20} className="text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 bg-amber-500 text-black py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                <Download size={16} /> Save Achievement
              </button>
              <button 
                onClick={onClose}
                className="flex items-center justify-center gap-2 text-zinc-500 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
