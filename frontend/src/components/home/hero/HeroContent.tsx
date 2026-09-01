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
  const { lang } = useTranslation();
  const heroSection = content?.hero ?? content;

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
        className="section-eyebrow mb-7 text-gold font-semibold text-[12.5px] tracking-[0.16em] uppercase flex items-center gap-2.5"
      >
        {(heroSection as any)?.eyebrow || (lang === "fr" ? "LOCATION PREMIUM · MAROC" : "PREMIUM CAR RENTAL · MOROCCO")}
      </motion.div>

      {/* Hero Headline — Sora font exact from screenshot */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-[clamp(38px,4.8vw,58px)] font-bold text-white leading-[1.18] tracking-[-0.02em] mb-6 max-w-[560px]"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        {(heroSection as any)?.title && (heroSection as any).title !== "Vectoria Premium Experience" ? (
          (heroSection as any).title
        ) : lang === "fr" ? (
          <>
            Parcourez le Maroc<br />
            avec <span className="text-gold">confiance,</span><br />
            sans compromis.
          </>
        ) : (
          <>
            Drive Morocco<br />
            with <span className="text-gold">confidence,</span><br />
            not compromise.
          </>
        )}
      </motion.h1>

      {/* Hero Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-[17.5px] text-white/80 leading-[1.6] max-w-[460px] mb-10"
      >
        {(heroSection && "subtitle" in heroSection && heroSection.subtitle !== "L'excellence automobile au Maroc" ? heroSection.subtitle : undefined) ||
          aboutText ||
          (lang === "fr"
            ? "Une flotte moderne, des tarifs transparents et une livraison immédiate à l'aéroport — pensée pour vos déplacements professionnels et vos voyages."
            : "A modern fleet, transparent pricing, and airport-ready delivery — built for business travel, family trips, and everything in between.")}
      </motion.p>

      {/* CTA Button + Rating Badge Row (exact from screenshot) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-wrap items-center gap-6"
      >
        <a
          href="/fleet"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gold text-navy font-semibold text-[15px] hover:translate-y-[-2px] transition-all shadow-[0_14px_30px_-12px_rgba(194,161,91,0.4)]"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          {(heroSection as any)?.cta_text || (lang === "fr" ? "Découvrir la flotte" : "Browse the fleet")}
        </a>

        {/* Rating Badge from Screenshot */}
        <div className="flex items-center gap-3">
          <div className="text-gold text-sm tracking-[2px]">★★★★★</div>
          <div className="text-xs text-white/75 font-medium">
            <b className="text-white font-bold">4.9 / 5</b> {lang === "fr" ? "sur Google · 2 300+ locations" : "on Google · 2,300+ rentals"}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
