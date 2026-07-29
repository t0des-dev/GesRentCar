"use client";

import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Calendar, Building2, Plane, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import MagneticWrapper from "@/shared/ui/MagneticWrapper";

interface HeroSearchFormProps {
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
  y1: MotionValue<number>;
  mounted: boolean;
  content?: any;
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

const PREDEFINED_LOCATIONS = [
  { id: "cmn", name: "Aéroport Mohammed V (CMN)", city: "Casablanca", icon: Plane },
  { id: "casa", name: "Centre Ville", city: "Casablanca", icon: Building2 },
  { id: "rak", name: "Aéroport Menara (RAK)", city: "Marrakech", icon: Plane },
  { id: "tng", name: "Aéroport Ibn Battouta (TNG)", city: "Tanger", icon: Plane },
  { id: "rabat", name: "Centre Ville", city: "Rabat", icon: Building2 },
];

export default function HeroSearchForm({
  location, setLocation, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, onSearch, y1, mounted, content = {}
}: HeroSearchFormProps) {
  const today = getTodayString();
  const sf = content?.search_form || {};
  const locationLabel = sf?.location_label || "Destination";
  const locationPlaceholder = sf?.location_placeholder || "Ville, aéroport...";
  const startLabel = sf?.start_label || "Départ";
  const endLabel = sf?.end_label || "Retour";
  const searchButton = sf?.search_button || "Chercher un véhicule";
  const fleetLinkText = sf?.fleet_link_text || "Voir toute la flotte";
  const fleetLinkHref = sf?.fleet_link_href || "/fleet";

  const [showLocations, setShowLocations] = useState(false);

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-5"
    >
      <div className="bg-white/98 rounded-[18px] p-[36px_32px] sm:p-[44px_40px] shadow-[0_40px_90px_-24px_rgba(6,10,22,0.55)] border border-white/20 text-charcoal">
        {/* AR7 Booking Card Header */}
        <div className="mb-[24px]">
          <h3 className="text-[21px] font-bold text-ink-1 mb-[5px]" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
            {sf?.title || "Réserver votre véhicule"}
          </h3>
          <span className="text-[13.5px] text-[#6b7280] block">
            {sf?.subtitle || "Disponibilité garantie & annulation gratuite"}
          </span>
        </div>

        <div className="space-y-4">

          {/* Location Field */}
          <div className="space-y-2 relative">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#8a8f98]">
              {locationLabel}
            </label>
            <div className="flex items-center gap-3 px-4 py-3.5 bg-[#EEF2F6] border border-black/10 rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 relative z-20">
              <MapPin size={18} className="text-gold shrink-0" />
              <input
                type="text"
                placeholder={locationPlaceholder}
                value={location}
                onChange={e => setLocation(e.target.value)}
                onFocus={() => setShowLocations(true)}
                onBlur={() => setTimeout(() => setShowLocations(false), 200)}
                className="w-full bg-transparent text-ink-1 text-[14.5px] placeholder:text-[#8a8f98] focus:outline-none font-medium"
              />
            </div>
            
            {/* Custom Autocomplete Dropdown */}
            <AnimatePresence>
              {showLocations && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-black/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  <div className="p-2 space-y-1">
                    {PREDEFINED_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => { setLocation(`${loc.city} - ${loc.name}`); setShowLocations(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#EEF2F6] transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ink-3 group-hover:text-gold transition-colors">
                          <loc.icon size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink-1 group-hover:text-gold transition-colors">{loc.city}</p>
                          <p className="text-[10px] text-ink-3 uppercase tracking-wider">{loc.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#8a8f98]">
                {startLabel}
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#EEF2F6] border border-black/10 rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <Calendar size={16} className="text-gold shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-ink-1 text-[13.5px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#EEF2F6] border border-black/10 rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <Clock size={16} className="text-gold shrink-0" />
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-transparent text-ink-1 text-[13.5px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#8a8f98]">
                {endLabel}
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#EEF2F6] border border-black/10 rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <Calendar size={16} className="text-gold shrink-0" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-ink-1 text-[13.5px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#EEF2F6] border border-black/10 rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <Clock size={16} className="text-gold shrink-0" />
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-transparent text-ink-1 text-[13.5px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onSearch}
              className="w-full py-4 px-6 rounded-full bg-ink-1 text-white font-semibold text-[15.5px] flex items-center justify-center gap-2 shadow-[0_14px_30px_-12px_rgba(22,33,62,0.5)] hover:shadow-[0_18px_36px_-12px_rgba(22,33,62,0.6)] hover:-translate-y-0.5 transition-all duration-350"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              {searchButton}
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href={fleetLinkHref}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8a8f98] hover:text-gold transition-colors duration-300 tracking-wider uppercase group"
            >
              {fleetLinkText}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
