"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function LiveAvailability() {
  const [count, setCount] = useState(12);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next < 5 ? 5 : next > 20 ? 20 : next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full"
    >
      <div className="relative">
        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
        <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
        <span className="text-emerald-400">{count}</span> Véhicules disponibles en temps réel
      </span>
    </motion.div>
  );
}
