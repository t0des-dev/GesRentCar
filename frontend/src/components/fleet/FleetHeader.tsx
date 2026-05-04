"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface FleetHeaderProps {
  search: string;
  setSearch: (val: string) => void;
}

export default function FleetHeader({ search, setSearch }: FleetHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-12 h-px bg-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t("fleet_tag")}</span>
      </motion.div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[120px] font-black text-foreground tracking-tighter leading-[0.85] mb-8"
          >
            {t("fleet_title_1")} <br />
            <span className="text-gradient-gold">{t("fleet_title_2")}</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium text-xl md:text-2xl max-w-xl leading-relaxed opacity-80"
          >
            {t("fleet_subtitle")}
          </motion.p>
        </div>
        
        {/* Search Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-[400px] relative group"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl transition-all group-focus-within:border-primary/50" />
          <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-20 pr-8 py-7 rounded-[32px] bg-transparent text-foreground font-black text-lg focus:outline-none relative z-10 placeholder:text-slate-600"
          />
        </motion.div>
      </div>
    </div>
  );
}
