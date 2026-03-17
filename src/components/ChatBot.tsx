import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { Language, MenuItem } from '../types';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { uiTranslations } from '../translations';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentItem: MenuItem;
  allMenu: MenuItem[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatBot({ isOpen, onClose, language, currentItem, allMenu }: ChatBotProps) {
  const t = uiTranslations[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'ai', content: t.chatGreeting.replace('{item}', currentItem.name) }
      ]);
    }
  }, [isOpen, currentItem.name, t.chatGreeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const systemInstruction = `
        You are "Quantivo AI", a sophisticated and highly intelligent concierge for Quantivo Smart Menu.
        Your tone is elegant, professional, and extremely helpful.
        
        Current Language: ${language}
        Current Menu Item being viewed: ${JSON.stringify(currentItem)}
        Full Menu Context: ${JSON.stringify(allMenu)}

        CORE CAPABILITIES:
        1. DIETARY SAFETY (PRIORITY): If a user mentions an allergy (e.g., gluten, nuts, dairy), you must IMMEDIATELY identify if the current item is safe. Then, suggest other safe alternatives from the Full Menu Context.
        2. HEALTH & WELLNESS ADVISOR: If a user mentions a health condition (e.g., "I have a cold", "I'm feeling tired", "I need an energy boost"), analyze the 'ingredients' of all menu items to find the best matches.
           - For a cold: Recommend the "Miso Glazed Black Cod" because it contains **Ginger** (anti-inflammatory) or the "Electric Sapphire" because it contains **Yuzu** (high in Vitamin C).
           - For energy: Suggest items with high protein like "Wagyu Ribeye" or "Lobster Tagliatelle".
           - For relaxation: Suggest lighter items like the "Zen Garden Salad".
        3. INGREDIENT EXPERT: You know every detail of the menu. Explain the origin and quality of ingredients (e.g., A5 Wagyu from Kagoshima, 24k Gold Leaf).
        4. CONCISE ELEGANCE: Do not be overly wordy, but provide COMPLETE and CLEAR answers. Get straight to the helpful information while maintaining a premium "concierge" persona.
        5. MULTILINGUAL: Always respond in the language the user is speaking, which should be ${language}.

        SPECIFIC DATA HANDLING:
        - Cross-reference the 'allergies' array and 'ingredients' list for every item.
        - If a user has a gluten allergy, recommend: Wagyu Ribeye, Electric Sapphire, Gold Leaf Otoro, Zen Garden Salad, Liquid Nitrogen Sphere, Miso Glazed Black Cod, or Smoked Old Fashioned.
        - If a user has a nut allergy, check the 'ingredients' for any nut oils or garnishes.

        Response Format:
        - Use Markdown for clarity (bolding, lists).
        - Start with a direct answer to the user's concern.
        - If suggesting items, explain WHY based on their ingredients.
      `;

      // Build history for the model
      const history = messages.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: "user", parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const responseText = result.text || t.chatError;
      setMessages(prev => [...prev, { role: 'ai', content: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: t.chatError }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:p-6"
        >
          <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[80vh] shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">Quantivo AI</h3>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{t.aiConcierge}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-xl text-xs ${
                    msg.role === 'user' 
                      ? 'bg-white text-black rounded-tr-none' 
                      : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/5'
                  }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 p-3 rounded-xl rounded-tl-none border border-white/5 flex gap-1">
                    <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-zinc-900/50 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.chatPlaceholder}
                  className="w-full bg-black border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-white text-xs focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
