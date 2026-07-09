"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";
import { cn } from "@/shared/utils";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[9998] h-12",
            "bg-gradient-to-r from-red-500 to-orange-500",
            "flex items-center justify-center gap-2",
            "text-white text-xs font-bold uppercase tracking-wider",
            "shadow-lg shadow-red-500/30"
          )}
        >
          <WifiOff size={16} strokeWidth={2.5} />
          <span>Vous êtes hors ligne</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
