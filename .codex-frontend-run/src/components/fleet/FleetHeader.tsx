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
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-13 pr-5 py-3.5 bg-white border-2 border-border rounded-lg text-ink-1 text-base font-medium focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-3"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
