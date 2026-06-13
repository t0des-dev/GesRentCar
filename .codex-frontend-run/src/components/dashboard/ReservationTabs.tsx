"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReservationTabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  reservations: any[];
}

export default function ReservationTabs({ activeTab, setActiveTab, reservations }: ReservationTabsProps) {
  const TABS: { key: string; label: string }[] = [
    { key: "all",             label: "Vue d'ensemble" },
    { key: "active",          label: "En mission" },
    { key: "confirmed",       label: "Réservations" },
    { key: "pending_payment", label: "Paiements" },
    { key: "completed",       label: "Historique" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="flex flex-wrap gap-3 mb-12 pb-6 border-b-2 border-border"
    >
      {TABS.map((tab, idx) => {
        const count = tab.key !== "all" ? reservations.filter(r => r.status === tab.key).length : reservations.length;
        const isActive = activeTab === tab.key;

        return (
          <motion.button
            key={tab.key}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 group",
              isActive
                ? "bg-gradient-to-r from-gold to-gold/90 text-ink-1 shadow-lg shadow-gold/40"
                : "text-ink-2 hover:text-gold hover:bg-gold/5 border-2 border-transparent hover:border-gold/40"
            )}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black transition-all",
                isActive 
                  ? "bg-white/30 text-white" 
                  : "bg-gold/20 text-gold group-hover:bg-gold/30"
              )}>
                {count}
              </span>
            )}
            
            {/* Active underline */}
            {isActive && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-gold/60 rounded-full"
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
