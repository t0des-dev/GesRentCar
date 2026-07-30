"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Clock, ChevronRight, Plane, Building2, X } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import Link from "next/link";

interface FleetHeaderProps {
  search: string;
  setSearch: (val: string) => void;
  onBookingSearch?: (params: {
    location: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => void;
}

const PREDEFINED_LOCATIONS = [
  { id: "cmn", name: "Aéroport Mohammed V (CMN)", city: "Casablanca", icon: Plane },
  { id: "casa", name: "Centre Ville", city: "Casablanca", icon: Building2 },
  { id: "rak", name: "Aéroport Menara (RAK)", city: "Marrakech", icon: Plane },
  { id: "tng", name: "Aéroport Ibn Battouta (TNG)", city: "Tanger", icon: Plane },
  { id: "rabat", name: "Centre Ville", city: "Rabat", icon: Building2 },
  { id: "fes", name: "Aéroport Saïss (FEZ)", city: "Fès", icon: Plane },
  { id: "essaouira", name: "Centre Ville", city: "Essaouira", icon: Building2 },
];

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export default function FleetHeader({ search, setSearch, onBookingSearch }: FleetHeaderProps) {
  const { t } = useTranslation();
  const agency = useAgency();

  const heroImage = agency.hero_image_url || "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1920";

  const [location, setLocation] = useState("Casablanca — Aéroport Mohammed V (CMN)");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [showLocations, setShowLocations] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const today = getTodayString();

  const handleSearch = () => {
    if (onBookingSearch) {
      onBookingSearch({ location, startDate, startTime, endDate, endTime });
    }
  };

  return (
    <div className="relative -mx-6 lg:-mx-8 -mt-36 mb-12">
      {/* Hero Background */}
      <div className="relative h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/90 via-[#0a0f1e]/70 to-[#0a0f1e]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-center">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/50 text-xs font-medium mb-6"
          >
            <Link href="/" className="hover:text-white/80 transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-white/90">Fleet</span>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[2px] bg-amber-400" />
            <span className="text-amber-400 text-[11px] font-black tracking-[0.2em] uppercase">
              {t("fleet_tag") || "Premium Fleet"}
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
            {t("fleet_title_1") || "Explorez Notre"} <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              {t("fleet_title_2") || "Flotte Premium"}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl font-medium"
          >
            {t("fleet_subtitle") || "Trouvez le véhicule parfait pour vos voyages d'affaires, vacances familiales et expériences de luxe à travers le Maroc."}
          </motion.p>
        </div>
      </div>

      {/* Booking Bar — overlapping hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-6 lg:px-8 -mt-16 relative z-20"
      >
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

            {/* Location */}
            <div className="md:col-span-3 space-y-1.5 relative">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Lieu de retrait
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
                      {PREDEFINED_LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setLocation(`${loc.city} — ${loc.name}`);
                            setShowLocations(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-colors">
                            <loc.icon size={13} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">{loc.city}</p>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">{loc.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pickup Date */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Date de retrait
              </label>
              <div className="flex items-center gap-2 px-3 py-3 bg-[#EEF2F6] rounded-xl border border-transparent focus-within:border-amber-400 focus-within:bg-white transition-all duration-200 overflow-hidden">
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-[13px] font-semibold focus:outline-none cursor-pointer"
                />
                <Calendar size={14} className="text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* Pickup Time */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Heure
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
                Date de retour
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
                Heure
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
                <span>Rechercher</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
