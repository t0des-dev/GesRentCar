"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/utils";
import {
  Users, Car, Clock, Phone, Star, Shield, Award, MapPin,
  TrendingUp, Heart, Zap, Globe, Crown, CheckCircle, Headphones,
  ArrowRight
} from "lucide-react";
import type { ComponentType } from "react";
import type { ServicesConfig, ServiceItem } from "@/types/storefront";
import { useTranslation } from "@/shared/hooks/useTranslation";

const ICON_MAP: Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Users, Car, Clock, Phone, Star, Shield, Award, MapPin,
  TrendingUp, Heart, Zap, Globe, Crown, CheckCircle, Headphones,
};

const COLOR_STYLES: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "hover:border-amber-500/40 hover:shadow-amber-500/10" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "hover:border-emerald-500/40 hover:shadow-emerald-500/10" },
  indigo: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", glow: "hover:border-indigo-500/40 hover:shadow-indigo-500/10" },
  rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "hover:border-rose-500/40 hover:shadow-rose-500/10" },
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "hover:border-blue-500/40 hover:shadow-blue-500/10" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "hover:border-purple-500/40 hover:shadow-purple-500/10" },
  primary: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "hover:border-amber-500/40 hover:shadow-amber-500/10" },
};

export default function ServicesSection({ content }: { content: Partial<ServicesConfig> }) {
  const { t } = useTranslation();
  const eyebrow = content?.eyebrow || "NOS SERVICES VIP";
  const title = content?.title || "Des services sur-mesure pour votre confort";
  const subtitle = content?.subtitle || "Que ce soit pour un transfert aéroport, une location avec chauffeur ou une prise en charge sur-mesure, nous répondons à toutes vos exigences.";
  const items = content?.items || [];
  const columns = parseInt(content?.columns || "3");
  const theme = content?.theme || "dark";
  const layoutStyle = content?.layout_style || "cards";

  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        "py-24 relative overflow-hidden transition-all duration-300",
        layoutStyle === "minimal"
          ? (isDark ? "bg-slate-950 border-y border-slate-900" : "bg-white border-y border-slate-100")
          : layoutStyle === "banner"
          ? (isDark ? "bg-slate-950 border-y border-white/10" : "bg-slate-900 text-white")
          : isDark
          ? "bg-slate-950 border-y border-white/10"
          : "bg-surface-0 border-y border-surface-2"
      )}
    >
      {/* Background Ambient Effect */}
      {isDark && (
        <>
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />
        </>
      )}

      <div className="container mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-black tracking-widest uppercase"
            >
              <Crown size={13} />
              {eyebrow}
            </motion.div>
          )}

          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className={cn(
                "text-3xl md:text-5xl font-black tracking-tight leading-[1.15]",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              {title}
            </motion.h2>
          )}

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className={cn(
                "text-sm md:text-base leading-relaxed font-medium",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Services Grid */}
        <div
          className={cn(
            "grid gap-6",
            columns === 2 ? "grid-cols-1 md:grid-cols-2" :
            columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
            "grid-cols-1 md:grid-cols-3"
          )}
        >
          {items.map((srv: ServiceItem, idx: number) => {
            const IconComponent = srv.icon ? ICON_MAP[srv.icon] ?? null : null;
            const colorScheme = COLOR_STYLES[srv.color || "amber"] || COLOR_STYLES.amber;

            if (layoutStyle === "minimal") {
              return (
                <motion.div
                  key={srv.id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                  className="group flex gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-slate-500/5 cursor-pointer"
                >
                  {IconComponent && (
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      colorScheme.bg, colorScheme.border, colorScheme.text
                    )}>
                      <IconComponent size={22} strokeWidth={1.75} />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={cn("font-extrabold text-base tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                        {srv.title}
                      </h3>
                      {srv.badge && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                          colorScheme.bg, colorScheme.border, colorScheme.text
                        )}>
                          {srv.badge}
                        </span>
                      )}
                    </div>
                    <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                      {srv.description}
                    </p>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={srv.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
                className={cn(
                  "group relative p-7 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer",
                  isDark
                    ? "bg-white/5 border-white/10 shadow-2xl hover:bg-white/[0.08]"
                    : "bg-white border-slate-200/80 shadow-lg hover:shadow-xl hover:border-slate-300",
                  colorScheme.glow
                )}
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    {IconComponent && (
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md",
                        colorScheme.bg, colorScheme.border, colorScheme.text
                      )}>
                        <IconComponent size={22} strokeWidth={1.75} />
                      </div>
                    )}

                    {srv.badge && (
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm",
                        colorScheme.bg, colorScheme.border, colorScheme.text
                      )}>
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={cn(
                      "text-lg font-black tracking-tight mb-2 group-hover:text-amber-400 transition-colors",
                      isDark ? "text-white" : "text-slate-900"
                    )}>
                      {srv.title}
                    </h3>
                    <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span>{t("services_learn_more")}</span>
                  <ArrowRight size={13} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
