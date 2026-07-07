"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/utils";
import * as Icons from "lucide-react";
import type { ComponentType } from "react";

import type { StatsConfig, StatItem } from "@/types/storefront";

export default function StatsSection({ content }: { content: Partial<StatsConfig> }) {
  const items = content?.items || [];
  const columns = parseInt(content?.columns || "4");
  const theme = content?.theme || "dark";

  const isDark = theme === "dark";

  return (
    <section className={cn(
      "py-14 border-y relative overflow-hidden",
      isDark ? "bg-ink-1 border-ink-2/50" : "bg-surface-0 border-surface-2"
    )}>
      {isDark && (
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className={cn(
          "grid gap-8 md:gap-4",
          columns === 2 ? "grid-cols-2" :
          columns === 3 ? "grid-cols-2 md:grid-cols-3" :
          "grid-cols-2 md:grid-cols-4"
        )}>
          {items.map((s: StatItem, idx: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = s.icon && (Icons as any)[s.icon] ? (Icons as any)[s.icon] : null;

            return (
              <motion.div
                key={s.id || s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 group"
              >
                {IconComponent && (
                  <div className={cn(
                    "shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300",
                    isDark
                      ? "bg-gold/15 text-gold group-hover:bg-gold/25"
                      : "bg-primary/10 text-primary group-hover:bg-primary/20"
                  )}>
                    <IconComponent size={20} strokeWidth={2} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className={cn(
                    "text-2xl md:text-3xl font-black tracking-tight leading-none",
                    isDark ? "text-white" : "text-ink-1"
                  )}>
                    {s.value}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50 mt-1 truncate">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
