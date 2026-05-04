"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin, ArrowRight, Star, Shield, Zap, Clock } from "lucide-react";
import LiveAvailability from "@/components/LiveAvailability";
import { useTranslation } from "@/hooks/useTranslation";

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

  const heroImage = agency.hero_image_url || "https://images.unsplash.com/photo-1503377215949-b98377627166?q=80&w=2400&auto=format&fit=crop";

  const titleWords = (content.title || agency.agency_slogan || "Vectoria Premium Experience").split(' ');

  return (
    <section className="relative h-[115vh] min-h-[950px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-10 bg-[url('https://res.cloudinary.com/dcbp6v7p3/image/upload/v1714859000/grain_texture_w4f4q4.png')] mix-blend-overlay" />
      
      {/* Cursor Follow Glow */}
      <motion.div 
        style={mounted ? { x: mouseX, y: mouseY } : {}}
        className="absolute w-[800px] h-[800px] bg-primary/5 blur-[180px] rounded-full pointer-events-none z-[1] -ml-[400px] -mt-[400px]"
      />

      <div className="absolute inset-0 z-0">
        <motion.div 
          style={mounted ? { x: bgX, y: bgY, scale, opacity } : { scale: 1.1, opacity: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="w-full h-full relative"
        >
          {agency.hero_video_url || true ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={heroImage}
              className="w-full h-full object-cover object-center scale-110 brightness-[0.6] contrast-125"
            >
              <source src={agency.hero_video_url || "https://assets.mixkit.co/videos/preview/mixkit-black-luxury-car-driving-on-a-highway-42412-large.mp4"} type="video/mp4" />
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
          style={mounted ? { 
            x: line1X, 
            y: line1Y,
            opacity
          } : { opacity: 1 }}
          className="absolute top-1/4 -left-20 w-[1000px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rotate-45 blur-[3px]" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
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
                  {titleWords.slice(0, -1).map((word, i) => (
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

            {/* Floating Benefit Badges */}
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

          <motion.div 
            style={mounted ? { rotateX, rotateY, perspective: 1000, y: y1 } : { perspective: 1000 }}
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="bg-slate-900/40 backdrop-blur-[60px] border border-white/20 p-10 md:p-16 rounded-[64px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden group transition-all duration-700 hover:border-primary/60">
              {/* Premium Sheen Light Streak */}
              <div className="absolute -inset-[100%] group-hover:animate-[sheen_3s_infinite] pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[35deg]" />
              </div>
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[150px] -mr-40 -mt-40 transition-opacity group-hover:opacity-100 opacity-60" />
              <div className="relative z-10 space-y-12">
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Emplacement</label>
                  <div className="relative group/input">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-primary transition-all duration-500" size={24} />
                    <input 
                      type="text" 
                      placeholder="Destination de rêve..." 
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-6 pl-12 text-white font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-700 text-xl tracking-tight"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Départ</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-5 text-white font-bold focus:outline-none focus:border-primary transition-all [color-scheme:dark] text-lg cursor-pointer"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Retour</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-5 text-white font-bold focus:outline-none focus:border-primary transition-all [color-scheme:dark] text-lg cursor-pointer"
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSearch}
                  className="w-full relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] animate-gradient-x" />
                  <div className="relative z-10 flex items-center justify-center gap-4 py-7 rounded-[32px] text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/40">
                    Réserver mon véhicule
                    <ArrowRight size={22} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
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
