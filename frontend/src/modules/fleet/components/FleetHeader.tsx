"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface FleetHeaderProps {
  search: string;
  setSearch: (val: string) => void;
}

export default function FleetHeader({ search, setSearch }: FleetHeaderProps) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    "Mercedes-Benz Classe G",
    "Porsche 911",
    "Range Rover Sport",
    "Audi RS Q8",
    "BMW M4",
    "Jeep Wrangler"
  ];

  return (
    <div className="mb-20 space-y-8">
      {/* Eyebrow */}
      <motion.div 
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="section-eyebrow inline-flex"
      >
        {t("fleet_tag")}
      </motion.div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        
        {/* Left: Title + Subtitle */}
        <div className="max-w-3xl space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="display-lg text-ink-1 leading-tight"
          >
            {t("fleet_title_1")} <br />
            <span className="bg-gradient-to-r from-gold via-gold/80 to-gold/60 bg-clip-text text-transparent">
              {t("fleet_title_2")}
            </span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="body-feature text-ink-2 leading-relaxed max-w-xl"
          >
            {t("fleet_subtitle")}
          </motion.p>
        </div>
        
        {/* Right: Search */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.6 }}
          className="w-full lg:w-[380px] shrink-0"
        >
          <div className="relative group">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold group-focus-within:text-gold transition-colors z-10" />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full pl-13 pr-5 py-4 bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl text-ink-1 text-base font-bold focus:outline-none focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all placeholder:text-ink-4 placeholder:font-medium relative z-10"
            />
            
            {/* Predictive Search Dropdown */}
            <AnimatePresence>
              {isFocused && search.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 py-2"
                >
                  <p className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400">Suggestions</p>
                  {suggestions.filter(s => s.toLowerCase().includes(search.toLowerCase())).map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setSearch(suggestion)}
                      className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm font-semibold text-slate-700"
                    >
                      <Search size={14} className="text-slate-400" />
                      {suggestion}
                    </button>
                  ))}
                  {suggestions.filter(s => s.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <div className="px-5 py-3 text-sm text-slate-500">Aucune suggestion trouvée.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
