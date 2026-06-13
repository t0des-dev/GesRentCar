"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SettingsTabsProps {
  tabs: any[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function SettingsTabs({ tabs, activeTab, setActiveTab }: SettingsTabsProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="lg:w-72 shrink-0 space-y-2">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          variants={item}
          onClick={() => setActiveTab(tab.id)}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm",
            activeTab === tab.id
              ? "bg-gradient-to-r from-gold to-gold/90 text-ink-1 shadow-lg shadow-gold/20"
              : "text-ink-2 bg-surface-1 border-2 border-border hover:text-gold"
          )}
        >
          <tab.icon size={18} strokeWidth={2.5} />
          {tab.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
