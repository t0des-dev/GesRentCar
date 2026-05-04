"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowRight, Star } from "lucide-react";
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
  const heroImage = agency.hero_image_url || "https://images.unsplash.com/photo-1503377215949-b98377627166?q=80&w=2400&auto=format&fit=crop";

  return (
    <section className="relative h-[110vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          {agency.hero_video_url || true ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={heroImage}
              className="w-full h-full object-cover object-center scale-110"
            >
              <source src={agency.hero_video_url || "https://assets.mixkit.co/videos/preview/mixkit-black-luxury-car-driving-on-a-highway-42412-large.mp4"} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={heroImage}
              alt="Luxury Car"
              fill
              priority
              className="object-cover object-center scale-110"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute top-1/4 -left-20 w-[600px] h-px bg-primary/20 rotate-45 blur-sm animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-px bg-secondary/20 -rotate-45 blur-sm animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-full text-white mb-10"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">
                {content.badge || t("hero_badge") || "Collection Exclusive"}
              </span>
            </motion.div>

            <div className="mb-10">
              <LiveAvailability />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-[110px] font-black text-white tracking-tighter leading-[0.85] mb-10 uppercase drop-shadow-2xl">
                {(content.title || agency.agency_slogan) ? (
                  <>
                    {(content.title || agency.agency_slogan).split(' ').slice(0, -1).join(' ')} <br />
                    <span className="text-gradient-gold italic">
                      {(content.title || agency.agency_slogan).split(' ').slice(-1)}
                    </span>
                  </>
                ) : (
                  <>
                    {agency.agency_name || "VECTORIA"} <br />
                    <span className="text-gradient-gold italic">PREMIUM</span>.
                  </>
                )}
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-3xl text-slate-300 max-w-2xl mb-14 font-medium leading-relaxed opacity-70"
            >
              {content.subtitle || aboutText || t("hero_subtitle") || "Vivez l'exceptionnel avec une sélection de prestige."}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-12"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-14 h-14 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden relative">
                    <Image 
                      src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                      alt="User" 
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-slate-950 bg-primary flex items-center justify-center text-xs font-black text-white">
                  {stats[0].value}
                </div>
              </div>
              <div className="text-slate-400">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-primary text-primary" />)}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">{t("hero_award") || "Service Premium de l'Année"}</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/20 p-10 md:p-14 rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group transition-all duration-500 hover:border-primary/30">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] -mr-40 -mt-40 transition-opacity group-hover:opacity-100 opacity-60" />
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Emplacement</label>
                  <div className="relative group/input">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-primary transition-all duration-300" size={20} />
                    <input 
                      type="text" 
                      placeholder="Casablanca, Marrakech, Tanger..." 
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-5 pl-10 text-white font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-600 text-lg"
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

                <button 
                  onClick={onSearch}
                  className="w-full bg-primary text-white py-7 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/40 group/btn mt-4"
                >
                  Réserver mon véhicule
                  <ArrowRight size={22} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                </button>
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
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Découvrir</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
