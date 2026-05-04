"use client";

import { Car, TrendingUp, FileCheck, LayoutDashboard } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { label: "Gérer le Parc", icon: Car, desc: "Inventaire & Dispo" },
    { label: "Contrats PDF", icon: FileCheck, desc: "Historique Signature" },
    { label: "Performance", icon: TrendingUp, desc: "Analyses de l'Agence" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
         <LayoutDashboard size={14} className="text-primary" />
         Raccourcis VIP
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, i) => (
          <button 
            key={i} 
            className="w-full p-6 bg-white border border-slate-100 rounded-[32px] text-left hover:shadow-xl hover:shadow-slate-200/40 transition-all group flex items-center gap-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
              <action.icon size={20} />
            </div>
            <div>
              <p className="font-black text-slate-900 text-xs uppercase tracking-widest mb-1">{action.label}</p>
              <p className="text-[10px] text-slate-400 font-bold">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
