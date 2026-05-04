"use client";

import { motion } from "framer-motion";

interface StatsSectionProps {
  stats: any[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="bg-primary py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x divide-white/10">
          {stats.map((s, idx) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center text-primary-foreground px-4"
            >
              <p className="text-5xl md:text-6xl font-black mb-3 tracking-tighter">{s.value}</p>
              <p className="text-xs text-white/60 font-black uppercase tracking-[0.3em]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
