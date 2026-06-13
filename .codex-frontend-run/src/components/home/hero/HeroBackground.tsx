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

export default function HeroBackground({ heroImage, heroVideo, scale }: HeroBackgroundProps) {
  const [videoError, setVideoError] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

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
            className="object-cover brightness-[0.45]"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />

      {heroVideo && (
        <button
          onClick={(e) => { e.stopPropagation(); setVideoMuted(!videoMuted); setUserInteracted(true); }}
          className="absolute top-8 right-8 z-20 w-10 h-10 rounded-xl bg-black/30 backdrop-blur border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/50 transition-all"
          aria-label={videoMuted ? "Activer le son" : "Couper le son"}
        >
          {videoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}
    </div>
  );
}
