"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getImageUrl } from "@/shared/utils/image";

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
  startTime: string;
  setStartTime: (v: string) => void;
  endTime: string;
  setEndTime: (v: string) => void;
  onSearch: () => void;
  aboutText: string;
  stats: any[];
  heroImage?: string;
  heroVideo?: string | null;
}

export default function HeroSection({
  agency, content, location, setLocation, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, onSearch, aboutText, stats, heroImage: heroImageProp, heroVideo: heroVideoProp
}: HeroSectionProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroImage = heroImageProp || getImageUrl(agency.hero_image_url) || "https://images.unsplash.com/photo-1503377215949-b98377627166?q=80&w=2400&auto=format&fit=crop";
  const heroVideo = heroVideoProp || agency.hero_video_url || "https://assets.mixkit.co/videos/preview/mixkit-black-luxury-car-driving-on-a-highway-42412-large.mp4";

  const scrollText = content?.experience?.cta_text || "Découvrir";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-1 will-change-transform"
      style={{ minHeight: "100dvh" }}
    >
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] mix-blend-overlay" />

      <div className="absolute w-[600px] h-[600px] bg-primary/8 blur-[150px] rounded-full pointer-events-none z-[1] -top-48 -left-48" />

      <HeroBackground
        heroImage={heroImage}
        heroVideo={heroVideo}
        scale={useTransform(scrollY, [0, 500], [1, reduceMotion ? 1 : 1.08])}
      />

      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <HeroContent
            content={content} aboutText={aboutText} stats={stats}
            y1={y1} mounted={mounted} t={t}
          />

          <HeroSearchForm
            content={content}
            location={location} setLocation={setLocation}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            startTime={startTime} setStartTime={setStartTime}
            endTime={endTime} setEndTime={setEndTime}
            onSearch={onSearch} y1={y1} mounted={mounted}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">{scrollText}</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
