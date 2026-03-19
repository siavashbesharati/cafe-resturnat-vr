import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem, Language } from '../types';
import { Plus, ShoppingBasket, MessageSquare, ChevronLeft, ChevronRight, Globe, Menu, X } from 'lucide-react';
import { uiTranslations } from '../translations';

interface MenuViewerProps {
  items: MenuItem[];
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onAddToCart: (item: MenuItem) => void;
  onOpenChat: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onIndexChange?: (index: number) => void;
  language: Language;
  onBackToLanguage: () => void;
}

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function MenuViewer({ 
  items, 
  categories,
  selectedCategory,
  onCategorySelect,
  onAddToCart, 
  onOpenChat, 
  onOpenCart, 
  cartCount, 
  onIndexChange, 
  language,
  onBackToLanguage
}: MenuViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [splitRatio, setSplitRatio] = useState(50); // Percentage for bottom panel
  const containerRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const t = uiTranslations[language];

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    onIndexChange?.(0);
  }, [selectedCategory]);

  const nextItem = () => {
    if (items.length === 0) return;
    const next = (currentIndex + 1) % items.length;
    setCurrentIndex(next);
    onIndexChange?.(next);
    setIsExpanded(false);
  };

  const prevItem = () => {
    if (items.length === 0) return;
    const prev = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prev);
    onIndexChange?.(prev);
    setIsExpanded(false);
  };

  const currentItem = items[currentIndex];

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!currentItem) return;
    onAddToCart(currentItem);
    
    // Animation logic
    if (addButtonRef.current && cartButtonRef.current) {
      const addRect = addButtonRef.current.getBoundingClientRect();
      const flyingId = Math.random() + Date.now();
      
      setFlyingItems(prev => [...prev, {
        id: flyingId,
        startX: addRect.left + addRect.width / 2,
        startY: addRect.top + addRect.height / 2
      }]);

      setTimeout(() => {
        setFlyingItems(prev => prev.filter(item => item.id !== flyingId));
      }, 800);
    }
  };

  const handleResize = (event: any, info: any) => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.offsetHeight;
    const newBottomHeight = containerHeight - info.point.y;
    const newRatio = (newBottomHeight / containerHeight) * 100;
    
    // Constraints: 20% to 85%
    const clampedRatio = Math.min(Math.max(newRatio, 20), 85);
    setSplitRatio(clampedRatio);
    setIsExpanded(false); // Reset expanded state if manually resizing
  };

  return (
    <div ref={containerRef} className="h-[100dvh] w-full bg-[#050505] flex overflow-hidden relative">
      {/* Sidebar Toggle Button (Floating) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute top-4 z-[80] p-2.5 bg-amber-500 rounded-xl text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400 transition-all duration-300 ${
          language === 'fa' ? 'right-4' : 'left-4'
        }`}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Category Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? (window.innerWidth < 768 ? 80 : 96) : 0,
          opacity: isSidebarOpen ? 1 : 0,
          x: isSidebarOpen ? 0 : (language === 'fa' ? 100 : -100)
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full bg-black/40 backdrop-blur-md border-white/5 flex flex-col items-center py-8 gap-8 z-[60] overflow-hidden ${
          language === 'fa' ? 'order-last border-l' : 'order-first border-r'
        }`}
      >
        <div className="min-w-[80px] flex flex-col items-center gap-8 h-full">
          <button 
            onClick={onBackToLanguage}
            className="p-2 text-zinc-500 hover:text-white transition-colors shrink-0"
            title="Change Language"
          >
            <Globe size={18} />
          </button>
          
          <div className="flex-1 flex flex-col gap-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className="relative group flex items-center justify-center"
              >
                <span className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 vertical-text whitespace-nowrap ${selectedCategory === cat ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}>
                  {t.categories[cat]}
                </span>
                {selectedCategory === cat && (
                  <motion.div 
                    layoutId="activeCategory"
                    className={`absolute w-1 h-8 bg-amber-500 rounded-full ${language === 'fa' ? '-right-4' : '-left-4'}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Flying Animation Overlay */}
        <AnimatePresence>
          {flyingItems.map(item => {
            const cartRect = cartButtonRef.current?.getBoundingClientRect();
            if (!cartRect) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ 
                  x: item.startX - 12, 
                  y: item.startY - 12, 
                  scale: 1, 
                  opacity: 1 
                }}
                animate={{ 
                  x: cartRect.left + cartRect.width / 2 - 12, 
                  y: cartRect.top + cartRect.height / 2 - 12, 
                  scale: 0.2, 
                  opacity: 0.5 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="fixed z-[100] w-6 h-6 bg-amber-500 rounded-full pointer-events-none flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                <Plus size={12} className="text-black" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Top Section: 3D Viewer */}
        <motion.div 
          className="w-full relative overflow-hidden"
          animate={{ 
            height: isExpanded ? '0%' : `${100 - splitRatio}%`, 
            opacity: isExpanded ? 0 : 1 
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.length > 0 && currentItem ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                {/* @ts-ignore */}
                <model-viewer
                  src={currentItem.modelUrl}
                  alt={currentItem.name}
                  auto-rotate
                  camera-controls
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  shadow-intensity="0"
                  exposure="1"
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                >
                  <button
                    slot="ar-button"
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest uppercase"
                  >
                    {t.viewInAr}
                  </button>
                  {/* @ts-ignore */}
                </model-viewer>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 uppercase tracking-widest text-xs">
              {t.noneDetected}
            </div>
          )}

          {/* Navigation Arrows */}
          {!isExpanded && items.length > 1 && (
            <>
              <button 
                onClick={prevItem}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={nextItem}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </motion.div>

        {/* Resizable Handle */}
        {!isExpanded && (
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleResize}
            className="h-8 w-full flex items-center justify-center cursor-row-resize z-[70] relative -my-4"
          >
            <div className="w-16 h-1.5 bg-white/20 rounded-full hover:bg-amber-500/50 transition-colors" />
          </motion.div>
        )}

        {/* Bottom Section: Details Panel */}
        <motion.div 
          className="w-full bg-gradient-to-t from-black via-zinc-900/50 to-transparent backdrop-blur-xl border-t border-white/5 p-8 flex flex-col relative z-50 overflow-hidden"
          animate={{ height: isExpanded ? '100%' : `${splitRatio}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`flex-1 overflow-y-auto no-scrollbar ${isExpanded ? 'touch-auto' : 'touch-auto'}`}>
            {items.length > 0 && currentItem ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-light text-white tracking-tight">{currentItem.name}</h2>
                      <p className="text-amber-500 font-mono text-lg mt-1">{currentItem.price.toLocaleString()} ֏</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em]">{currentItem.translatedCategory || currentItem.category}</span>
                      {isExpanded && (
                        <button 
                          onClick={() => setIsExpanded(false)}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          <Plus className="rotate-45" size={24} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
                      {currentItem.description}
                    </p>

                    {!isExpanded && (
                      <button 
                        onClick={() => setIsExpanded(true)}
                        className="text-amber-500 text-[10px] uppercase tracking-widest font-bold hover:text-amber-400 transition-colors flex items-center gap-1"
                      >
                        {t.moreDetails} <Plus size={12} />
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8 pt-4 pb-20"
                    >
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <h4 className="text-[9px] text-zinc-500 uppercase tracking-widest">{t.ingredients}</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentItem.ingredients.map((ing, idx) => (
                              <span key={`${ing}-${idx}`} className="text-[10px] text-zinc-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{ing}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[9px] text-zinc-500 uppercase tracking-widest">{t.nutrition}</h4>
                          <div className="space-y-1 text-[10px] text-zinc-400">
                            <p>Calories: <span className="text-white">{currentItem.nutrition.calories}</span></p>
                            <p>Protein: <span className="text-white">{currentItem.nutrition.protein}</span></p>
                            <p>Fat: <span className="text-white">{currentItem.nutrition.fat}</span></p>
                          </div>
                        </div>
                      </div>

                      {currentItem.history && (
                        <div className="space-y-2">
                          <h4 className="text-[9px] text-zinc-500 uppercase tracking-widest">{t.history}</h4>
                          <p className="text-zinc-400 text-xs leading-relaxed italic font-serif">
                            "{currentItem.history}"
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-[9px] text-zinc-500 uppercase tracking-widest">{t.allergies}</h4>
                        <div className="flex gap-2">
                          {currentItem.allergies.length > 0 ? (
                            currentItem.allergies.map((a, idx) => (
                              <span key={`${a}-${idx}`} className="text-[10px] text-red-400/80 border border-red-400/20 px-2 py-0.5 rounded-sm uppercase">{a}</span>
                            ))
                          ) : (
                            <span className="text-[10px] text-zinc-600 uppercase">{t.noneDetected}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                <ShoppingBasket size={48} className="opacity-20" />
                <p className="text-xs uppercase tracking-[0.3em]">{t.noneDetected}</p>
              </div>
            )}
          </div>

          {/* Floating Controls */}
          <div className="flex justify-between items-center pt-4 pb-2">
            <button 
              ref={cartButtonRef}
              onClick={onOpenCart}
              className="relative p-2.5 bg-zinc-900 rounded-full border border-white/5 text-white hover:bg-zinc-800 transition-colors"
            >
              <ShoppingBasket size={18} />
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 1.5, backgroundColor: '#f59e0b' }}
                  animate={{ scale: 1, backgroundColor: '#f59e0b' }}
                  className="absolute -top-1 -right-1 bg-amber-500 text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {items.length > 0 && currentItem && (
              <button 
                ref={addButtonRef}
                onClick={handleAddToCart}
                className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-colors active:scale-95"
              >
                <Plus size={14} />
                {t.addToCart}
              </button>
            )}

            <button 
              onClick={onOpenChat}
              className="p-2.5 bg-amber-500 rounded-full text-black hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <MessageSquare size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
