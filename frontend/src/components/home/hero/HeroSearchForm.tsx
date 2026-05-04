"use client";

import { motion, MotionValue } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

interface HeroSearchFormProps {
  location: string;
  setLocation: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  onSearch: () => void;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  y1: MotionValue<number>;
  mounted: boolean;
}

export default function HeroSearchForm({
  location, setLocation, startDate, setStartDate, endDate, setEndDate, onSearch, rotateX, rotateY, y1, mounted
}: HeroSearchFormProps) {
  return (
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
  );
}
