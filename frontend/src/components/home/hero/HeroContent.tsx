"use client";

import React, { useState, useEffect, type ComponentType } from "react";
import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { Shield, Zap, Clock, Star, Compass, Mountain, Wind, HeadphonesIcon, ShieldCheck, Car, LayoutDashboard, Settings, Users, Quote } from "lucide-react";
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

const SOCIAL_PROOF_ITEMS = [
  { value: "2000+", label: "Clients satisfaits" },
  { value: "4.8/5", label: "Google" },
  { value: "30min", label: "Livraison express" },
];

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

  const [activeBenefit, setActiveBenefit] = useState(0);

  // Auto-cycle benefits on mobile only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 1024;
    if (!isMobile || benefits.length <= 1) return;

    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [benefits.length]);

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon || Shield;
  };

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      className="lg:col-span-7 max-w-3xl"
    >
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="section-eyebrow mb-6"
      >
        {badge}
      </motion.div>

      <motion.h1
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
        }}
        initial="hidden"
        animate="show"
        className="display-title leading-[1.08] mb-8"
      >
        <div className="block text-white overflow-hidden">
          {words.slice(0, -1).map((word: string, i: number) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
              className="inline-block mr-3 lg:mr-4"
            >
              {word}
            </motion.span>
          ))}
        </div>
        <div className="block overflow-hidden mt-2 pb-2">
          <motion.span
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
            className="inline-block bg-gradient-to-r from-gold via-gold to-gold/60 bg-clip-text text-transparent"
          >
            {words[words.length - 1]}
          </motion.span>
        </div>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="body-feature text-white/85 max-w-2xl mb-10 leading-relaxed"
      >
        {(heroSection && "subtitle" in heroSection ? heroSection.subtitle : undefined) || aboutText || t("hero_subtitle")}
      </motion.p>

      {/* Benefits — Desktop: all visible, Mobile: auto-cycle single */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mb-12"
      >
        {/* Desktop: all benefits */}
        <div className="hidden lg:flex flex-wrap gap-3">
          {benefits.map((item: HeroBenefit, i: number) => (
            <MagneticWrapper key={i}>
              <div
                data-cursor="Détails"
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white/8 backdrop-blur border border-white/15 rounded-full hover:bg-white/12 hover:border-gold/30 transition-all duration-300 cursor-pointer"
              >
                {React.createElement(getIcon(item.icon), { size: 16, className: "text-gold" })}
                <span className="text-sm font-semibold text-white/90 tracking-wide">{item.text}</span>
              </div>
            </MagneticWrapper>
          ))}
        </div>

        {/* Mobile: single benefit with auto-cycle */}
        <div className="lg:hidden relative h-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBenefit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white/8 backdrop-blur border border-white/15 rounded-full">
                {React.createElement(getIcon(benefits[activeBenefit].icon), { size: 16, className: "text-gold" })}
                <span className="text-sm font-semibold text-white/90 tracking-wide">{benefits[activeBenefit].text}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          {benefits.length > 1 && (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {benefits.map((_: HeroBenefit, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveBenefit(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === activeBenefit ? "bg-gold w-4" : "bg-white/30"
                  }`}
                  aria-label={`Benefit ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Social Proof Strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex flex-wrap items-center gap-6 lg:gap-8 mt-14"
      >
        {SOCIAL_PROOF_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xl lg:text-2xl font-black text-gold">{item.value}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 leading-tight">{item.label}</span>
          </div>
        ))}
        <div className="hidden lg:flex items-center gap-1 ml-auto">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} className={star <= 5 ? "text-gold fill-gold" : "text-white/20"} />
          ))}
          <span className="text-xs font-semibold text-white/60 ml-1">4.8</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
