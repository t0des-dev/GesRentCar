"use client";

import Link from "next/link";
import { User, Crown, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";

interface UserActionsProps {
  session: any;
  signOut: () => void;
  t: (key: string) => string;
  isScrolled?: boolean;
}

export default function UserActions({ session, signOut, t, isScrolled }: UserActionsProps) {
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
    <div className="flex items-center gap-3">
      {session ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300",
              isScrolled
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                : "bg-white/10 hover:bg-white/20 text-white"
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden">
              <User size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold max-w-[80px] truncate">
              {session.user?.name?.split(' ')[0] || "Membre"}
            </span>
            <ChevronDown size={12} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[60]"
              >
                <div className="p-4 border-b border-slate-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Connecté</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">{session.user?.email}</p>
                </div>
                <div className="p-2">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
                    <LayoutDashboard size={16} className="text-primary" />
                    {t("nav_dashboard") || "Tableau de bord"}
                  </Link>
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 text-sm font-medium transition-colors">
                    <LogOut size={16} />
                    {t("nav_logout") || "Déconnexion"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-lg",
            isScrolled
              ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              : "text-white/80 hover:text-white hover:bg-white/10"
          )}
        >
          <Link href="/login">
            {t("nav_login")}
          </Link>
        </Button>
      )}

      <Button
        asChild
        variant={isScrolled ? "default" : "secondary"}
        className="rounded-xl"
      >
        <Link href="/booking">
          {t("nav_book")}
        </Link>
      </Button>
    </div>
  );
}
