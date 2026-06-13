"use client";

import { motion } from "framer-motion";

export default function StatsSection({ stats }: { stats: any[] }) {
  return (
    <section className="py-24 bg-slate-950 border-y border-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                {s.value}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
