"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X } from "lucide-react";

export default function RecentBookingPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [bookingData, setBookingData] = useState<{ car: string; location: string } | null>(null);

  const mockBookings = [
    { car: "Range Rover Sport", location: "Casablanca" },
    { car: "Mercedes G-Class", location: "Marrakech" },
    { car: "Audi RS Q8", location: "Rabat" },
    { car: "Porsche Panamera", location: "Tanger" },
    { car: "BMW X5", location: "Agadir" },
  ];

  useEffect(() => {
    // Show randomly between 15s and 30s
    const timeout = setTimeout(() => {
      const randomBooking = mockBookings[Math.floor(Math.random() * mockBookings.length)];
      setBookingData(randomBooking);
      setIsVisible(true);

      // Hide after 8s
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    }, 15000 + Math.random() * 15000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && bookingData && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-[60] bg-slate-900 border border-slate-700 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-xs"
        >
          <div className="bg-primary/20 text-primary p-2 rounded-full shrink-0">
            <BellRing size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
              Réservation Récente
            </p>
            <p className="text-sm font-medium leading-tight">
              Un <span className="text-gold font-bold">{bookingData.car}</span> vient d'être loué à {bookingData.location}.
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-slate-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
