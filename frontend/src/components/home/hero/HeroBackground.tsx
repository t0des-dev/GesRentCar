"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";

interface HeroBackgroundProps {
  heroImage: string;
  heroVideo: string | null;
  bgX: MotionValue<number>;
  bgY: MotionValue<number>;
  line1X: MotionValue<number>;
  line1Y: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  mounted: boolean;
}

export default function HeroBackground({
  heroImage, heroVideo, bgX, bgY, line1X, line1Y, scale, opacity, mounted
}: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0">
      <motion.div 
        style={mounted ? { x: bgX, y: bgY, scale, opacity } : { scale: 1.1, opacity: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="w-full h-full relative"
      >
        {heroVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={heroImage}
            className="w-full h-full object-cover object-center scale-110 brightness-[0.6] contrast-125"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={heroImage}
            alt="Luxury Car"
            fill
            priority
            className="object-cover object-center scale-110 brightness-[0.6] contrast-125"
          />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
      
      {/* Parallax Floating Lines */}
      <motion.div 
        style={mounted ? { x: line1X, y: line1Y, opacity } : { opacity: 1 }}
        className="absolute top-1/4 -left-20 w-[1000px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rotate-45 blur-[3px]" 
      />
    </div>
  );
}
