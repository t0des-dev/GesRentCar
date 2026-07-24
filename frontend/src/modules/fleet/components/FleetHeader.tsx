"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, CalendarDays, Clock, ChevronDown, Car, X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/shared/hooks/useTranslation";

const DESTINATIONS = [
  "Marrakech, Maroc",
  "Casablanca, Maroc",
  "Rabat, Maroc",
  "Tanger, Maroc",
  "Fès, Maroc",
  "Agadir, Maroc",
  "Meknès, Maroc",
  "Ouarzazate, Maroc",
  "Essaouira, Maroc",
  "Médina de Marrakech",
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00",
];

interface FleetHeaderProps {
  search: string;
  setSearch: (val: string) => void;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  location?: string;
  onSearch?: (params: { startDate: string; endDate: string; startTime: string; location: string }) => void;
}

export default function FleetHeader({
  search, setSearch, startDate, endDate, startTime, location, onSearch,
}: FleetHeaderProps) {
  const { t } = useTranslation();

  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");
  const [localTime, setLocalTime] = useState(startTime || "10:00");
  const [localLocation, setLocalLocation] = useState(location || "Marrakech, Maroc");

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDestFocused, setIsDestFocused] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalStartDate(startDate || "");
  }, [startDate]);
  useEffect(() => {
    setLocalEndDate(endDate || "");
  }, [endDate]);
  useEffect(() => {
    setLocalTime(startTime || "10:00");
  }, [startTime]);
  useEffect(() => {
    setLocalLocation(location || "Marrakech, Maroc");
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setIsDestFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDests = DESTINATIONS.filter(d =>
    d.toLowerCase().includes(localLocation.toLowerCase()) && d !== localLocation
  );

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        startDate: localStartDate,
        endDate: localEndDate,
        startTime: localTime,
        location: localLocation,
      });
    }
  };

  const brandSuggestions = [
    "Mercedes-Benz Classe G",
    "Porsche 911",
    "Range Rover Sport",
    "Audi RS Q8",
    "BMW M4",
    "Jeep Wrangler",
  ];
  const filteredBrandSuggestions = brandSuggestions.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative bg-[var(--navy)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] via-[#1a2747] to-[var(--navy)]" />
      <div className="absolute top-0 right-0 w-[45%] h-full opacity-[0.04]">
        <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M50 450 Q250 300 400 350 T750 200" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="600" cy="150" r="120" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M100 500 L700 500" stroke="white" strokeWidth="1" opacity="0.5"/>
        </svg>
      </div>

      <div className="relative max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-white/40 text-[13px] mb-4 font-medium">
              <Link href="/" className="hover:text-white transition-colors">{t("nav_home")}</Link>
              <ChevronDown size={12} className="rotate-[-90deg]" />
              <span className="text-white">{t("nav_fleet")}</span>
            </nav>
            <h1 className="font-[var(--font-sora)] text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em]">
              {t("fleet_title_1")} <span className="text-[var(--gold)]">{t("fleet_title_2")}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-white/50 text-[13px] font-medium">
            <span className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <Car size={16} className="text-[var(--gold)]" />
              <span className="text-white">{t("fleet_subtitle")}</span>
            </span>
          </div>
        </div>

        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-2">
          <div className="flex flex-col lg:flex-row items-stretch gap-2">
            {/* Destination */}
            <div className="flex-1 relative group min-w-0" ref={destRef}>
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10 pointer-events-none" />
              <div className="pl-11 pr-4 py-3.5 relative">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                  {t("fleet_destination")}
                </label>
                <input
                  type="text"
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                  onFocus={() => setIsDestFocused(true)}
                  className="w-full bg-transparent border-none outline-none text-[13px] font-semibold text-white placeholder:text-white/30 p-0"
                />
              </div>
              <AnimatePresence>
                {isDestFocused && filteredDests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#1e2d4a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1 max-h-48 overflow-y-auto"
                  >
                    {filteredDests.map((dest) => (
                      <button
                        key={dest}
                        onClick={() => {
                          setLocalLocation(dest);
                          setIsDestFocused(false);
                        }}
                        className="w-full text-left px-5 py-2.5 hover:bg-white/10 transition-colors flex items-center gap-3 text-[13px] font-medium text-white"
                      >
                        <MapPin size={13} className="text-[var(--gold)]" />
                        {dest}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute left-[52px] top-1/2 -translate-y-1/2 w-px h-8 bg-white/10 hidden lg:block" />
            </div>

            {/* Start Date */}
            <div className="flex-1 relative group min-w-0">
              <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10 pointer-events-none" />
              <div className="pl-11 pr-4 py-3.5 relative">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                  {t("start_date")}
                </label>
                <input
                  type="date"
                  value={localStartDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setLocalStartDate(e.target.value);
                    if (e.target.value && localEndDate && e.target.value > localEndDate) {
                      setLocalEndDate("");
                    }
                  }}
                  className="w-full bg-transparent border-none outline-none text-[13px] font-semibold text-white p-0 cursor-pointer premium-date-input"
                />
                {!localStartDate && (
                  <span className="absolute left-11 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-white/30 pointer-events-none">
                    {formatDateDisplay(startDate) || t("start_date")}
                  </span>
                )}
              </div>
              <div className="absolute left-[52px] top-1/2 -translate-y-1/2 w-px h-8 bg-white/10 hidden lg:block" />
            </div>

            {/* End Date */}
            <div className="flex-1 relative group min-w-0">
              <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10 pointer-events-none" />
              <div className="pl-11 pr-4 py-3.5 relative">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                  {t("end_date")}
                </label>
                <input
                  type="date"
                  value={localEndDate}
                  min={localStartDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setLocalEndDate(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[13px] font-semibold text-white p-0 cursor-pointer premium-date-input"
                />
                {!localEndDate && (
                  <span className="absolute left-11 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-white/30 pointer-events-none">
                    {formatDateDisplay(endDate) || t("end_date")}
                  </span>
                )}
              </div>
              <div className="absolute left-[52px] top-1/2 -translate-y-1/2 w-px h-8 bg-white/10 hidden lg:block" />
            </div>

            {/* Time */}
            <div className="flex-1 relative group min-w-0">
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10 pointer-events-none" />
              <div className="pl-11 pr-4 py-3.5">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                  {t("fleet_hour")}
                </label>
                <select
                  value={localTime}
                  onChange={(e) => setLocalTime(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[13px] font-semibold text-white p-0 cursor-pointer appearance-none"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-[#1e2d4a] text-white">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-[var(--gold)] hover:brightness-110 text-[var(--navy)] font-bold rounded-xl px-8 py-4 text-[12px] tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Search size={16} />
              {t("fleet_search_btn")}
            </button>
          </div>
        </div>

        {/* Brand/Model Text Search */}
        <div className="relative mt-8">
          <div className="relative group max-w-xl mx-auto lg:mx-0">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[var(--gold)] transition-colors z-10" />
            <input
              type="text"
              placeholder={t("fleet_search_brand")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-12 pr-5 py-3.5 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl text-white text-[13px] font-medium focus:outline-none focus:bg-white/[0.1] focus:border-[var(--gold)]/40 focus:ring-2 focus:ring-[var(--gold)]/10 transition-all placeholder:text-white/30 placeholder:font-medium"
            />

            <AnimatePresence>
              {isSearchFocused && search.length > 0 && filteredBrandSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-2"
                >
                  <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Suggestions</p>
                  {filteredBrandSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setSearch(suggestion)}
                      className="w-full text-left px-5 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 text-[13px] font-medium text-white"
                    >
                      <Search size={14} className="text-white/30" />
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
