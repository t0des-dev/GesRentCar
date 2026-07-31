"use client";

import { useEffect, useState } from "react";
import { Check, FileText, Clock, AlertTriangle, MapPin, Phone, MessageCircle, Download, Copy, Calendar, Shield, Plane, Headphones, Car } from "lucide-react";
import { BookingState } from "@/types/booking";
import confetti from "canvas-confetti";
import { fmt } from "@/shared/utils/format";
import { motion } from "framer-motion";
import Link from "next/link";

interface ConfirmationVehicle {
  brand?: string;
  model?: string;
  img?: string;
  category?: string;
  price?: number;
}

interface ConfirmationViewProps {
  booking: BookingState;
  reservationId: number | null;
  reservationStatus?: string;
  deposit: number;
  total: number;
  vehicle?: ConfirmationVehicle | null;
}

export default function ConfirmationView({ booking, reservationId, reservationStatus, deposit, total, vehicle }: ConfirmationViewProps) {
  const isPartnerPending = reservationStatus === "pending_partner";

  useEffect(() => {
    if (isPartnerPending) return;
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    return () => clearInterval(interval);
  }, [isPartnerPending]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  const contractUrl = reservationId
    ? `${apiBase}/public/reservations/${reservationId}/contract`
    : null;

  const formatDate = (d?: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatDateFull = (d?: string) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const days = (() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const diff = Math.abs(new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const vehicleRental = (vehicle?.price || 0) * (days || 1);
  const extras = 0;
  const insurance = 0;

  const refNumber = reservationId ? `ART-${String(reservationId).padStart(3, "0")}-2026` : "ART-000-2026";

  if (isPartnerPending) {
    return (
      <main className="min-h-screen py-24 flex items-center justify-center bg-[#fafbfc]">
        <div className="text-center flex flex-col items-center gap-8 max-w-lg mx-auto px-6">
          <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center border-2 border-amber-200">
            <Clock size={40} className="text-amber-500" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Réservation en attente</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Votre réservation pour le <strong className="text-gray-900">{vehicle?.brand} {vehicle?.model}</strong> est en cours de validation auprès du partenaire.
          </p>
          <a href="/" className="w-full py-4 bg-[#16213E] text-white rounded-2xl text-sm font-bold uppercase tracking-wider text-center hover:bg-[#1a2744] transition-all">
            Retour à l&apos;accueil
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-16">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-4 mb-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-between">
            {["Reservation", "Vehicle", "Confirmation", "Payment", "Complete"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= 3 ? "bg-[#16213E] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < 3 ? <Check size={12} strokeWidth={3} /> : i === 3 ? "4" : "5"}
                </div>
                <span className={`text-xs font-semibold hidden md:block ${i <= 3 ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl space-y-10">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <Check size={36} className="text-emerald-600" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-black text-gray-900">Reservation Confirmed</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Your reservation has been successfully processed. A confirmation email has been sent to your email address.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-sm text-gray-500">Reference</span>
            <span className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{refNumber}</span>
            <button onClick={() => navigator.clipboard.writeText(refNumber)} className="text-xs font-semibold text-[#16213E] hover:underline">Copy</button>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">{formatDateFull(booking.startDate)}</span>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              <Check size={12} strokeWidth={3} /> Confirmed
            </span>
          </div>
        </motion.div>

        {/* Reservation Summary */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">Reservation Summary</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-20 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <img
                  src={vehicle?.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
                  alt={vehicle?.model || ""}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-0.5">{vehicle?.category || "Luxury Sedan"}</p>
                <h3 className="text-lg font-black text-gray-900">{vehicle?.brand} {vehicle?.model || "Similar"}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pickup Location</p>
                <p className="text-sm font-semibold text-gray-900">{booking.location || "Casablanca — Mohammed V Airport"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Return Location</p>
                <p className="text-sm font-semibold text-gray-900">{booking.location || "Casablanca — Mohammed V Airport"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pickup Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(booking.startDate)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Return Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(booking.endDate)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pickup Time</p>
                <p className="text-sm font-semibold text-gray-900">10:00</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Return Time</p>
                <p className="text-sm font-semibold text-gray-900">10:00</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Rental Duration</p>
                <p className="text-sm font-semibold text-gray-900">{days} Days</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Payment Summary */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">Payment Summary</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Vehicle Rental ({days} {days > 1 ? "Days" : "Day"})</span>
              <span className="text-sm font-semibold text-gray-900">{fmt(vehicleRental)} MAD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Extras</span>
              <span className="text-sm font-semibold text-gray-900">0 MAD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Insurance</span>
              <span className="text-sm font-semibold text-gray-900">Not included</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Taxes</span>
              <span className="text-sm font-semibold text-gray-900">Included</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">Total Rental</span>
              <span className="text-xl font-black text-gray-900">{fmt(total || vehicleRental)} MAD</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-gray-900">Deposit Paid Today</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">Remaining balance {fmt((total || vehicleRental) - deposit)} MAD — payable upon vehicle pickup.</p>
                </div>
                <span className="text-lg font-black text-emerald-600">{fmt(deposit)} MAD</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* What's Next? */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">What&apos;s Next?</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="space-y-6">
              {[
                { label: "Reservation Confirmed", desc: "Your reservation is confirmed and paid.", active: true, icon: Check },
                { label: "Confirmation Email Sent", desc: "A confirmation has been sent to your email.", active: true, icon: FileText },
                { label: "We're Preparing Your Vehicle", desc: "Our team is preparing your vehicle for pickup.", active: true, icon: Car },
                { label: "Vehicle Ready for Pickup", desc: "Your vehicle will be ready at the scheduled time.", active: false, icon: MapPin },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step.active ? "bg-[#16213E] text-white" : "bg-gray-200 text-gray-500"}`}>
                      <step.icon size={16} strokeWidth={2.5} />
                    </div>
                    {i < 3 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                  </div>
                  <div className="pt-2">
                    <p className={`text-sm font-bold ${step.active ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Airport Pickup Preference */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">Airport Pickup Preference</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Time</label>
                <input type="time" defaultValue="10:00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#16213E] [color-scheme:light]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Flight Number (Optional)</label>
                <input type="text" placeholder="e.g. AT 200" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16213E]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">We will monitor your flight and adjust pickup time if your flight is delayed.</p>
          </div>
        </motion.section>

        {/* Customer Information */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">Customer Information</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                <input type="text" defaultValue={booking.client.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#16213E]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone</label>
                <input type="tel" defaultValue={booking.client.phone} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#16213E]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                <input type="email" defaultValue={booking.client.email} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#16213E]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">CIN / Passport</label>
                <input type="text" defaultValue={(booking.client as any).cin} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#16213E]" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Driver License</label>
              <input type="text" defaultValue={(booking.client as any).license} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#16213E] max-w-md" />
            </div>
          </div>
        </motion.section>

        {/* Vehicle Pickup Information */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">Vehicle Pickup Information</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#16213E] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Vectoria Car Rental — Mohammed V Airport</p>
                    <p className="text-xs text-gray-500">Terminal 1, Arrivals Hall, Casablanca, Morocco</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-[#16213E] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Open 24/7</p>
                    <p className="text-xs text-gray-500">Available every day including holidays</p>
                  </div>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Mohammed+V+Airport+Casablanca"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all shrink-0"
              >
                <MapPin size={16} />
                View on Google Maps
              </a>
            </div>
          </div>
        </motion.section>

        {/* Reservation Documents */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">Reservation Documents</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            {[
              { label: "Rental Confirmation", icon: FileText, url: contractUrl },
              { label: "Insurance Certificate", icon: Shield, url: null },
              { label: "Rental Terms", icon: FileText, url: "/terms" },
              { label: "Invoice", icon: FileText, url: null },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <doc.icon size={16} className="text-gray-500" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{doc.label}</span>
                </div>
                {doc.url ? (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[#16213E] hover:underline">
                    <Download size={14} /> Download
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">Pending</span>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Need Help? */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h2 className="text-xl font-black text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-3 gap-4">
            <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 py-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <MessageCircle size={20} className="text-emerald-600" />
              </div>
              <span className="text-sm font-bold text-gray-900">WhatsApp</span>
            </a>
            <a href="tel:+212600000000" className="flex flex-col items-center gap-3 py-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone size={20} className="text-blue-600" />
              </div>
              <span className="text-sm font-bold text-gray-900">Call Us</span>
            </a>
            <div className="flex flex-col items-center gap-3 py-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-[#16213E]/10 flex items-center justify-center">
                <MessageCircle size={20} className="text-[#16213E]" />
              </div>
              <span className="text-sm font-bold text-gray-900">Chat</span>
            </div>
          </div>
        </motion.section>

        {/* Inclusions */}
        <div className="flex flex-wrap justify-center gap-6 py-6">
          {[
            { icon: Shield, label: "Secure Payment" },
            { icon: Shield, label: "Insurance Coverage" },
            { icon: Headphones, label: "24/7 Support" },
            { icon: Plane, label: "Airport Delivery" },
            { icon: Check, label: "Free Cancellation" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <item.icon size={14} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col md:flex-row gap-3 justify-center pb-8">
          <Link href="/fleet" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-all text-center">
            Modify Reservation
          </Link>
          <Link href="/" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-all text-center">
            Return to Homepage
          </Link>
          <Link href="/fleet" className="px-6 py-3 bg-[#16213E] text-white rounded-2xl text-sm font-bold hover:bg-[#1a2744] transition-all text-center">
            Browse More Vehicles
          </Link>
        </div>
      </div>
    </main>
  );
}
