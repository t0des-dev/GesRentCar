"use client";

import { motion } from "framer-motion";
import FleetFilters, { FleetFilterState } from "@/modules/fleet/components/FleetFilters";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Star, Gift } from "lucide-react";

interface FleetSidebarProps {
  onFilter: (filters: FleetFilterState) => void;
}

export default function FleetSidebar({ onFilter }: FleetSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <motion.div 
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="sticky top-40 space-y-6"
      >
        {/* Filters Card */}
        <div className="bg-white rounded-xl border-2 border-border shadow-md p-8 card-premium">
          <FleetFilters onFilter={onFilter} />
        </div>

        {/* Premium Banner */}
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-primary to-primary/90 border-2 border-primary/40 shadow-lg shadow-primary/20"
        >
          {/* Background Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          
          {/* Content */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-gold" />
              <h4 className="text-white font-bold text-base uppercase tracking-wider">{t("member_title")}</h4>
            </div>
            <p className="text-white/85 text-sm leading-relaxed font-light">
              {t("member_desc")}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white text-primary px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-white/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Gift size={14} />
              {t("member_btn")}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </aside>
  );
}
