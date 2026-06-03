"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { getImageUrl } from "@/lib/utils/image";

// Modular Sub-components
import HeroBackground from "./hero/HeroBackground";
import HeroContent from "./hero/HeroContent";
import HeroSearchForm from "./hero/HeroSearchForm";

interface HeroSectionProps {
  agency: any;
  content: any;
  location: string;
  setLocation: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  onSearch: () => void;
  aboutText: string;
  stats: any[];
}

export default function HeroSection({
  agency, content, location, setLocation, startDate, setStartDate, endDate, setEndDate, onSearch, aboutText, stats
}: HeroSectionProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const rotateX = useSpring(useTransform(mouseY, [-500, 500], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-5, 5]), { stiffness: 100, damping: 30 });
  
  const bgX = useSpring(useTransform(mouseX, [-500, 500], [-20, 20]), { stiffness: 50, damping: 20 });
  const bgY = useSpring(useTransform(mouseY, [-500, 500], [-20, 20]), { stiffness: 50, damping: 20 });

  const line1X = useTransform(mouseX, [-500, 500], [-70, 70]);
  const line1Y = useTransform(mouseY, [-500, 500], [-70, 70]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const heroImage = getImageUrl(agency.hero_image_url) || "https://images.unsplash.com/photo-1503377215949-b98377627166?q=80&w=2400&auto=format&fit=crop";
  const heroVideo = agency.hero_video_url || "https://assets.mixkit.co/videos/preview/mixkit-black-luxury-car-driving-on-a-highway-42412-large.mp4";

  return (
    <section className="relative h-[115vh] min-h-[950px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-10 bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] mix-blend-overlay" />
      
      {/* Cursor Follow Glow */}
      <motion.div 
        style={mounted ? { x: mouseX, y: mouseY } : {}}
        className="absolute w-[800px] h-[800px] bg-primary/5 blur-[180px] rounded-full pointer-events-none z-[1] -ml-[400px] -mt-[400px]"
      />

      <HeroBackground 
        heroImage={heroImage} heroVideo={heroVideo}
        bgX={bgX} bgY={bgY} line1X={line1X} line1Y={line1Y}
        scale={scale} opacity={opacity} mounted={mounted}
      />

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <HeroContent 
            content={content} aboutText={aboutText} stats={stats} 
            y1={y1} mounted={mounted} t={t} 
          />

          <HeroSearchForm 
            location={location} setLocation={setLocation}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            onSearch={onSearch} rotateX={rotateX} rotateY={rotateY}
            y1={y1} mounted={mounted}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Découvrir l'univers</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
