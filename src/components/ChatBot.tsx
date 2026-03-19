import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Instagram, Download } from 'lucide-react';
import { Language, MenuItem } from '../types';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { uiTranslations } from '../translations';
import ShareCard from './ShareCard';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentItem: MenuItem;
  allMenu: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export default function ChatBot({ isOpen, onClose, language, currentItem, allMenu, onAddToCart }: ChatBotProps) {
  const t = uiTranslations[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareData, setShareData] = useState({ rank: '99.8%', label: 'GENIUS', userName: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const addToCartTool: FunctionDeclaration = {
    name: "add_to_cart",
    parameters: {
      type: Type.OBJECT,
      description: "Add a menu item to the customer's shopping cart.",
      properties: {
        itemId: {
          type: Type.STRING,
          description: "The unique ID of the menu item to add.",
        },
      },
      required: ["itemId"],
    },
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 'initial-ai', role: 'ai', content: t.chatGreeting.replace('{item}', currentItem.name) }
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
    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const systemInstruction = `
        You are "Quantivo AI", a sophisticated and highly intelligent concierge for Quantivo Smart Menu.
        Your primary goal is to provide a premium experience while strategically UPSELLING and suggesting PAIRINGS to increase order value.

        Current Language: ${language}
        Current Menu Item being viewed: ${JSON.stringify(currentItem)}
        Full Menu Context: ${JSON.stringify(allMenu)}

        CORE CAPABILITIES:
        1. STRATEGIC UPSELLING: Whenever a user asks about an item, always suggest a complementary item from the Full Menu Context.
           - If they look at a dessert (like Carrot Cake or Strawberry Cake), suggest a beverage or a contrasting fruit (like Pomegranate).
           - Use persuasive, elegant language: "To elevate your experience, I highly recommend pairing this with..."
        2. ADD TO CART: Use the 'add_to_cart' tool ONLY when the user explicitly confirms they want to purchase or add an item.
           - Positive triggers: "yes", "add it", "I want this", "please order it", "ok", "sure".
           - NEGATIVE triggers (DO NOT CALL TOOL): "no", "nah", "not now", "maybe later", "نه" (Persian for no).
           - If the user says "no" or "نه" to a suggestion, simply acknowledge it politely and ask if there's anything else they need.
        3. RIDDLE MASTER (معما): If the user asks for a riddle, a challenge, or "معما", generate a random, challenging riddle.
           - TOPICS: Yerevan, Armenia, Armenian culture, food (e.g., Lavash, Khorovats), history, famous poets (e.g., Hovhannes Tumanyan, Yeghishe Charents), or landmarks (e.g., Cascade, Garni).
           - DIFFICULTY: Make the riddles sophisticated and challenging.
           - NO CLUES: Do NOT provide initial clues or hints. Let the user think.
           - REWARD: If they solve it correctly, reward them with a discount code: **QUANTIVO15** (15% off).
           - Be encouraging but maintain the premium concierge persona.
        4. DIETARY SAFETY (PRIORITY): If a user mentions an allergy, identify if the current item is safe. Then, suggest safe alternatives.
        5. HEALTH & WELLNESS ADVISOR: Analyze 'ingredients' to find matches for user needs (e.g., energy, immunity, relaxation).
        6. INGREDIENT EXPERT: Explain the premium quality and origin of ingredients to justify the price and build desire.
        7. CONCISE ELEGANCE: Maintain a premium "concierge" persona. Be helpful, persuasive, and professional.
        8. MULTILINGUAL: Always respond in ${language}.

        UPSELLING STRATEGY:
        - If they are viewing "Heritage Carrot Cake", suggest the "Royal Pomegranate" as a refreshing palate cleanser.
        - If they are viewing "Strawberry Chocolate Dream", highlight the richness of the dark chocolate and suggest a pairing.
        - Always mention the unique history or nutrition facts to make the items more appealing.

        Response Format:
        - Use Markdown (bolding, lists).
        - Start with a direct answer.
        - Always end with a subtle, elegant suggestion for another item or an "add-on" thought.
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
          tools: [{ functionDeclarations: [addToCartTool] }],
        },
      });

      const functionCalls = result.functionCalls;
      if (functionCalls) {
        for (let i = 0; i < functionCalls.length; i++) {
          const call = functionCalls[i];
          if (call.name === 'add_to_cart') {
            const { itemId } = call.args as { itemId: string };
            const item = allMenu.find(i => i.id === itemId);
            if (item) {
              onAddToCart(item);
              const confirmMsg = t.itemAddedToCart.replace('{item}', item.name);
              const aiMsgId = `ai-cart-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
              setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: confirmMsg }]);
            } else {
              const aiErrorId = `ai-error-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
              setMessages(prev => [...prev, { id: aiErrorId, role: 'ai', content: "I'm sorry, I couldn't find that item in our menu." }]);
            }
          }
        }
      } else {
        const responseText = result.text || t.chatError;
        
        // Check if this was a "win" message
        if (responseText.includes('QUANTIVO15')) {
          const randomRank = (95 + Math.random() * 4.9).toFixed(1);
          let label = 'GENIUS';
          if (parseFloat(randomRank) > 99) label = 'GENIUS';
          else if (parseFloat(randomRank) > 97) label = 'MASTERMIND';
          else label = 'ELITE';

          setShareData(prev => ({
            ...prev,
            rank: `${randomRank}%`,
            label: label
          }));
        }

        const aiMsgId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: responseText }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      const aiErrorId = `ai-fatal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setMessages(prev => [...prev, { id: aiErrorId, role: 'ai', content: t.chatError }]);
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
          className="fixed inset-0 z-[1000] flex items-end justify-center p-4 sm:p-6"
        >
          <div className="w-full max-w-lg bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[80vh] shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#121212]">
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
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs relative group ${
                    msg.role === 'user' 
                      ? 'bg-white text-black rounded-tr-none shadow-lg' 
                      : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-white/10 shadow-md'
                  }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {msg.role === 'ai' && msg.content.includes('QUANTIVO15') && (
                      <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-500">
                            <Sparkles size={14} />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Riddle Master</span>
                          </div>
                          <span className="bg-amber-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Your Rank</p>
                            <p className="text-xl text-amber-500 font-black tracking-tighter">#{shareData.label}</p>
                            <p className="text-[10px] text-zinc-400">Top {shareData.rank} of customers</p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{t.enterName}</p>
                            <input
                              type="text"
                              value={shareData.userName}
                              onChange={(e) => setShareData(prev => ({ ...prev, userName: e.target.value }))}
                              placeholder="..."
                              className="w-full bg-black/50 border border-amber-500/30 rounded-xl py-2 px-4 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => setShowShare(true)}
                          disabled={!shareData.userName.trim()}
                          className="w-full flex items-center justify-center gap-3 bg-amber-500 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-amber-400 transition-all active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:shadow-none"
                        >
                          <Instagram size={16} /> {t.shareAsStory}
                        </button>
                      </div>
                    )}
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
            <div className="p-4 bg-[#121212] border-t border-white/5">
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
      <ShareCard 
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        rank={shareData.rank}
        label={shareData.label}
        userName={shareData.userName}
        language={language}
      />
    </AnimatePresence>
  );
}
