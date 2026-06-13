"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

interface AdminTopbarProps {
  pathname: string;
  activeGroupTitle: string;
  user: any;
}

export default function AdminTopbar({ pathname, activeGroupTitle, user }: AdminTopbarProps) {
  const currentPathLabel = pathname.split("/").pop() || "dashboard";

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-16 bg-white/90 backdrop-blur-xl border-b-2 border-border flex items-center justify-between px-8 shrink-0"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-ink-3">
        <span className="text-ink-2">Admin</span>
        <span className="text-ink-3">/</span>
        <span className="text-ink-1">{activeGroupTitle}</span>
        <span className="text-ink-3">/</span>
        <span className="text-gold">{currentPathLabel}</span>
      </div>

      {/* User Area */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-surface-1 rounded-xl px-3 py-2 border-2 border-border">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-lg bg-white border-2 border-border flex items-center justify-center text-ink-2 hover:text-gold hover:border-gold transition-all relative"
          >
            <Bell size={16} strokeWidth={2} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border-2 border-white" />
          </motion.button>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2.5 pr-1">
            <div className="text-right">
              <p className="text-sm font-bold text-ink-1 leading-tight">{user?.name || "Admin"}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">En ligne</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/40 flex items-center justify-center text-sm font-bold text-gold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}