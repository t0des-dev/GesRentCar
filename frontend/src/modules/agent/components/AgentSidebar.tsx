"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, PlusCircle, ClipboardList, ShieldCheck } from "lucide-react";
import { cn } from "@/shared/utils";

interface AgentSidebarProps {
  activeTab: string;
  setTab: (id: string) => void;
}

const TABS = [
  { id: "home",         label: "Tableau de Bord",    icon: LayoutDashboard },
  { id: "new",          label: "Ajouter Véhicule",   icon: PlusCircle },
  { id: "reservations", label: "Mes Réservations",  icon: ClipboardList },
  { id: "inspection",   label: "Check-list", icon: ShieldCheck },
];

export default function AgentSidebar({ activeTab, setTab }: AgentSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-2 bg-surface-0 border-2 border-border rounded-2xl p-4 shadow-sm sticky top-28"
    >
      <div className="px-4 py-2 mb-1">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Menu Agent</p>
      </div>
      <nav className="flex flex-col gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setTab(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
              activeTab === id 
                ? "bg-gradient-to-r from-gold to-gold/90 text-ink-1 shadow-sm" 
                : "text-ink-2 hover:bg-surface-1 hover:text-ink-1"
            )}
          >
            {activeTab === id && (
              <motion.div 
                layoutId="activeTabBg"
                className="absolute inset-0 bg-gradient-to-r from-gold to-gold/90"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={18} className={cn("relative z-10", activeTab === id ? "text-primary" : "")} />
            <span className="relative z-10 font-semibold text-sm">{label}</span>
            {activeTab === id && (
              <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary relative z-10" />
            )}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}
