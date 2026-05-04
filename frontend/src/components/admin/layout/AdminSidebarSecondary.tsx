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
      animate={{ width: isCollapsed ? 0 : 288, opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
      className="bg-white border-r border-slate-200/60 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.02)] relative z-10 overflow-hidden"
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:scale-110 transition-all z-30 shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
      </button>

      <div className="px-8 pt-12 pb-6 min-w-[288px]">
        <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Navigation</h2>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">{activeGroup.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-2 min-w-[288px]">
        <AnimatePresence mode="wait">
          <motion.div key={activeGroup.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-1.5">
            {activeGroup.items.map((item: any) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href} href={item.href}
                  className={cn("group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300", isActive ? "bg-primary/5 text-primary border border-primary/10 shadow-sm" : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-900")}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-slate-100 group-hover:border-slate-300 text-slate-400 group-hover:text-primary")}>
                    <item.icon size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-40" strokeWidth={3} />}
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 mt-auto min-w-[288px]">
        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
           <img className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=6366f1&color=fff`} alt="Admin" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate leading-none mb-1">{user?.name || "Administrateur"}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{user?.role || "Admin"}</p>
            </div>
        </div>
      </div>
    </motion.aside>
  );
}
