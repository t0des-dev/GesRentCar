"use client";

import { motion, MotionValue } from "framer-motion";
import { MapPin, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSearchFormProps {
  location: string;
  setLocation: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  onSearch: () => void;
  y1: MotionValue<number>;
  mounted: boolean;
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export default function HeroSearchForm({
  location, setLocation, startDate, setStartDate, endDate, setEndDate, onSearch, y1, mounted
}: HeroSearchFormProps) {
  const today = getTodayString();

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-5"
    >
      {/* Glass Card — Premium Style */}
      <div className="glass-dark rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-2xl">
        <div className="space-y-5">
          
          {/* Location Field */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-white/70">
              Destination
            </label>
            <div className="flex items-center gap-3 px-4 py-3.5 bg-white/8 border border-white/20 rounded-lg focus-within:border-gold/60 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-gold/20 transition-all duration-300">
              <MapPin size={18} className="text-gold/80 shrink-0" />
              <input
                type="text"
                placeholder="Ville, aéroport..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Date Fields — 2 Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                Départ
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-white/8 border border-white/20 rounded-lg focus-within:border-gold/60 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-gold/20 transition-all duration-300">
                <Calendar size={16} className="text-gold/80 shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none font-medium [color-scheme:dark]"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                Retour
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-white/8 border border-white/20 rounded-lg focus-within:border-gold/60 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-gold/20 transition-all duration-300">
                <Calendar size={16} className="text-gold/80 shrink-0" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none font-medium [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Search Button — Gold Premium */}
          <Button
            onClick={onSearch}
            variant="gold"
            size="lg"
            className="w-full text-base font-bold uppercase tracking-widest shadow-2xl shadow-gold/40 hover:shadow-gold/60 transition-all duration-300"
          >
            Chercher un véhicule
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* View Fleet Link */}
          <div className="text-center pt-2">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold/90 hover:text-gold transition-colors duration-300 tracking-wide uppercase"
            >
              Voir toute la flotte
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
