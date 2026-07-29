"use client";

import React, { type ComponentType } from "react";
import { motion, MotionValue } from "framer-motion";
import { Shield, Zap, Clock, Star, Compass, Mountain, Wind, HeadphonesIcon, ShieldCheck, Car, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import MagneticWrapper from "@/shared/ui/MagneticWrapper";
import type { SectionsContent } from "@/types/storefront";

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Shield, Zap, Clock, Star, Compass, Mountain, Wind,
  HeadphonesIcon, ShieldCheck, Car, LayoutDashboard, Settings, Users,
};

interface HeroBenefit {
  icon: string;
  text: string;
}

interface HeroContentProps {
  content: Partial<SectionsContent>;
  aboutText: string;
  stats: { value: string; label: string }[];
  y1: MotionValue<number>;
  mounted: boolean;
  t: (key: string) => string;
}

export default function HeroContent({ content, aboutText, stats, y1, mounted, t }: HeroContentProps) {
  const heroSection = content?.hero ?? content;
  const title = (heroSection && "title" in heroSection ? heroSection.title : undefined) || "Vectoria Premium Experience";
  const words = title.split(' ');
  const badge = (heroSection && "badge" in heroSection ? heroSection.badge : undefined) || "Location Premium";
  const benefits = (heroSection && "benefits" in heroSection ? heroSection.benefits : undefined) || [
    { icon: "Shield", text: "Assurance tout risque" },
    { icon: "Zap", text: "Livraison instantanée" },
    { icon: "Clock", text: "Support VIP 24/7" },
  ];

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon || Shield;
  };

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      className="lg:col-span-7 max-w-3xl"
    >
      {/* AR7 Eyebrow with gold line */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="section-eyebrow mb-6 text-gold"
      >
        {badge}
      </motion.div>

      {/* AR7 Hero Title — Sora font */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-[clamp(38px,4.8vw,58px)] font-bold text-white leading-[1.18] tracking-[-0.02em] mb-6 max-w-[560px]"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        {words.slice(0, -1).join(" ")}{" "}
        <span className="text-gold italic font-serif" style={{ fontStyle: "normal" }}>
          {words[words.length - 1]}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-[17.5px] text-white/80 leading-[1.6] max-w-[440px] mb-10"
      >
        {(heroSection && "subtitle" in heroSection ? heroSection.subtitle : undefined) || aboutText || t("hero_subtitle")}
      </motion.p>

      {/* Benefits & AR7 Trust Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-wrap items-center gap-6 mb-8"
      >
        <div className="flex flex-wrap gap-2.5">
          {benefits.map((item: HeroBenefit, i: number) => (
            <MagneticWrapper key={i}>
              <div
                className="flex items-center gap-2 px-3.5 py-2 bg-white/8 backdrop-blur border border-white/15 rounded-full hover:bg-white/12 hover:border-gold/40 transition-all duration-300 cursor-pointer"
              >
                {React.createElement(getIcon(item.icon), { size: 14, className: "text-gold" })}
                <span className="text-xs font-semibold text-white/90 tracking-wide">{item.text}</span>
              </div>
            </MagneticWrapper>
          ))}
        </div>

        {/* AR7 Trust Badge from home.html */}
        <div className="flex items-center gap-3.5 pl-6 border-l border-white/20">
          <div className="text-gold text-sm tracking-[2px]">★★★★★</div>
          <div className="text-xs text-white/75 leading-tight">
            <b className="text-white font-bold">4.9/5</b> — Plus de 2 500<br />clients satisfaits
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
