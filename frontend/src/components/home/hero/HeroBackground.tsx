"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface HeroBackgroundProps {
  heroImage: string;
  heroVideo: string | null;
  scale: MotionValue<number>;
}

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function HeroBackground({ heroImage, heroVideo, scale }: HeroBackgroundProps) {
  const [videoError, setVideoError] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  return (
    <div className="absolute inset-0 z-0">
      <motion.div style={{ scale }} className="w-full h-full">
        {heroVideo && !videoError ? (
          <video
            autoPlay loop muted={videoMuted} playsInline
            poster={heroImage}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover brightness-[0.45]"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={heroImage}
            alt=""
            fill priority
            sizes="100vw"
            className="object-cover brightness-[0.45]"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink-1 via-ink-1/40 to-ink-1/60" />

      {/* Grain texture — inline SVG, no external dependency */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat" }}
      />

      {heroVideo && (
        <button
          onClick={(e) => { e.stopPropagation(); setVideoMuted(!videoMuted); }}
          className="absolute top-8 right-8 z-20 w-10 h-10 rounded-xl bg-black/30 backdrop-blur border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/50 transition-all"
          aria-label={videoMuted ? "Activer le son" : "Couper le son"}
        >
          {videoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}
    </div>
  );
}
