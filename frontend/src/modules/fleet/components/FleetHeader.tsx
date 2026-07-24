"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, CalendarDays, Clock, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/shared/hooks/useTranslation";

const DESTINATIONS = [
  "Casablanca — Mohammed V Airport",
  "Marrakech — Menara Airport",
  "Rabat — Salé Airport",
  "Tanger — Ibn Battouta Airport",
  "Agadir — Al Massira Airport",
  "Fès — Saïss Airport",
  "Marrakech, Maroc",
  "Casablanca, Maroc",
  "Rabat, Maroc",
  "Tanger, Maroc",
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00",
];

interface FleetHeaderConfig {
  hero_image?: string;
  hero_badge?: string;
  hero_title?: string;
  hero_subtitle?: string;
  search_button_text?: string;
  default_location?: string;
}

interface FleetHeaderProps {
  search: string;
  setSearch: (val: string) => void;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  location?: string;
  config?: FleetHeaderConfig;
  onSearch?: (params: { startDate: string; endDate: string; startTime: string; location: string }) => void;
}

export default function FleetHeader({
  search, setSearch, startDate, endDate, startTime, location, config, onSearch,
}: FleetHeaderProps) {
  const { t } = useTranslation();

  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");
  const [localStartTime, setLocalStartTime] = useState(startTime || "10:00");
  const [localEndTime, setLocalEndTime] = useState("10:00");
  const [localLocation, setLocalLocation] = useState(location || config?.default_location || DESTINATIONS[0]);

  const [isDestFocused, setIsDestFocused] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalStartDate(startDate || ""); }, [startDate]);
  useEffect(() => { setLocalEndDate(endDate || ""); }, [endDate]);
  useEffect(() => { setLocalStartTime(startTime || "10:00"); }, [startTime]);
  useEffect(() => { setLocalLocation(location || config?.default_location || DESTINATIONS[0]); }, [location, config?.default_location]);

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

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        startDate: localStartDate,
        endDate: localEndDate,
        startTime: localStartTime,
        location: localLocation,
      });
    }
  };

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="relative h-[340px] overflow-hidden">
        {config?.hero_image ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${config.hero_image}')` }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/fleet-hero.jpg')" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/80 via-[#0a0f1a]/50 to-transparent" />

        <div className="relative z-10 max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 h-full flex flex-col justify-center pt-8">
          <nav className="flex items-center gap-2 text-white/50 text-[13px] mb-5 font-medium">
            <Link href="/" className="hover:text-white transition-colors">{t("nav_home")}</Link>
            <span className="text-white/30">/</span>
            <span className="text-white">{t("nav_fleet")}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)] text-[11px] font-bold uppercase tracking-[0.2em]">
              {config?.hero_badge || "Premium Fleet"}
            </span>
          </div>

          <h1 className="font-[var(--font-instrument-serif)] text-[clamp(32px,4.5vw,52px)] font-medium text-white leading-[1.15] mb-4 max-w-[520px]">
            {config?.hero_title || "Explore Our Vehicle Fleet"}
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-[480px]">
            {config?.hero_subtitle || "Find the perfect vehicle for business trips, family vacations and luxury experiences across Morocco."}
          </p>
        </div>
      </div>

      {/* Search Booking Bar */}
      <div className="relative z-20 max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 -mt-8">
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-2">
          <div className="flex flex-col lg:flex-row items-stretch gap-0">
            {/* Pickup Location */}
            <div className="flex-1 relative min-w-0 border-b lg:border-b-0 lg:border-r border-gray-100" ref={destRef}>
              <div className="px-5 py-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                  onFocus={() => setIsDestFocused(true)}
                  className="w-full bg-transparent border-none outline-none text-[13.5px] font-semibold text-gray-900 p-0 placeholder:text-gray-400"
                />
              </div>
              <AnimatePresence>
                {isDestFocused && filteredDests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 py-1 max-h-52 overflow-y-auto"
                  >
                    {filteredDests.map((dest) => (
                      <button
                        key={dest}
                        onClick={() => { setLocalLocation(dest); setIsDestFocused(false); }}
                        className="w-full text-left px-5 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3 text-[13px] font-medium text-gray-700"
                      >
                        <MapPin size={13} className="text-gray-400" />
                        {dest}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pickup Date */}
            <div className="flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="px-5 py-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={localStartDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setLocalStartDate(e.target.value);
                    if (e.target.value && localEndDate && e.target.value > localEndDate) setLocalEndDate("");
                  }}
                  className="w-full bg-transparent border-none outline-none text-[13.5px] font-semibold text-gray-900 p-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Pickup Time */}
            <div className="flex-shrink-0 w-[130px] border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="px-5 py-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1">
                  Pickup Time
                </label>
                <select
                  value={localStartTime}
                  onChange={(e) => setLocalStartTime(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[13.5px] font-semibold text-gray-900 p-0 cursor-pointer appearance-none"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Return Date */}
            <div className="flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="px-5 py-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  value={localEndDate}
                  min={localStartDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setLocalEndDate(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[13.5px] font-semibold text-gray-900 p-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Return Time */}
            <div className="flex-shrink-0 w-[130px] border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="px-5 py-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1">
                  Return Time
                </label>
                <select
                  value={localEndTime}
                  onChange={(e) => setLocalEndTime(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[13.5px] font-semibold text-gray-900 p-0 cursor-pointer appearance-none"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-center px-2">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto bg-[var(--navy)] hover:bg-[#1a2747] text-white font-semibold rounded-xl px-8 py-4 text-[13px] tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Search size={16} />
                {config?.search_button_text || "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
