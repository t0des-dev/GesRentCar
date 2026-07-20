"use client";

import { motion, MotionValue } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
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
  { id: "all", label: "All categories" },
  { id: "berline", label: "Berline" },
  { id: "suv", label: "SUV" },
  { id: "van", label: "Van / Minivan" },
  { id: "luxe", label: "Luxe" },
  { id: "sport", label: "Sportive" },
  { id: "electrique", label: "Électrique" },
];

export default function HeroSearchForm({
  location, setLocation, startDate, setStartDate, endDate, setEndDate,
  startTime, setStartTime, onSearch, y1, mounted,
}: HeroSearchFormProps) {
  const today = getTodayString();
  const [category, setCategory] = useState("all");

  return (
    <motion.div
      style={mounted ? { y: y1 } : {}}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className="lg:col-span-5"
    >
      <div className="booking-card">
        <h3 className="booking-card-title">Reserve your vehicle</h3>
        <p className="booking-card-sub">Choose your dates, we handle the rest.</p>

        <div className="booking-form">

          {/* Location */}
          <div className="booking-field relative">
            <label className="booking-label">Pick-up location</label>
            <div className="booking-input-wrap">
              <MapPin size={16} className="booking-icon" />
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="booking-input"
              >
                <option value="">Ville, aéroport...</option>
                {PREDEFINED_LOCATIONS.map(loc => (
                  <option key={loc.id} value={`${loc.city} - ${loc.name}`}>
                    {loc.city} — {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Time row */}
          <div className="booking-row">
            <div className="booking-field">
              <label className="booking-label">Pick-up date</label>
              <div className="booking-input-wrap">
                <Calendar size={16} className="booking-icon" />
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                  className="booking-input [color-scheme:light]"
                />
              </div>
            </div>
            <div className="booking-field">
              <label className="booking-label">Return date</label>
              <div className="booking-input-wrap">
                <Calendar size={16} className="booking-icon" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => setEndDate(e.target.value)}
                  className="booking-input [color-scheme:light]"
                />
              </div>
            </div>
          </div>

          <div className="booking-row">
            <div className="booking-field">
              <label className="booking-label">Pick-up time</label>
              <div className="booking-input-wrap">
                <Clock size={16} className="booking-icon" />
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="booking-input [color-scheme:light]"
                />
              </div>
            </div>
            <div className="booking-field">
              <label className="booking-label">Vehicle category</label>
              <div className="booking-input-wrap">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="booking-input"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={onSearch}
            className="btn-booking-submit"
          >
            Check availability
          </button>
        </div>
      </div>
    </motion.div>
  );
}
