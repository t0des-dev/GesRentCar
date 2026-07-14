"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { cn } from "@/shared/utils";
import { useNotifications } from "@/shared/hooks/useApi";

export default function NotificationBell() {
  const { data, isLoading } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications: Array<{ id: number | string; title: string; message: string; read?: boolean; created_at?: string }> =
    data?.notifications ?? data ?? [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-surface-1 border-2 border-border hover:border-gold hover:bg-gold/5 text-ink-2 hover:text-gold transition-all"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5 shadow-lg shadow-red-500/40">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border-2 border-border bg-surface-0 shadow-2xl z-50"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border">
              <h3 className="text-sm font-bold text-ink-1 uppercase tracking-wider">Notifications</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-1 text-ink-3 hover:text-ink-1 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {isLoading ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto mb-3 text-ink-3/30" />
                <p className="text-sm text-ink-3">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "px-5 py-4 hover:bg-surface-1/50 transition-colors",
                      !n.read && "bg-gold/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-1">{n.title}</p>
                        <p className="text-xs text-ink-3 mt-0.5 line-clamp-2">{n.message}</p>
                        {n.created_at && (
                          <p className="text-[10px] text-ink-3/60 mt-1">{n.created_at}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
