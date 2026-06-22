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
  const height = content?.height || "normal";
  const textSize = content?.text_size || "normal";
  const textColor = content?.text_color || "";

  const isDark = theme === "dark";
  const heightClass = height === "small" ? "py-12" : height === "large" ? "py-32" : "py-24";
  const sizeClass = 
    textSize === "small" ? "text-3xl md:text-4xl" :
    textSize === "large" ? "text-7xl md:text-8xl" :
    textSize === "xl" ? "text-8xl md:text-9xl" :
    "text-5xl md:text-6xl";

  return (
    <section className={cn(
      heightClass, "border-y relative overflow-hidden",
      isDark ? "bg-slate-950 border-slate-800/50" : "bg-white border-slate-100"
    )}>
      {isDark && (
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      )}
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={cn(
          "grid gap-12 md:gap-8",
          columns === 2 ? "grid-cols-2" : 
          columns === 3 ? "grid-cols-2 md:grid-cols-3" : 
          "grid-cols-2 md:grid-cols-4"
        )}>
          {items.map((s: StatItem, idx: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = s.icon && (Icons as any)[s.icon] ? (Icons as any)[s.icon] : null;
            const colorClass = isDark ? "text-primary-400" : "text-primary-600";
            
            return (
              <motion.div
                key={s.id || s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                {IconComponent && (
                  <div className={cn(
                    "mb-4 p-3 rounded-2xl transition-all duration-300",
                    isDark ? "bg-slate-900 group-hover:bg-slate-800" : "bg-slate-50 group-hover:bg-slate-100"
                  )}>
                    <IconComponent className={colorClass} size={24} />
                  </div>
                )}
                <p 
                  className={cn(
                    sizeClass, "font-bold mb-2 tracking-tight transition-colors duration-300",
                    isDark ? "text-white group-hover:text-primary-100" : "text-slate-900 group-hover:text-primary-900"
                  )}
                  style={{ color: textColor || undefined }}
                >
                  {s.value}
                </p>
                <p className={cn(
                  "text-[10px] md:text-xs font-semibold uppercase tracking-wider",
                  isDark ? "text-slate-500" : "text-slate-500"
                )}>
                  {s.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
