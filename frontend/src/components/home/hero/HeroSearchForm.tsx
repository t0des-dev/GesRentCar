"use client";

import { motion, MotionValue } from "framer-motion";
import { useState } from "react";

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
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

const PREDEFINED_LOCATIONS = [
  { id: "cmn", name: "Aéroport Mohammed V (CMN)", city: "Casablanca" },
  { id: "casa", name: "Centre Ville", city: "Casablanca" },
  { id: "rak", name: "Aéroport Menara (RAK)", city: "Marrakech" },
  { id: "tng", name: "Aéroport Ibn Battouta (TNG)", city: "Tanger" },
  { id: "rabat", name: "Centre Ville", city: "Rabat" },
];

const CATEGORIES = [
  { id: "all", label: "Any category" },
  { id: "economy", label: "Economy" },
  { id: "compact", label: "Compact" },
  { id: "suv", label: "SUV" },
  { id: "luxury", label: "Luxury" },
  { id: "utility", label: "Utility" },
];

export default function HeroSearchForm({
  location, setLocation, startDate, setStartDate, endDate, setEndDate,
  startTime, setStartTime, onSearch, y1, mounted,
}: HeroSearchFormProps) {
  const today = getTodayString();
  const [category, setCategory] = useState("all");
  const [returnTime, setReturnTime] = useState("10:00");

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className="lg:col-span-5 w-full max-w-[420px] lg:ml-auto"
    >
      <div className="bg-white rounded-[28px] p-7 md:p-8 shadow-2xl border border-gray-100/90 text-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight">Reserve your vehicle</h3>
        <p className="text-xs text-gray-400 font-medium mb-6">Confirmed in under 2 minutes.</p>

        <div className="space-y-4">
          {/* PICK-UP LOCATION */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5 block">
              PICK-UP LOCATION
            </label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 appearance-none focus:bg-white focus:border-[#182232] outline-none transition-all cursor-pointer"
            >
              <option value="">Casablanca — Mohammed V Airport</option>
              {PREDEFINED_LOCATIONS.map(loc => (
                <option key={loc.id} value={`${loc.city} - ${loc.name}`}>
                  {loc.city} — {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* PICK-UP DATE & PICK-UP TIME */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5 block">
                PICK-UP DATE
              </label>
              <input
                type="date"
                value={startDate}
                min={today}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-3 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#182232] transition-all [color-scheme:light]"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5 block">
                PICK-UP TIME
              </label>
              <input
                type="time"
                value={startTime || "10:00"}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-3 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#182232] transition-all [color-scheme:light]"
              />
            </div>
          </div>

          {/* RETURN DATE & RETURN TIME */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5 block">
                RETURN DATE
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-3 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#182232] transition-all [color-scheme:light]"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5 block">
                RETURN TIME
              </label>
              <input
                type="time"
                value={returnTime}
                onChange={e => setReturnTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-3 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#182232] transition-all [color-scheme:light]"
              />
            </div>
          </div>

          {/* VEHICLE CATEGORY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5 block">
              VEHICLE CATEGORY
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 appearance-none focus:bg-white focus:border-[#182232] outline-none transition-all cursor-pointer"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* CHECK AVAILABILITY BUTTON */}
          <button
            onClick={onSearch}
            className="w-full bg-[#182232] hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-sm transition-all duration-300 shadow-md hover:shadow-lg mt-2 cursor-pointer"
          >
            Check availability
          </button>
        </div>
      </div>
    </motion.div>
  );
}

