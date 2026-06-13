"use client";

import { motion, MotionValue } from "framer-motion";
import { Shield, Zap, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface HeroContentProps {
  content: any;
  aboutText: string;
  stats: any[];
  y1: MotionValue<number>;
  mounted: boolean;
  t: (key: string) => string;
}

export default function HeroContent({ content, aboutText, stats, y1, mounted, t }: HeroContentProps) {
  const words = (content.title || "Vectoria Premium Experience").split(' ');

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      className="lg:col-span-7 max-w-3xl"
    >
      {/* Eyebrow — Minuscule avec tiret */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="section-eyebrow mb-6"
      >
        {content.badge || "Location Premium"}
      </motion.div>

      {/* Title — Instrument Serif, cinématographique */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="display-title leading-[1.08] mb-8"
      >
        <span className="block text-white">
          {words.slice(0, -1).join(' ')}
        </span>
        <span className="block bg-gradient-to-r from-gold via-gold to-gold/60 bg-clip-text text-transparent mt-2">
          {words[words.length - 1]}
        </span>
      </motion.h1>

      {/* Subtitle — Body Feature */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="body-feature text-white/85 max-w-2xl mb-10 leading-relaxed"
      >
        {content.subtitle || aboutText || t("hero_subtitle")}
      </motion.p>

      {/* Benefits Pills — Premium Style */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        {[
          { icon: Shield, text: "Assurance tout risque", color: "text-gold" },
          { icon: Zap, text: "Livraison instantanée", color: "text-gold" },
          { icon: Clock, text: "Support VIP 24/7", color: "text-gold" }
        ].map((item, i) => (
          <div 
            key={i} 
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white/8 backdrop-blur border border-white/15 rounded-full hover:bg-white/12 hover:border-gold/30 transition-all duration-300"
          >
            <item.icon size={16} className={item.color} />
            <span className="text-sm font-semibold text-white/90 tracking-wide">{item.text}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
