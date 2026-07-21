"use client";

import { motion, MotionValue } from "framer-motion";
import { Star } from "lucide-react";
import type { SectionsContent } from "@/types/storefront";

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
  const subtitle = (heroSection && "subtitle" in heroSection ? heroSection.subtitle : undefined) || "A modern fleet, transparent pricing, and airport-ready delivery — built for business travel, family trips, and everything in between.";
  const badge = (heroSection && "badge" in heroSection ? heroSection.badge : undefined) || "— PREMIUM CAR RENTAL • MOROCCO";

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      className="lg:col-span-7 max-w-[640px]"
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xs font-black uppercase tracking-[0.2em] text-[#d4b068] mb-4 flex items-center gap-2"
      >
        <span>{badge}</span>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold text-white leading-[1.12] mb-6 tracking-tight font-[var(--font-sora)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Drive Morocco with <span className="text-[#d4b068]">confidence,</span> not compromise.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-slate-200 text-base md:text-[17px] leading-relaxed max-w-xl mb-8 font-normal"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {subtitle}
      </motion.p>

      {/* CTA + Trust Rating Row */}
      <motion.div
        className="flex flex-wrap items-center gap-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <a 
          href="/fleet" 
          className="bg-[#c69c46] hover:bg-[#b88d38] text-slate-950 px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:scale-[1.02]"
        >
          Browse the fleet
        </a>
        <div className="flex items-center gap-2 text-white text-xs font-semibold">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={13} className="text-[#d4b068] fill-[#d4b068]" />
            ))}
          </div>
          <span><strong>4.9 / 5</strong> on Google · 2,300+ rentals</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

