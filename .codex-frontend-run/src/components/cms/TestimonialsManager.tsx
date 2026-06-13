"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Star, User, MessageSquare, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
}

export default function TestimonialsManager({ testimonials, onChange }: TestimonialsManagerProps) {
  const add = () => {
    onChange([...testimonials, { name: "Nouveau Client", role: "Voyageur", content: "Superbe expérience...", rating: 5 }]);
  };

  const remove = (index: number) => {
    const next = [...testimonials];
    next.splice(index, 1);
    onChange(next);
  };

  const update = (index: number, field: keyof Testimonial, value: any) => {
    const next = [...testimonials];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Quote size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Témoignages Clients</h3>
        </div>
        <button 
          onClick={add}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm relative group"
            >
              <button 
                onClick={() => remove(i)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400">Nom du client</label>
                    <input 
                      type="text" 
                      value={t.name ?? ""} 
                      onChange={e => update(i, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400">Note (1-5)</label>
                    <div className="flex items-center gap-2 h-9">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={14} 
                          onClick={() => update(i, 'rating', star)}
                          className={cn("cursor-pointer", t.rating >= star ? "fill-amber-400 text-amber-400" : "text-slate-200")} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">Rôle / Ville</label>
                  <input 
                    type="text" 
                    value={t.role ?? ""} 
                    onChange={e => update(i, 'role', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-xs outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">Témoignage</label>
                  <textarea 
                    rows={3} 
                    value={t.content ?? ""} 
                    onChange={e => update(i, 'content', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium text-xs outline-none focus:border-primary transition-all resize-none italic"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {testimonials.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
           <MessageSquare size={32} className="mx-auto text-slate-200 mb-4" />
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aucun témoignage configuré</p>
        </div>
      )}
    </div>
  );
}
