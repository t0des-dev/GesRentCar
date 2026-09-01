"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Clock, ChevronRight, Plane, Building2 } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import Link from "next/link";

interface FleetHeaderProps {
  fleetConfig?: Record<string, any>;
  initialLocation?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  onBookingSearch?: (params: {
    location: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => void;
}

const PREDEFINED_LOCATIONS = [
  { id: "cmn", nameFr: "Aéroport Mohammed V (CMN)", nameEn: "Mohammed V Airport (CMN)", city: "Casablanca", icon: Plane },
  { id: "casa", nameFr: "Centre Ville", nameEn: "City Center", city: "Casablanca", icon: Building2 },
  { id: "rak", nameFr: "Aéroport Menara (RAK)", nameEn: "Menara Airport (RAK)", city: "Marrakech", icon: Plane },
  { id: "tng", nameFr: "Aéroport Ibn Battouta (TNG)", nameEn: "Ibn Battouta Airport (TNG)", city: "Tanger", icon: Plane },
  { id: "rabat", nameFr: "Centre Ville", nameEn: "City Center", city: "Rabat", icon: Building2 },
  { id: "fes", nameFr: "Aéroport Saïss (FEZ)", nameEn: "Saïss Airport (FEZ)", city: "Fès", icon: Plane },
  { id: "essaouira", nameFr: "Centre Ville", nameEn: "City Center", city: "Essaouira", icon: Building2 },
];

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function FleetHeader({
  fleetConfig,
  initialLocation,
  initialStartDate,
  initialEndDate,
  initialStartTime,
  initialEndTime,
  onBookingSearch,
}: FleetHeaderProps) {
  const { t, lang } = useTranslation();
  const agency = useAgency();

  const heroImage = fleetConfig?.hero_image_url || agency.hero_image_url || "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1920";

  const isDefaultOrFrenchEyebrow = !fleetConfig?.hero_eyebrow || fleetConfig.hero_eyebrow === "Flotte Prestige" || fleetConfig.hero_eyebrow === "Premium Fleet";
  const heroEyebrow = lang === "fr"
    ? (fleetConfig?.hero_eyebrow || "Flotte Prestige")
    : (fleetConfig?.hero_eyebrow_en || (isDefaultOrFrenchEyebrow ? "Prestige Fleet" : fleetConfig.hero_eyebrow));

  const isDefaultOrFrenchTitle = !fleetConfig?.hero_title || fleetConfig.hero_title === "Explorez Notre Flotte Premium" || fleetConfig.hero_title.includes("Explorez") || fleetConfig.hero_title.includes("Flotte");
  const heroTitle = lang === "fr"
    ? (fleetConfig?.hero_title || "Explorez Notre Flotte Premium")
    : (fleetConfig?.hero_title_en || (isDefaultOrFrenchTitle ? "Explore Our Premium Fleet" : fleetConfig.hero_title));

  const isDefaultOrFrenchSubtitle = !fleetConfig?.hero_subtitle || fleetConfig.hero_subtitle.includes("Trouvez le véhicule") || fleetConfig.hero_subtitle.includes("voyages d'affaires");
  const heroSubtitle = lang === "fr"
    ? (fleetConfig?.hero_subtitle || "Trouvez le véhicule parfait pour vos voyages d'affaires, vacances familiales et expériences d'exception à travers le Maroc.")
    : (fleetConfig?.hero_subtitle_en || (isDefaultOrFrenchSubtitle ? "Find the perfect vehicle for your business trips, family vacations, and luxury experiences across Morocco." : fleetConfig.hero_subtitle));

  const defaultLocation = initialLocation || fleetConfig?.default_location || (lang === "fr" ? "Casablanca — Aéroport Mohammed V (CMN)" : "Casablanca — Mohammed V Airport (CMN)");
  const locations = fleetConfig?.locations || PREDEFINED_LOCATIONS;

  const [location, setLocation] = useState(defaultLocation);
  const [startDate, setStartDate] = useState(initialStartDate || "");
  const [startTime, setStartTime] = useState(initialStartTime || "10:00");
  const [endDate, setEndDate] = useState(initialEndDate || "");
  const [endTime, setEndTime] = useState(initialEndTime || "10:00");
  const [showLocations, setShowLocations] = useState(false);

  const today = getTodayString();

  useEffect(() => {
    if (initialLocation) setLocation(initialLocation);
    if (initialStartDate) setStartDate(initialStartDate);
    if (initialEndDate) setEndDate(initialEndDate);
    if (initialStartTime) setStartTime(initialStartTime);
    if (initialEndTime) setEndTime(initialEndTime);
  }, [initialLocation, initialStartDate, initialEndDate, initialStartTime, initialEndTime]);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (value && endDate && endDate < value) {
      setEndDate(value);
    }
  };

  const handleSearch = () => {
    if (typeof window !== "undefined") {
      if (location) localStorage.setItem("vrc_search_location", location);
      if (startDate) localStorage.setItem("vrc_search_start", startDate);
      if (endDate) localStorage.setItem("vrc_search_end", endDate);
      if (startTime) localStorage.setItem("vrc_search_start_time", startTime);
      if (endTime) localStorage.setItem("vrc_search_end_time", endTime);
    }
    if (onBookingSearch) {
      onBookingSearch({ location, startDate, startTime, endDate, endTime });
    }
  };

  return (
    <div className="relative mb-12">
      {/* Hero Background with proper top padding for fixed Navbar */}
      <div className="relative min-h-[420px] md:min-h-[450px] pt-28 md:pt-32 pb-24 overflow-hidden flex flex-col justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/95 via-[#0a0f1e]/80 to-[#0a0f1e]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/90 via-transparent to-black/30" />

        {/* Content */}
        <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-center">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[2px] bg-amber-400" />
            <span className="text-amber-400 text-[11px] font-black tracking-[0.2em] uppercase">
              {heroEyebrow}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-[56px] font-black text-white leading-[1.1] tracking-tight mb-4 max-w-2xl"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            {heroTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl font-medium"
          >
            {heroSubtitle}
          </motion.p>
        </div>
      </div>

      {/* Booking Bar — overlapping hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-6 lg:px-8 -mt-14 relative z-20"
      >
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

            {/* Location */}
            <div className="md:col-span-3 space-y-1.5 relative">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {lang === "fr" ? "Lieu de prise en charge" : "Pick-up location"}
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-[#EEF2F6] rounded-xl border border-transparent focus-within:border-amber-400 focus-within:bg-white transition-all duration-200">
                <MapPin size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowLocations(true)}
                  onBlur={() => setTimeout(() => setShowLocations(false), 200)}
                  className="w-full bg-transparent text-slate-800 text-[13px] font-semibold focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <AnimatePresence>
                {showLocations && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-slate-100 rounded-xl overflow-hidden z-50 shadow-2xl"
                  >
                    <div className="p-2 space-y-0.5 max-h-64 overflow-y-auto">
                      {locations.map((loc: any, idx: number) => {
                        const locName = lang === "fr" ? (loc.nameFr || loc.name) : (loc.nameEn || loc.name);
                        return (
                          <button
                            key={loc.id ?? `${loc.city}-${idx}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setLocation(`${loc.city} — ${locName}`);
                              setShowLocations(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-colors">
                              <MapPin size={13} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">{loc.city}</p>
                              <p className="text-[9px] text-slate-400 uppercase tracking-wider">{locName}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pickup Date */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {lang === "fr" ? "Date de départ" : "Pick-up date"}
              </label>
              <div className="flex items-center gap-2 px-3 py-3 bg-[#EEF2F6] rounded-xl border border-transparent focus-within:border-amber-400 focus-within:bg-white transition-all duration-200 overflow-hidden">
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-[13px] font-semibold focus:outline-none cursor-pointer"
                />
                <Calendar size={14} className="text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* Pickup Time */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {lang === "fr" ? "Heure" : "Time"}
              </label>
              <div className="flex items-center gap-2 px-3 py-3 bg-[#EEF2F6] rounded-xl border border-transparent focus-within:border-amber-400 focus-within:bg-white transition-all duration-200 overflow-hidden">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-[13px] font-semibold focus:outline-none cursor-pointer"
                />
                <Clock size={14} className="text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* Return Date */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {lang === "fr" ? "Date de retour" : "Return date"}
              </label>
              <div className="flex items-center gap-2 px-3 py-3 bg-[#EEF2F6] rounded-xl border border-transparent focus-within:border-amber-400 focus-within:bg-white transition-all duration-200 overflow-hidden">
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-[13px] font-semibold focus:outline-none cursor-pointer"
                />
                <Calendar size={14} className="text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* Return Time */}
            <div className="md:col-span-1 space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {lang === "fr" ? "Heure" : "Time"}
              </label>
              <div className="flex items-center gap-2 px-3 py-3 bg-[#EEF2F6] rounded-xl border border-transparent focus-within:border-amber-400 focus-within:bg-white transition-all duration-200 overflow-hidden">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-[13px] font-semibold focus:outline-none cursor-pointer"
                />
                <Clock size={14} className="text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                onClick={handleSearch}
                className="w-full py-3.5 px-6 rounded-xl bg-[#16213E] hover:bg-[#0f172a] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#16213E]/20 hover:shadow-xl hover:shadow-[#16213E]/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search size={16} />
                <span>{t("hero_search_btn") || (lang === "fr" ? "Rechercher" : "Search")}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
