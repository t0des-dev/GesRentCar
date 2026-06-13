"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarPrimaryProps {
  groups: any[];
  activeGroupId: string | null;
  onGroupClick: (id: string) => void;
  onLogout: () => void;
}

export default function AdminSidebarPrimary({ groups, activeGroupId, onGroupClick, onLogout }: AdminSidebarPrimaryProps) {
  return (
    <aside className="w-[72px] bg-surface-0 flex flex-col items-center py-6 gap-6 border-r border-border">
      <Link href="/admin" className="mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center shadow-lg shadow-gold/40">
          <span className="text-lg font-bold text-ink-1 italic">V</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-3">
        {groups.map((group) => {
          const isActive = activeGroupId === group.id;
          return (
            <motion.button
              key={group.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGroupClick(group.id)}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group",
                isActive 
                  ? "bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/40 text-gold shadow-md shadow-gold/20" 
                  : "text-ink-3 hover:text-gold hover:bg-gold/5 border-2 border-transparent"
              )}
            >
              <group.icon size={18} strokeWidth={2} />
              {group.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-500/90 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-surface-0 shadow-md">
                  {group.badge}
                </span>
              )}
              <div className="absolute left-14 bg-ink-1 text-ink-3 text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 uppercase tracking-wider border border-gold/40">
                {group.title}
              </div>
              {isActive && (
                <motion.div 
                  layoutId="primaryActive"
                  className="absolute -left-[5px] w-1 h-6 bg-gold rounded-r-full"
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button 
        whileHover={{ scale: 1.1, color: "#ef4444" }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout} 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-ink-3 hover:text-red-400 hover:bg-red-500/10 border-2 border-transparent hover:border-red-400/40 transition-all"
      >
        <LogOut size={18} strokeWidth={2} />
      </motion.button>
    </aside>
  );
}