import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Instagram, Sparkles, ChefHat } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  riddle: string;
  answer: string;
  language: string;
}

export default function ShareCard({ isOpen, onClose, riddle, answer, language }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#000',
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const link = document.createElement('a');
    link.download = `quantivo-riddle-solved.png`;
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
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="max-w-sm w-full space-y-6">
            <div className="flex justify-between items-center text-white">
              <h3 className="text-sm font-light uppercase tracking-[0.2em]">Share Achievement</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* The Card to be captured */}
            <div 
              ref={cardRef}
              className="aspect-[9/16] w-full rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl"
              style={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(245, 158, 11, 0.3)' }}
            >
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)' }} />

              <div className="space-y-12 relative flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <p className="text-[11px] uppercase tracking-[0.3em] font-bold flex items-center gap-2" style={{ color: '#f59e0b' }}>
                      <Sparkles size={12} /> Riddle Solved
                    </p>
                  </div>
                  <h2 className="text-white text-3xl font-light tracking-tight leading-tight">Quantivo AI <br/><span className="text-zinc-500 text-sm uppercase tracking-[0.2em]">Master Concierge</span></h2>
                </div>
                
                <div className="space-y-10">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-600 font-black">The Challenge</p>
                    <p className="text-xl italic leading-relaxed font-serif text-white/90">
                      "{riddle}"
                    </p>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                  
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-600 font-black">The Solution</p>
                    <p className="text-4xl font-medium tracking-tight" style={{ color: '#f59e0b' }}>
                      {answer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col items-center gap-4 relative" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <p className="text-[11px] uppercase tracking-[0.6em] text-zinc-500 font-bold">Quantivo.ai</p>
                <div className="flex gap-8 text-[10px] uppercase tracking-widest text-zinc-600">
                  <span>Yerevan</span>
                  <span>•</span>
                  <span>2026</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
              >
                <Download size={16} /> Save
              </button>
              <button 
                onClick={handleDownload} // In a real app, this might use Web Share API
                className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                <Instagram size={16} /> Share
              </button>
            </div>
            
            <p className="text-center text-zinc-500 text-[10px] uppercase tracking-widest">
              Screenshot & tag us @Quantivo
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
