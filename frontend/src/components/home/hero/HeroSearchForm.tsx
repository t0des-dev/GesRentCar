"use client";

import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Calendar, Building2, Plane, Clock, ChevronDown, Car, Fuel, Zap, Truck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { useState, useCallback } from "react";
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
  onSearch: () => void;
  y1: MotionValue<number>;
  mounted: boolean;
  content?: any;
  selectedCategory?: string;
  onCategorySelect?: (cat: string | null) => void;
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

const CATEGORY_CHIPS = [
  { id: "suv", label: "SUV", icon: Car },
  { id: "berline", label: "Berline", icon: Sparkles },
  { id: "electrique", label: "Électrique", icon: Zap },
  { id: "utilitaire", label: "Utilitaire", icon: Truck },
  { id: "citadine", label: "Citadine", icon: Fuel },
];

export default function HeroSearchForm({
  location, setLocation, startDate, setStartDate, endDate, setEndDate,
  startTime, setStartTime, onSearch, y1, mounted, content = {},
  selectedCategory, onCategorySelect,
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
  const [expanded, setExpanded] = useState(false);

  const handleQuickDate = useCallback((days: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, [setStartDate, setEndDate]);

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-5"
    >
      <div className="glass-dark rounded-[24px] p-8 shadow-2xl border border-white/10 backdrop-blur-2xl">
        <div className="space-y-6">

          {/* Category Quick-Pick Chips */}
          {onCategorySelect && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {CATEGORY_CHIPS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategorySelect(selectedCategory === cat.id ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-gold text-ink-1 shadow-[0_0_16px_rgba(212,175,55,0.4)]"
                      : "bg-white/8 text-white/70 border border-white/10 hover:bg-white/15 hover:text-white hover:border-white/25"
                  }`}
                >
                  <cat.icon size={12} />
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Location Field with Custom Dropdown */}
          <div className="space-y-2.5 relative">
            <label className="text-[11px] font-bold uppercase tracking-widest text-white/70 ml-1">
              {locationLabel}
            </label>
            <div className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold/50 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500 relative z-20">
              <MapPin size={18} className="text-gold shrink-0" />
              <input
                type="text"
                placeholder={locationPlaceholder}
                value={location}
                onChange={e => setLocation(e.target.value)}
                onFocus={() => setShowLocations(true)}
                onBlur={() => setTimeout(() => setShowLocations(false), 200)}
                className="w-full bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none font-medium"
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
                  className="absolute top-[calc(100%+8px)] left-0 w-full bg-ink-1/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
                >
                  <div className="p-2 space-y-1">
                    {PREDEFINED_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => { setLocation(`${loc.city} - ${loc.name}`); setShowLocations(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-gold group-hover:bg-gold/10 transition-colors">
                          <loc.icon size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">{loc.city}</p>
                          <p className="text-[10px] text-white/50 uppercase tracking-wider">{loc.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/70 ml-1">
                {startLabel}
              </label>
              <div className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold/50 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden">
                <Calendar size={18} className="text-gold shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none font-medium [color-scheme:dark] relative z-10 cursor-pointer premium-date-input"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/70 ml-1">
                {endLabel}
              </label>
              <div className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold/50 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden">
                <Calendar size={18} className="text-gold shrink-0" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none font-medium [color-scheme:dark] relative z-10 cursor-pointer premium-date-input"
                />
              </div>
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="flex gap-2 justify-center lg:justify-start">
            {[
              { label: "1j", days: 1 },
              { label: "3j", days: 3 },
              { label: "1sem", days: 7 },
              { label: "2sem", days: 14 },
            ].map((preset) => (
              <button
                key={preset.days}
                onClick={() => handleQuickDate(preset.days)}
                className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/50 border border-white/10 hover:bg-gold/20 hover:text-gold hover:border-gold/30 transition-all duration-300"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Collapsible Time Pickers (mobile: hidden by default) */}
          <div className={`${expanded ? "block" : "hidden"} lg:block space-y-4`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-white/70 ml-1">
                  Heure de départ
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold/50 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden">
                  <Clock size={18} className="text-gold shrink-0" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-transparent text-white text-sm focus:outline-none font-medium [color-scheme:dark] relative z-10 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-white/70 ml-1">
                  Heure de retour
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold/50 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden">
                  <Clock size={18} className="text-gold shrink-0" />
                  <input
                    type="time"
                    value={startTime}
                    readOnly
                    className="w-full bg-transparent text-white/40 text-sm font-medium [color-scheme:dark] relative z-10 cursor-default"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Expand/Collapse times toggle (mobile only) */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="lg:hidden flex items-center gap-2 mx-auto text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-gold transition-colors"
          >
            <Clock size={12} />
            {expanded ? "Masquer les horaires" : "Choisir les horaires"}
            <ChevronDown size={12} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </button>

          <MagneticWrapper className="w-full pt-2">
            <Button
              onClick={onSearch}
              data-cursor="Go!"
              variant="gold"
              size="lg"
              className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transition-all duration-500"
            >
              {searchButton}
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform ml-2" />
            </Button>
          </MagneticWrapper>

          <div className="text-center pt-3">
            <Link
              href={fleetLinkHref}
              data-cursor="Flotte"
              className="inline-flex items-center gap-2 text-xs font-bold text-white/50 hover:text-gold transition-colors duration-300 tracking-widest uppercase group"
            >
              {fleetLinkText}
              <ArrowRight size={12} className="group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
