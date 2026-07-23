"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, CalendarDays, Clock, ChevronDown, Car } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface FleetHeaderProps {
  search: string;
  setSearch: (val: string) => void;
  startDate?: string;
  endDate?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function FleetHeader({ search, setSearch, startDate, endDate }: FleetHeaderProps) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    "Mercedes-Benz Classe G",
    "Porsche 911",
    "Range Rover Sport",
    "Audi RS Q8",
    "BMW M4",
    "Jeep Wrangler"
  ];

  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(search.toLowerCase()));

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
            <div className="flex-1 relative group min-w-0">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10" />
              <div className="pl-11 pr-4 py-3.5">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{t("fleet_destination")}</label>
                <div className="text-[13px] font-semibold text-white flex items-center gap-1">
                  Marrakech, Maroc <ChevronDown size={14} className="text-white/40" />
                </div>
              </div>
              <div className="absolute left-[52px] top-1/2 -translate-y-1/2 w-px h-8 bg-white/10 hidden lg:block" />
            </div>

            <div className="flex-1 relative group min-w-0">
              <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10" />
              <div className="pl-11 pr-4 py-3.5">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{t("start_date")}</label>
                <div className="text-[13px] font-semibold text-white">
                  {formatDate(startDate)}
                </div>
              </div>
              <div className="absolute left-[52px] top-1/2 -translate-y-1/2 w-px h-8 bg-white/10 hidden lg:block" />
            </div>

            <div className="flex-1 relative group min-w-0">
              <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10" />
              <div className="pl-11 pr-4 py-3.5">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{t("end_date")}</label>
                <div className="text-[13px] font-semibold text-white">
                  {formatDate(endDate)}
                </div>
              </div>
              <div className="absolute left-[52px] top-1/2 -translate-y-1/2 w-px h-8 bg-white/10 hidden lg:block" />
            </div>

            <div className="flex-1 relative group min-w-0">
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] z-10" />
              <div className="pl-11 pr-4 py-3.5">
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{t("fleet_hour")}</label>
                <div className="text-[13px] font-semibold text-white">10:00</div>
              </div>
            </div>

            <button className="bg-[var(--gold)] hover:brightness-110 text-[var(--navy)] font-bold rounded-xl px-8 py-4 text-[12px] tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer">
              <Search size={16} />
              {t("fleet_search_btn")}
            </button>
          </div>
        </div>

        <div className="relative mt-8">
          <div className="relative group max-w-xl mx-auto lg:mx-0">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[var(--gold)] transition-colors z-10" />
            <input
              type="text"
              placeholder={t("fleet_search_brand")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full pl-12 pr-5 py-3.5 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl text-white text-[13px] font-medium focus:outline-none focus:bg-white/[0.1] focus:border-[var(--gold)]/40 focus:ring-2 focus:ring-[var(--gold)]/10 transition-all placeholder:text-white/30 placeholder:font-medium"
            />

            <AnimatePresence>
              {isFocused && search.length > 0 && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-2"
                >
                  <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Suggestions</p>
                  {filteredSuggestions.map((suggestion, i) => (
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
