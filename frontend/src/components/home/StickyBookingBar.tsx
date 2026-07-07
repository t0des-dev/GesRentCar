"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { MapPin, Calendar, Search, ChevronUp } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface StickyBookingBarProps {
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
  content?: {
    placeholder?: string;
    search_label?: string;
  };
}

export default function StickyBookingBar({
  location, setLocation, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, onSearch,
  content = {}
}: StickyBookingBarProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setVisible(latest > window.innerHeight * 0.8);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const today = new Date().toISOString().split("T")[0];
  const placeholder = content?.placeholder || "Destination";
  const searchLabel = content?.search_label || "Rechercher";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
          <div className="bg-ink-1/95 backdrop-blur-xl border-t border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex-1 flex items-center gap-2.5 bg-ink-2 rounded-xl px-4 py-3 text-ink-3 text-sm"
              >
                <MapPin size={16} className="text-primary shrink-0" />
                <span className="truncate text-white/70">{location || placeholder}</span>
                {startDate && (
                  <>
                    <span className="text-ink-4">|</span>
                    <Calendar size={14} className="text-primary/60 shrink-0" />
                    <span className="truncate text-xs text-ink-3">
                      {new Date(startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      {endDate && ` - ${new Date(endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`}
                    </span>
                  </>
                )}
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onSearch}
                className="bg-primary text-white p-3.5 rounded-xl shadow-lg shadow-primary/20 shrink-0"
                aria-label={searchLabel}
              >
                <Search size={18} />
              </motion.button>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2 space-y-3">
                    <div className="flex items-center gap-3 bg-ink-2 rounded-xl px-4 py-3">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-transparent text-white text-sm w-full focus:outline-none placeholder:text-ink-3"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-ink-2 rounded-xl px-4 py-3">
                        <Calendar size={16} className="text-primary/60 shrink-0" />
                        <input
                          type="date"
                          value={startDate}
                          min={today}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-transparent text-white text-sm w-full focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-ink-2 rounded-xl px-4 py-3">
                        <Calendar size={16} className="text-primary/60 shrink-0" />
                        <input
                          type="date"
                          value={endDate}
                          min={startDate || today}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-transparent text-white text-sm w-full focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-ink-2 rounded-xl px-4 py-3">
                        <span className="text-primary/60 shrink-0 text-sm">🕐</span>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-transparent text-white text-sm w-full focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-ink-2 rounded-xl px-4 py-3">
                        <span className="text-primary/60 shrink-0 text-sm">🕐</span>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="bg-transparent text-white text-sm w-full focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={onSearch}
                      variant="default"
                      size="lg"
                      className="w-full rounded-xl"
                    >
                      {searchLabel}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
