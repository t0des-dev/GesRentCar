"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/shared/utils";
import {
  Users, Car, Clock, Phone, Star, Shield, Award, MapPin,
  TrendingUp, Heart, Zap, Globe, Crown, CheckCircle, Headphones
} from "lucide-react";
import type { ComponentType } from "react";

import type { StatsConfig, StatItem } from "@/types/storefront";

const ICON_MAP: Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Users, Car, Clock, Phone, Star, Shield, Award, MapPin,
  TrendingUp, Heart, Zap, Globe, Crown, CheckCircle, Headphones,
};

function AnimatedStatValue({
  value,
  isDark,
  textSizeClass,
  textColorStyle,
}: {
  value: string;
  isDark: boolean;
  textSizeClass?: string;
  textColorStyle?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const match = value.match(/([0-9,.]+)/);
    if (!match) return;

    const rawNumStr = match[1].replace(/,/g, "");
    const targetNum = parseFloat(rawNumStr);
    if (isNaN(targetNum)) return;

    const prefix = value.substring(0, match.index ?? 0);
    const suffix = value.substring((match.index ?? 0) + match[0].length);

    const duration = 1200;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.floor(easeProgress * targetNum);
      const formattedNum = currentNum.toLocaleString("en-US");

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, value]);

  return (
    <p
      ref={ref}
      className={cn(
        textSizeClass || "text-2xl md:text-3xl",
        "font-black tracking-tight leading-none transition-colors duration-300",
        !textColorStyle && (isDark ? "text-white group-hover:text-amber-400" : "text-slate-900 group-hover:text-amber-600")
      )}
      style={{
        fontFamily: "var(--font-sora), sans-serif",
        ...(textColorStyle ? { color: textColorStyle } : {}),
      }}
    >
      {displayValue}
    </p>
  );
}

const COLOR_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  indigo: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  primary: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
};

import { useTranslation } from "@/shared/hooks/useTranslation";

export default function StatsSection({ content }: { content: Partial<StatsConfig> }) {
  const { t } = useTranslation();
  const items = content?.items || [];
  const columns = parseInt(content?.columns || "4");
  const theme = content?.theme || "dark";
  const layoutStyle = content?.layout_style || "banner";
  const height = content?.height || "normal";
  const textSize = content?.text_size || "normal";
  const customTextColor = content?.text_color || "";

  const isDark = theme === "dark";

  const getStatLabel = (s: StatItem) => {
    switch (s.id) {
      case "s1": return t("stat_clients") || s.label;
      case "s2": return t("stat_fleet") || s.label;
      case "s3": return t("stat_exp") || s.label;
      case "s4": return t("stat_support") || s.label;
      default: {
        if (s.label === "Clients satisfaits" || s.label === "Clients") return t("stat_clients");
        if (s.label === "Véhicules premium" || s.label === "Véhicules") return t("stat_fleet");
        if (s.label === "Années d'expérience" || s.label === "Expérience") return t("stat_exp");
        if (s.label === "Support disponible" || s.label === "Support") return t("stat_support");
        return s.label;
      }
    }
  };

  const heightClass =
    height === "small" ? "py-6 md:py-8" :
    height === "large" ? "py-16 md:py-24" :
    "py-10 md:py-14";

  const textSizeClass =
    textSize === "small" ? "text-xl md:text-2xl" :
    textSize === "large" ? "text-3xl md:text-4xl" :
    textSize === "xl" ? "text-4xl md:text-5xl" :
    "text-2xl md:text-3xl";

  return (
    <section
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        heightClass,
        layoutStyle === "minimal"
          ? (isDark ? "bg-slate-900 border-y border-slate-800" : "bg-white border-y border-slate-100")
          : layoutStyle === "cards"
          ? (isDark ? "bg-slate-950 border-y border-slate-900" : "bg-slate-50 border-y border-slate-200")
          : isDark
          ? "bg-slate-950 border-y border-white/10"
          : "bg-surface-0 border-y border-surface-2"
      )}
    >
      {/* Background Texture Overlay */}
      {isDark && (
        <>
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={cn(
            "grid gap-4",
            layoutStyle === "cards"
              ? "grid-cols-2 md:grid-cols-4 gap-5"
              : columns === 2
              ? "grid-cols-2"
              : columns === 3
              ? "grid-cols-2 md:grid-cols-3"
              : "grid-cols-2 md:grid-cols-4"
          )}
        >
          {items.map((s: StatItem, idx: number) => {
            const IconComponent = s.icon ? ICON_MAP[s.icon] ?? null : null;
            const colorScheme = COLOR_STYLES[s.color || "amber"] || COLOR_STYLES.amber;

            if (layoutStyle === "cards") {
              return (
                <motion.div
                  key={s.id || s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:border-amber-500/40 hover:bg-white/[0.08] hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {IconComponent && (
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                      colorScheme.bg, colorScheme.border, colorScheme.text
                    )}>
                      <IconComponent size={20} strokeWidth={1.75} />
                    </div>
                  )}

                  <div>
                    <AnimatedStatValue
                      value={s.value}
                      isDark={isDark}
                      textSizeClass={textSizeClass}
                      textColorStyle={customTextColor}
                    />
                    <p className={cn(
                      "text-[12px] font-bold uppercase tracking-wider mt-1.5 transition-colors",
                      isDark ? "text-white/70 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900"
                    )}>
                      {getStatLabel(s)}
                    </p>
                    {s.description && (
                      <p className={cn(
                        "text-[10px] mt-1 leading-normal",
                        isDark ? "text-white/40" : "text-slate-400"
                      )}>
                        {s.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={s.id || s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={cn(
                  "group relative flex flex-col items-center text-center gap-3 py-8 px-4 transition-all duration-300",
                  layoutStyle === "minimal"
                    ? "border-r border-slate-100 last:border-r-0"
                    : isDark
                    ? "border-r border-white/[0.09] last:border-r-0 hover:bg-white/[0.02]"
                    : "border-r border-border last:border-r-0 hover:bg-slate-50"
                )}
              >
                {IconComponent && (
                  <div className={cn(
                    "w-[28px] h-[28px] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                    colorScheme.text
                  )}
                    style={customTextColor ? { color: customTextColor } : {}}
                  >
                    <IconComponent size={26} strokeWidth={1.5} />
                  </div>
                )}
                <div>
                  <AnimatedStatValue
                    value={s.value}
                    isDark={isDark}
                    textSizeClass={textSizeClass}
                    textColorStyle={customTextColor}
                  />
                  <p className={cn(
                    "text-[12px] font-semibold uppercase tracking-[0.02em] mt-1.5 transition-colors",
                    isDark ? "text-white/60 group-hover:text-white/90" : "text-slate-600 group-hover:text-slate-900"
                  )}>
                    {getStatLabel(s)}
                  </p>
                  {s.description && (
                    <p className={cn(
                      "text-[10px] mt-1 leading-tight transition-colors",
                      isDark ? "text-white/40" : "text-slate-400"
                    )}>
                      {s.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
