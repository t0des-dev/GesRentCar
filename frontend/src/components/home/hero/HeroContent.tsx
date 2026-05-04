"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";
import { Star, Shield, Zap, Clock } from "lucide-react";
import LiveAvailability from "@/components/LiveAvailability";

interface HeroContentProps {
  content: any;
  aboutText: string;
  stats: any[];
  y1: MotionValue<number>;
  mounted: boolean;
  t: (key: string) => string;
}

export default function HeroContent({ content, aboutText, stats, y1, mounted, t }: HeroContentProps) {
  const titleWords = (content.title || "Vectoria Premium Experience").split(' ');

  return (
    <motion.div style={mounted ? { y: y1 } : {}} className="lg:col-span-7">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-3 rounded-full text-white mb-10 shadow-2xl"
      >
        <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">
          {content.badge || t("hero_badge") || "Collection Exclusive"}
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-10"
      >
        <LiveAvailability />
      </motion.div>

      <div className="overflow-hidden">
        <h1 className="text-6xl md:text-[130px] font-black text-white tracking-tighter leading-[0.75] mb-12 uppercase drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none">
          <div className="flex flex-wrap gap-x-6">
            {titleWords.slice(0, -1).map((word: string, i: number) => (
              <motion.span
                key={i}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7 + (i * 0.1), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="block opacity-90"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-gradient-x italic relative inline-block mt-4"
          >
            {titleWords[titleWords.length - 1]}
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-primary via-blue-400 to-transparent rounded-full blur-[1px]"
            />
          </motion.span>
        </h1>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl md:text-3xl text-slate-300/60 max-w-2xl mb-16 font-light leading-relaxed tracking-wide italic"
      >
        {content.subtitle || aboutText || t("hero_subtitle") || "Vivez l'exceptionnel avec une sélection de prestige."}
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center gap-14"
      >
        <div className="flex -space-x-5">
          {[1, 2, 3, 4].map(i => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10, zIndex: 50 }}
              className="w-16 h-16 rounded-full border-[6px] border-slate-950 bg-slate-800 overflow-hidden relative shadow-2xl cursor-pointer"
            >
              <Image 
                src={`https://i.pravatar.cc/100?u=${i + 20}`} 
                alt="User" 
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
          <div className="w-16 h-16 rounded-full border-[6px] border-slate-950 bg-primary flex items-center justify-center text-xs font-black text-white shadow-2xl">
            {stats[0]?.value || "+500"}
          </div>
        </div>
        <div className="text-slate-400 group cursor-help">
          <div className="flex gap-1.5 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-primary text-primary group-hover:scale-125 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />)}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">{t("hero_award") || "Service Premium de l'Année"}</p>
        </div>
      </motion.div>

      <div className="mt-20 flex flex-wrap gap-8">
        {[
          { icon: Shield, text: "Assurance Tout Risque", color: "text-blue-400" },
          { icon: Zap, text: "Livraison Instantanée", color: "text-yellow-400" },
          { icon: Clock, text: "Support 24/7 VIP", color: "text-emerald-400" }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            transition={{ delay: 0.8 + (idx * 0.1) }}
            className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3.5 rounded-[24px] backdrop-blur-2xl cursor-default transition-colors"
          >
            <item.icon size={20} className={item.color} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
