import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, CheckCircle2, ChefHat } from 'lucide-react';
import { CartItem, Language } from '../types';
import { uiTranslations } from '../translations';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOrderSubmit: () => void;
  language: Language;
}

export default function Cart({ isOpen, onClose, items, onRemove, onClear, onOrderSubmit, language }: CartProps) {
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const t = uiTranslations[language];

  const handleSendToKitchen = async () => {
    setIsOrdering(true);
    // Simulate sending to kitchen
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOrdering(false);
    setOrderComplete(true);
    onOrderSubmit();
    
    // Reset after showing success
    setTimeout(() => {
      onClear();
      setOrderComplete(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-[#0a0a0a] h-full flex flex-col shadow-2xl border-l border-white/5"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ChefHat className="text-amber-500" />
                <h2 className="text-xl font-light text-white uppercase tracking-widest">{t.yourOrder}</h2>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {orderComplete ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-light text-white">{t.orderSent}</h3>
                  <p className="text-zinc-500 text-sm max-w-[200px]">{t.orderPreparing}</p>
                </motion.div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="uppercase tracking-widest text-xs">{t.orderEmpty}</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, height: 0, x: -20 }}
                      animate={{ opacity: 1, height: 'auto', x: 0 }}
                      exit={{ opacity: 0, height: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex justify-between items-center group py-4 border-b border-white/5 last:border-0">
                        <div>
                          <h3 className="text-white font-light">{item.name}</h3>
                          <p className="text-zinc-500 text-xs mt-1">
                            {item.quantity} x {item.price.toLocaleString()} ֏
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-amber-500 font-mono">{(item.price * item.quantity).toLocaleString()} ֏</p>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-zinc-700 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {!orderComplete && (
              <div className="p-8 bg-zinc-900/30 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-widest text-xs">{t.total}</span>
                  <span className="text-2xl text-white font-light">{total.toLocaleString()} ֏</span>
                </div>
                <button 
                  onClick={handleSendToKitchen}
                  disabled={items.length === 0 || isOrdering}
                  className="w-full bg-white text-black py-5 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {isOrdering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <ChefHat size={20} />
                      {t.sendToKitchen}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
