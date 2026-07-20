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
  const title = (heroSection && "title" in heroSection ? heroSection.title : undefined) || "Vectoria Premium Experience";
  const words = title.split(' ');
  const subtitle = (heroSection && "subtitle" in heroSection ? heroSection.subtitle : undefined) || aboutText || t("hero_subtitle");
  const badge = (heroSection && "badge" in heroSection ? heroSection.badge : undefined) || "Premium Car Rental · Morocco";

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      className="lg:col-span-7 max-w-[640px]"
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="hero-eyebrow"
      >
        {badge}
      </motion.p>

      {/* Heading */}
      <motion.h1
        className="hero-h1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {words.slice(0, -1).join(' ')}{' '}
        <em>{words[words.length - 1]}</em>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="hero-sub"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {subtitle}
      </motion.p>

      {/* CTA + Trust */}
      <motion.div
        className="hero-cta-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <a href="/fleet" className="btn-hero-primary">
          Browse the fleet
        </a>
        <div className="hero-trust">
          <div className="hero-trust-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} className="text-gold fill-gold" />
            ))}
          </div>
          <p className="hero-trust-text">
            <strong>4.9 / 5</strong> on Google · 2,300+ rentals
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
