"use client";

import { motion } from "framer-motion";
import FleetFilters, { FleetFilterState } from "@/components/FleetFilters";
import { useTranslation } from "@/hooks/useTranslation";

interface FleetSidebarProps {
  onFilter: (filters: FleetFilterState) => void;
}

export default function FleetSidebar({ onFilter }: FleetSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky top-32 space-y-8"
      >
        <div className="p-8 rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <FleetFilters onFilter={onFilter} />
        </div>

        {/* Promo Card */}
        <div className="p-8 rounded-[40px] bg-primary relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <h4 className="text-white font-black text-lg mb-2 relative z-10">{t("member_title")}</h4>
          <p className="text-white/70 text-xs font-medium mb-6 relative z-10">{t("member_desc")}</p>
          <button className="bg-white text-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
            {t("member_btn")}
          </button>
        </div>
      </motion.div>
    </aside>
  );
}
