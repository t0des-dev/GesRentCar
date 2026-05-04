"use client";

import { cn } from "@/lib/utils";

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
    <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start border-b border-white/5 pb-8">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={cn(
            "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
            activeTab === tab.key
              ? "bg-primary text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] scale-105"
              : "text-slate-500 hover:text-white hover:bg-white/5"
          )}
        >
          {tab.label}
          {tab.key !== "all" && (
            <span className={cn("ml-3 px-2 py-0.5 rounded-md text-[8px]", activeTab === tab.key ? "bg-white/20" : "bg-white/5")}>
              {reservations.filter(r => r.status === tab.key).length}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
