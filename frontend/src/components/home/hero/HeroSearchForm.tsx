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
      <div className="bg-white rounded-[24px] p-7 sm:p-9 shadow-[0_40px_90px_-24px_rgba(6,10,22,0.55)] border border-white/20 text-charcoal">
        {/* Header from Screenshot */}
        <div className="mb-6">
          <h3 className="text-[22px] font-bold text-[#16213E] mb-1" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
            {sf?.title || "Reserve your vehicle"}
          </h3>
          <span className="text-[13px] text-[#8a8f98] block">
            {sf?.subtitle || "Confirmed in under 2 minutes."}
          </span>
        </div>

        <div className="space-y-4">

          {/* Location Field */}
          <div className="space-y-1.5 relative">
            <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8a8f98]">
              {locationLabel || "PICK-UP LOCATION"}
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-[#EEF2F6] border border-transparent rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 relative z-20">
              <MapPin size={16} className="text-[#8a8f98] shrink-0" />
              <input
                type="text"
                placeholder={locationPlaceholder || "Casablanca — Mohammed V Airport"}
                value={location}
                onChange={e => setLocation(e.target.value)}
                onFocus={() => setShowLocations(true)}
                onBlur={() => setTimeout(() => setShowLocations(false), 200)}
                className="w-full bg-transparent text-[#1D1D1F] text-[14px] placeholder:text-[#1D1D1F] focus:outline-none font-medium"
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
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#EEF2F6] transition-colors text-left group"
                      >
                        <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-ink-3 group-hover:text-gold transition-colors">
                          <loc.icon size={13} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-ink-1 group-hover:text-gold transition-colors">{loc.city}</p>
                          <p className="text-[9px] text-ink-3 uppercase tracking-wider">{loc.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8a8f98]">
                {startLabel || "PICK-UP DATE"}
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#EEF2F6] border border-transparent rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-[#1D1D1F] text-[13px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
                <Calendar size={14} className="text-[#8a8f98] shrink-0 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8a8f98]">
                PICK-UP TIME
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#EEF2F6] border border-transparent rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-transparent text-[#1D1D1F] text-[13px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
                <Clock size={14} className="text-[#8a8f98] shrink-0 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8a8f98]">
                {endLabel || "RETURN DATE"}
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#EEF2F6] border border-transparent rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-[#1D1D1F] text-[13px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
                <Calendar size={14} className="text-[#8a8f98] shrink-0 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8a8f98]">
                RETURN TIME
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#EEF2F6] border border-transparent rounded-xl focus-within:border-gold focus-within:bg-white transition-all duration-300 overflow-hidden">
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-transparent text-[#1D1D1F] text-[13px] focus:outline-none font-medium relative z-10 cursor-pointer"
                />
                <Clock size={14} className="text-[#8a8f98] shrink-0 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Vehicle Category Field from Screenshot */}
          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8a8f98]">
              VEHICLE CATEGORY
            </label>
            <select
              className="w-full bg-[#EEF2F6] text-[#1D1D1F] text-[14px] px-4 py-3 rounded-xl border border-transparent focus:border-gold focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer"
              defaultValue="any"
            >
              <option value="any">Any category</option>
              <option value="sedan">Berlines Premium</option>
              <option value="suv">SUV & 4x4</option>
              <option value="luxury">Sport & Prestige</option>
              <option value="chauffeur">Chauffeur VIP</option>
            </select>
          </div>

          {/* Action Button from Screenshot */}
          <div className="pt-2">
            <button
              onClick={onSearch}
              className="w-full py-4 px-6 rounded-full bg-[#16213E] hover:bg-[#0f172a] text-white font-semibold text-[15px] tracking-wide shadow-md transition-all duration-300"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              {searchButton || "Check availability"}
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
