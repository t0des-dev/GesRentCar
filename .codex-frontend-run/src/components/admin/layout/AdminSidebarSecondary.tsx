"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarSecondaryProps {
  activeGroup: any;
  pathname: string;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  user: any;
}

export default function AdminSidebarSecondary({ activeGroup, pathname, isCollapsed, setIsCollapsed, user }: AdminSidebarSecondaryProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 0 : 280, opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
      className="bg-white border-r-2 border-border flex flex-col relative z-10 overflow-hidden"
    >
      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-10 w-7 h-7 bg-white border-2 border-border rounded-full flex items-center justify-center text-ink-2 hover:text-gold hover:border-gold transition-all z-30 shadow-md"
      >
        {isCollapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
      </motion.button>

      {/* Header */}
      <div className="px-8 pt-10 pb-4 min-w-[280px]">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">Navigation</p>
        <h2 className="text-xl font-bold text-ink-1 tracking-tight font-serif">{activeGroup.title}</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-1.5 min-w-[280px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeGroup.id} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }} 
            transition={{ duration: 0.15 }} 
            className="space-y-1.5"
          >
            {activeGroup.items.map((item: any) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href} href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200 border-2",
                    isActive
                      ? "bg-gold/10 border-gold/40 text-gold"
                      : "text-ink-2 hover:bg-gold/5 hover:text-gold border-transparent hover:border-gold/20"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all border-2",
                    isActive 
                      ? "bg-gold/20 border-gold/40 text-gold" 
                      : "bg-surface-1 border-border text-ink-3"
                  )}>
                    <item.icon size={14} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-bold">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-gold" strokeWidth={2} />}
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* User Footer */}
      <div className="p-5 mt-auto min-w-[280px] border-t-2 border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/40 flex items-center justify-center text-sm font-bold text-gold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink-1 truncate">{user?.name || "Administrateur"}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}