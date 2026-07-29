"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/utils";
import {
  Users, Car, Clock, Phone, Star, Shield, Award, MapPin,
  TrendingUp, Heart, Zap, Globe, Crown, CheckCircle, Headphones
} from "lucide-react";
import type { ComponentType } from "react";

import type { StatsConfig, StatItem } from "@/types/storefront";

const ICON_MAP: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Users, Car, Clock, Phone, Star, Shield, Award, MapPin,
  TrendingUp, Heart, Zap, Globe, Crown, CheckCircle, Headphones,
};

export default function StatsSection({ content }: { content: Partial<StatsConfig> }) {
  const items = content?.items || [];
  const columns = parseInt(content?.columns || "4");
  const theme = content?.theme || "dark";

  const isDark = theme === "dark";

  return (
    <section className={cn(
      "py-14 border-y relative overflow-hidden",
      isDark ? "bg-ink-1 border-ink-2/30" : "bg-surface-0 border-surface-2"
    )}>
      {isDark && (
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className={cn(
          "grid gap-0",
          columns === 2 ? "grid-cols-2" :
          columns === 3 ? "grid-cols-2 md:grid-cols-3" :
          "grid-cols-2 md:grid-cols-4"
        )}>
          {items.map((s: StatItem, idx: number) => {
            const IconComponent = s.icon ? ICON_MAP[s.icon] ?? null : null;

            return (
              <motion.div
                key={s.id || s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={cn(
                  "flex flex-col items-center text-center gap-3.5 py-11 px-4",
                  isDark
                    ? "border-r border-white/[0.09] last:border-r-0"
                    : "border-r border-border last:border-r-0"
                )}
              >
                {IconComponent && (
                  <div className={cn(
                    "w-[26px] h-[26px] flex items-center justify-center",
                    isDark ? "text-ink-1" : "text-primary"
                  )}
                    style={isDark ? { color: "hsl(var(--ink-1))" } : {}}
                  >
                    <IconComponent size={26} strokeWidth={1.4} />
                  </div>
                )}
                <div>
                  <p className={cn(
                    "text-2xl md:text-3xl font-black tracking-tight leading-none",
                    isDark ? "text-white" : "text-ink-1"
                  )}
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    {s.value}
                  </p>
                  <p className={cn(
                    "text-[12.5px] font-semibold uppercase tracking-[0.01em] mt-1.5",
                    isDark ? "text-white/55" : "text-ink-3"
                  )}>
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
