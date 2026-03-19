import React, { useState, useEffect } from 'react';
import { Language, MenuItem, CartItem } from './types';
import LanguageLanding from './components/LanguageLanding';
import MenuViewer from './components/MenuViewer';
import ChatBot from './components/ChatBot';
import Cart from './components/Cart';
import OrderTimer from './components/OrderTimer';

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStartTime, setOrderStartTime] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Food');

  const categories = ['Food', 'Breakfast', 'Softdrink', 'Hotbar'];

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch menu:', err);
        setIsLoading(false);
      });
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!language) {
    return <LanguageLanding onSelect={handleLanguageSelect} />;
  }

  // Map menu items to the selected language
  const translatedMenu = menuItems.map(item => ({
    ...item,
    name: item.translations[language].name,
    description: item.translations[language].description,
    // Keep original category for filtering, but provide translated one for UI if needed
    translatedCategory: item.translations[language].category,
    ingredients: item.translations[language].ingredients,
    allergies: item.translations[language].allergies,
    history: item.translations[language].history,
  }));

  const filteredMenu = translatedMenu.filter(item => item.category === selectedCategory);

  const translatedCart = cart.map(item => ({
    ...item,
    name: item.translations[language].name,
    description: item.translations[language].description,
    category: item.translations[language].category,
    ingredients: item.translations[language].ingredients,
    allergies: item.translations[language].allergies,
    history: item.translations[language].history,
  }));

  return (
    <div className={`font-sans antialiased text-white selection:bg-amber-500/30 ${language === 'fa' ? 'font-vazir' : ''}`} dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <MenuViewer 
        items={filteredMenu}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onAddToCart={addToCart}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onIndexChange={setActiveIndex}
        language={language}
        onBackToLanguage={() => setLanguage(null)}
      />

      <ChatBot 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
        currentItem={translatedMenu[activeIndex]}
        allMenu={translatedMenu}
        onAddToCart={addToCart}
      />

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={translatedCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        onOrderSubmit={() => setOrderStartTime(Date.now())}
        language={language}
      />

      {orderStartTime && (
        <OrderTimer 
          startTime={orderStartTime} 
          onClose={() => setOrderStartTime(null)} 
          language={language}
        />
      )}
    </div>
  );
}
