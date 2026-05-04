"use client";

import Link from "next/link";
import { User, Crown, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UserActionsProps {
  session: any;
  signOut: () => void;
  t: (key: string) => string;
  textColor: string;
  hoverColor: string;
}

export default function UserActions({ session, signOut, t, textColor, hoverColor }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-5">
      {session ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full transition-all duration-300 border",
              isOpen 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/25" 
                : cn("border-border/50 bg-background/50 hover:bg-background shadow-sm", textColor)
            )}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
               {session.user?.image ? (
                 <img src={session.user.image} alt="" className="w-full h-full object-cover" />
               ) : (
                 <User size={16} className={isOpen ? "text-white" : "text-primary"} />
               )}
            </div>
            <div className="flex flex-col items-start">
               <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                 {session.user?.role || "Membre"}
               </span>
               <span className="text-xs font-black truncate max-w-[100px]">
                 {session.user?.name?.split(' ')[0]}
               </span>
            </div>
            <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 glass-card border border-border/50 shadow-2xl overflow-hidden z-[60]"
              >
                <div className="p-4 border-b border-border/50 bg-muted/20">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Connecté en tant que</p>
                  <p className="text-sm font-black text-foreground truncate">{session.user?.email}</p>
                </div>
                
                <div className="p-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <LayoutDashboard size={16} className="text-primary" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{t("nav_dashboard") || "Tableau de bord"}</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 text-foreground transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Settings size={16} className="text-slate-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Paramètres</span>
                  </Link>

                  <div className="my-2 border-t border-border/50 mx-2" />

                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-600 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                      <LogOut size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{t("nav_logout") || "Déconnexion"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link
          href="/login"
          className={cn("text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 group", textColor)}
        >
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <User size={16} className="group-hover:text-primary transition-colors" />
          </div>
          {t("nav_login")}
        </Link>
      )}

      <Link
        href="/booking"
        className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
      >
        <Crown size={16} className="text-secondary animate-pulse" />
        {t("nav_book")}
      </Link>
    </div>
  );
}

