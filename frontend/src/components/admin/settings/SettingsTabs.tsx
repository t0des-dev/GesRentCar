"use client";

import { cn } from "@/lib/utils";

interface SettingsTabsProps {
  tabs: any[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export default function SettingsTabs({ tabs, activeTab, setActiveTab }: SettingsTabsProps) {
  return (
    <div className="lg:w-72 shrink-0 space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm",
            activeTab === tab.id 
              ? "bg-primary text-white shadow-lg shadow-primary/25" 
              : "text-slate-500 hover:bg-white hover:text-primary border border-transparent hover:border-slate-200"
          )}
        >
          <tab.icon size={18} strokeWidth={2.5} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
