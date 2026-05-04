"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatsSectionProps {
  stats: any[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="bg-slate-950 py-32 relative overflow-hidden border-y border-white/5">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-8 divide-x divide-white/5">
          {stats.map((s, idx) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="text-center px-8 group"
            >
              <div className="relative inline-block">
                <p className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter transition-transform group-hover:scale-105 duration-500">
                  {s.value}
                </p>
                {/* Subtle Glow beneath the number */}
                <div className="absolute -inset-2 bg-primary/0 group-hover:bg-primary/5 blur-xl transition-colors duration-500 rounded-full" />
              </div>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] opacity-80 group-hover:opacity-100 transition-opacity">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
