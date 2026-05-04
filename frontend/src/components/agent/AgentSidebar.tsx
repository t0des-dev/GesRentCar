"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, PlusCircle, ClipboardList, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-2 bg-white/50 backdrop-blur-xl p-4 rounded-[32px] border border-white/20 shadow-xl shadow-slate-200/50 h-fit sticky top-36">
      <div className="px-4 py-3 mb-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Menu Agent</p>
      </div>
      <nav className="flex flex-col gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
              activeTab === id 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                : "text-slate-500 hover:bg-white hover:text-slate-900"
            )}
          >
            {activeTab === id && (
              <motion.div 
                layoutId="activeTabBg"
                className="absolute inset-0 bg-slate-900 z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={20} className={cn("relative z-10 transition-transform group-hover:scale-110", activeTab === id ? "text-primary" : "")} />
            <span className="relative z-10 font-bold text-sm tracking-tight">{label}</span>
            {activeTab === id && (
              <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary relative z-10" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
