"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { Shield, Zap, Clock, Star, Compass, Mountain, Wind, HeadphonesIcon, ShieldCheck, Car, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import MagneticWrapper from "@/components/ui/MagneticWrapper";

const ICON_MAP: Record<string, any> = {
  Shield, Zap, Clock, Star, Compass, Mountain, Wind,
  HeadphonesIcon, ShieldCheck, Car, LayoutDashboard, Settings, Users,
};

interface HeroContentProps {
  content: any;
  aboutText: string;
  stats: any[];
  y1: MotionValue<number>;
  mounted: boolean;
  t: (key: string) => string;
}

export default function HeroContent({ content, aboutText, stats, y1, mounted, t }: HeroContentProps) {
  const heroSection = content?.hero || content;
  const title = heroSection?.title || "Vectoria Premium Experience";
  const words = title.split(' ');
  const badge = heroSection?.badge || "Location Premium";
  const benefits = heroSection?.benefits || [
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
          {words.slice(0, -1).map((word, i) => (
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
        {heroSection?.subtitle || aboutText || t("hero_subtitle")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        {benefits.map((item: any, i: number) => (
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
      </motion.div>
    </motion.div>
  );
}
