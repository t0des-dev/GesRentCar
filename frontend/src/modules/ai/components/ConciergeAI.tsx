"use client";

import { Sparkles, Send, X, Bot, ArrowRight, MessageSquare } from "lucide-react";
import { cn } from "@/shared/utils";
import { useConcierge } from "@/hooks/useConcierge";

export default function ConciergeAI() {
  const {
    isOpen, setIsOpen,
    messages, input, setInput,
    isTyping, scrollRef, handleSend,
    router
  } = useConcierge();

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="relative z-10 group-hover:hidden" size={24} />
        <Sparkles className="relative z-10 hidden group-hover:block animate-pulse" size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 md:w-[450px] md:h-[600px] z-[60] bg-white md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <Bot className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-black text-lg tracking-tight">Concierge IA</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">En ligne</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col max-w-[85%]", m.role === "user" ? "ml-auto items-end" : "items-start")}>
                <div className={cn(
                  "p-4 rounded-3xl text-sm font-medium shadow-sm",
                  m.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                )}>
                  {m.content}
                </div>
                
                {m.recommendation && (
                  <div className="mt-4 bg-white border border-primary/20 rounded-[28px] overflow-hidden shadow-xl animate-in zoom-in-95 duration-500 w-full">
                    <div className="bg-primary/5 p-4 border-b border-primary/10">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Recommandation Exclusive</p>
                      <h4 className="font-black text-slate-900">{m.recommendation.brand} {m.recommendation.model}</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-500 italic">"{m.recommendation.reason}"</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-black text-slate-900">{m.recommendation.price} <span className="text-[10px] text-slate-400 font-bold uppercase">DH/j</span></span>
                        <button 
                          onClick={() => router.push(`/fleet?id=${m.recommendation?.id}`)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                        >
                          Choisir <ArrowRight size={12}/>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 p-4 bg-white rounded-3xl rounded-tl-none border border-slate-100 w-20 shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-3xl px-5 py-2 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Votre besoin (Ex: Mariage...)"
                className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">Vectoria Concierge Intelligence • 2026</p>
          </div>
        </div>
      )}
    </>
  );
}
