"use client";

import { motion } from "framer-motion";
import { Car, TrendingUp, FileCheck, LayoutDashboard } from "lucide-react";
import { cn } from "@/shared/utils";

export default function QuickActions() {
  const actions = [
    { label: "Gérer le Parc", icon: Car, desc: "Inventaire & Dispo" },
    { label: "Contrats PDF", icon: FileCheck, desc: "Historique Signature" },
    { label: "Performance", icon: TrendingUp, desc: "Analyses de l'Agence" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-ink-1 flex items-center gap-2">
         <LayoutDashboard size={14} className="text-primary" />
         Raccourcis
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, i) => (
          <motion.button 
            key={i} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-5 bg-surface-0 border-2 border-border rounded-2xl text-left hover:shadow-sm transition-all group flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-1 flex items-center justify-center text-ink-3 group-hover:bg-primary group-hover:text-white transition-all">
              <action.icon size={18} />
            </div>
            <div>
              <p className="font-bold text-ink-1 text-xs uppercase tracking-wider">{action.label}</p>
              <p className="text-xs font-medium text-ink-3">{action.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
