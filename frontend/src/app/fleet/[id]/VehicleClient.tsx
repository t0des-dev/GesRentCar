"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, Gauge, Fuel, Users, Calendar, ArrowRight, Check, Loader2, MapPin, Clock, Phone, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { fmt } from "@/shared/utils/format";
import ReviewSection from "@/components/ReviewSection";
import Vehicle360Viewer from "@/components/Vehicle360Viewer";
import WaitlistButton from "@/components/WaitlistButton";

export default function VehicleClient() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [similarVehicles, setSimilarVehicles] = useState<any[]>([]);

  const [pickupDate, setPickupDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem('vrc_search_start') || "";
  });
  const [returnDate, setReturnDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem('vrc_search_end') || "";
  });
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState("Casablanca — Mohammed V Airport");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${params.id}`);
        setVehicle(res.data.data || res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchVehicle();
  }, [params.id]);

  useEffect(() => {
    if (!vehicle) return;
    const fetchSimilar = async () => {
      try {
        const res = await api.get(`/vehicles?per_page=4&category=${vehicle.category || 'luxury'}`);
        const data = res.data.data || res.data;
        setSimilarVehicles((Array.isArray(data) ? data : []).filter((v: any) => v.id !== vehicle.id).slice(0, 3));
      } catch {}
    };
    fetchSimilar();
  }, [vehicle]);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const totalPrice = days * (vehicle?.price_per_day || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-0">
        <Loader2 className="animate-spin text-gold" size={48} />
        <p className="mt-4 text-ink-3 font-medium">Chargement du véhicule...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-0 text-center">
        <h1 className="text-4xl font-bold text-ink-1 mb-4">Véhicule introuvable</h1>
        <p className="text-ink-3 mb-6">Le véhicule demandé n'existe pas ou a été supprimé.</p>
        <Link href="/fleet" className="px-6 py-3 bg-gold text-ink-1 font-bold rounded-lg hover:bg-gold/90 transition-all">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${vehicle.brand} ${vehicle.model}`,
    "brand": { "@type": "Brand", "name": vehicle.brand },
    "model": vehicle.model,
    "vehicleEngine": { "@type": "EngineSpecification", "fuelType": vehicle.fuel_type },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "MAD",
      "price": vehicle.price_per_day,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": vehicle.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="min-h-screen bg-surface-0 text-ink-1 selection:bg-gold/30 pb-24 relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[85vh] min-h-[600px] w-full overflow-hidden"
      >
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        <img 
          src={getImageUrl(vehicle.image_url) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"} 
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onClick={() => router.back()} 
          className="absolute top-28 left-6 md:left-12 z-20 flex items-center gap-2 bg-white/15 backdrop-blur-xl px-6 py-3 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/30 transition-all duration-300 hover:bg-gold hover:text-white group"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </motion.button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-24">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-4xl space-y-6"
            >
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gold rounded-full" />
                <span className="text-gold font-bold text-sm uppercase tracking-widest">
                  {vehicle.brand}
                </span>
              </div>

              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="display-xl text-white leading-tight font-serif"
              >
                {vehicle.model}
              </motion.h1>

              {/* Rating + Category */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center gap-6 flex-wrap"
              >
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold text-white">
                  <Star size={16} className="text-gold fill-gold" />
                  <span>4.9 / 5.0</span>
                </div>
                <span className="text-white/80 font-bold uppercase tracking-wider text-xs bg-white/10 px-4 py-2 rounded-full">
                  {t(`cat_${(vehicle.type || 'LUXURY').toLowerCase()}`)}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Left Content — 2/3 */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Specifications */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <p className="section-eyebrow mb-8">Spécifications Techniques</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Users, label: "Places", value: `${vehicle.seats || 5}` },
                  { icon: Gauge, label: "Transmission", value: vehicle.transmission || "Automatique" },
                  { icon: Fuel, label: "Carburant", value: vehicle.fuel_type || "Diesel" },
                  { icon: ShieldCheck, label: "Catégorie", value: "Premium" },
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-br from-surface-1 to-surface-2 border-2 border-border p-6 rounded-xl hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group"
                  >
                    <spec.icon size={28} className="text-gold mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-2 block">{spec.label}</span>
                    <span className="text-xl font-bold text-ink-1">{spec.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Equipment Badges */}
              {(() => {
                const equipmentList: { active?: boolean; label: string; className: string; path: React.ReactNode }[] = [
                  { active: vehicle.gps, label: "GPS", className: "bg-emerald-50 border-emerald-200 text-emerald-700", path: <><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></> },
                  { active: vehicle.air_conditioning, label: "Climatiseur", className: "bg-sky-50 border-sky-200 text-sky-700", path: <><path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z"/><path d="M6 10v2a6 6 0 0 0 12 0v-2"/><line x1="12" x2="12" y1="18" y2="22"/></> },
                  { active: vehicle.bluetooth, label: "Bluetooth", className: "bg-blue-50 border-blue-200 text-blue-700", path: <><path d="M6.5 6.5l11 11"/><path d="M21 3l-3.5 3.5"/><path d="M17 7l-1.5 1.5"/><path d="M3 21l3.5-3.5"/><path d="M7 17l1.5-1.5"/><path d="M14.5 6.5L8 13v4l6.5-6.5"/></> },
                  { active: vehicle.rear_camera, label: "Caméra recul", className: "bg-violet-50 border-violet-200 text-violet-700", path: <><path d="M2 10s3-3 5-3 5 3 5 3-3 3-5 3-5-3-5-3Z"/><circle cx="7" cy="10" r="1"/><path d="M16 10h4v4h-4z"/></> },
                  { active: vehicle.carplay, label: "CarPlay / Android", className: "bg-indigo-50 border-indigo-200 text-indigo-700", path: <><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></> },
                  { active: vehicle.isofix, label: "ISOFIX", className: "bg-amber-50 border-amber-200 text-amber-700", path: <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></> },
                  { active: vehicle.cruise_control, label: "Régulateur", className: "bg-teal-50 border-teal-200 text-teal-700", path: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
                  { active: vehicle.sunroof, label: "Toit ouvrant", className: "bg-pink-50 border-pink-200 text-pink-700", path: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
                  { active: vehicle.leather_seats, label: "Sièges cuir", className: "bg-purple-50 border-purple-200 text-purple-700", path: <><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/></> },
                  { active: vehicle.electric_windows, label: "Vitres élec.", className: "bg-cyan-50 border-cyan-200 text-cyan-700", path: <><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" x2="12" y1="4" y2="20"/><line x1="2" x2="22" y1="12" y2="12"/></> },
                ].filter(e => e.active);
                if (equipmentList.length === 0) return null;
                return (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {equipmentList.map((eq, i) => (
                      <span key={i} className={`inline-flex items-center gap-2 px-4 py-2 border-2 text-xs font-bold uppercase tracking-wider rounded-xl ${eq.className}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          {eq.path}
                        </svg>
                        {eq.label}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </motion.section>

            {/* Experience Description */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="section-eyebrow">Expérience de Conduite</p>
              <p className="body-lg text-ink-2 leading-relaxed font-light">
                Le {vehicle.brand} {vehicle.model} redéfinit le luxe et la performance. 
                Conçu pour offrir une expérience de conduite inégalée, ce véhicule allie une technologie de pointe 
                à un confort absolu. Que ce soit pour un voyage d'affaires à Casablanca ou une escapade 
                à Marrakech, voyagez avec l'élégance et le prestige de Vectoria.
              </p>
            </motion.section>

            {/* Inclusions */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-8"
            >
              <p className="section-eyebrow">Inclus dans la Location</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  "Assurance tous risques (Premium)",
                  "Kilométrage illimité",
                  "Assistance routière 24/7",
                  "Deuxième conducteur gratuit",
                  "Nettoyage intégral avant livraison",
                  "Conciergerie dédiée",
                  ...(vehicle.gps ? ["GPS intégré"] : []),
                  ...(vehicle.air_conditioning ? ["Climatisation automatique"] : []),
                  ...(vehicle.bluetooth ? ["Bluetooth"] : []),
                  ...(vehicle.rear_camera ? ["Caméra de recul"] : []),
                  ...(vehicle.carplay ? ["Apple CarPlay / Android Auto"] : []),
                  ...(vehicle.isofix ? ["Fixations ISOFIX"] : []),
                  ...(vehicle.cruise_control ? ["Régulateur de vitesse"] : []),
                  ...(vehicle.sunroof ? ["Toit ouvrant"] : []),
                  ...(vehicle.leather_seats ? ["Sièges en cuir"] : []),
                  ...(vehicle.electric_windows ? ["Vitres électriques"] : []),
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="flex items-center gap-4 bg-surface-1 p-5 rounded-lg border-2 border-border hover:border-gold/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold/30 group-hover:scale-110 transition-all">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-ink-1">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 360° Viewer */}
            {vehicle.photos && vehicle.photos.length > 1 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="space-y-6"
              >
                <p className="section-eyebrow">Vue 360°</p>
                <Vehicle360Viewer images={vehicle.photos} alt={`${vehicle.brand} ${vehicle.model}`} />
              </motion.section>
            )}

            {/* Reviews */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <ReviewSection vehicleId={vehicle.id!} />
            </motion.section>

            {/* Similar Vehicles */}
            {similarVehicles.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="space-y-8"
              >
                <p className="section-eyebrow">Véhicules Similaires</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarVehicles.map((sv: any, i: number) => (
                    <motion.div
                      key={sv.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      <Link href={`/fleet/${sv.id}`} className="block bg-surface-1 rounded-2xl border-2 border-border hover:border-gold/40 overflow-hidden transition-all duration-300 group hover:shadow-lg hover:shadow-gold/10">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={getImageUrl(sv.image_url) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop"}
                            alt={`${sv.brand} ${sv.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 space-y-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">{sv.brand}</p>
                            <h3 className="text-lg font-black text-ink-1 group-hover:text-gold transition-colors">{sv.model}</h3>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-ink-3">
                            <span className="flex items-center gap-1"><Users size={12} /> {sv.seats || 5}</span>
                            <span className="flex items-center gap-1"><Fuel size={12} /> {sv.fuel_type || "Diesel"}</span>
                            <span className="flex items-center gap-1"><Gauge size={12} /> {sv.transmission || "Auto"}</span>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <span className="text-xl font-black text-ink-1">{sv.price_per_day?.toLocaleString()} <span className="text-xs font-bold text-ink-3">MAD/jour</span></span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* FAQ */}
            <FaqSection />
          </div>

          {/* Right Sidebar — Booking Widget (1/3) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-1 relative"
          >
            <div className="sticky top-32 bg-[#f8f9fa] rounded-3xl shadow-xl shadow-black/5 border border-[#e9ecef] p-8 space-y-6">
              
              {/* Price Display */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#16213E]">{vehicle.price_per_day?.toLocaleString()}</span>
                  <span className="text-lg font-bold text-gray-400">MAD <span className="text-sm font-normal">/ day</span></span>
                </div>
                {vehicle.status === "available" && (
                  <div className="flex items-center gap-2 mt-2">
                    <Check size={16} className="text-emerald-500" strokeWidth={3} />
                    <span className="text-sm font-semibold text-emerald-600">Available Today</span>
                  </div>
                )}
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:border-[#16213E] focus:ring-2 focus:ring-[#16213E]/10 transition-all"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:border-[#16213E] focus:ring-2 focus:ring-[#16213E]/10 transition-all [color-scheme:light]"
                      value={pickupDate}
                      onChange={e => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Time</label>
                  <div className="relative">
                    <Clock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input 
                      type="time" 
                      className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:border-[#16213E] focus:ring-2 focus:ring-[#16213E]/10 transition-all pr-9 [color-scheme:light]"
                      value={pickupTime}
                      onChange={e => setPickupTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Return Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:border-[#16213E] focus:ring-2 focus:ring-[#16213E]/10 transition-all [color-scheme:light]"
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Return Time</label>
                  <div className="relative">
                    <Clock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input 
                      type="time" 
                      className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:border-[#16213E] focus:ring-2 focus:ring-[#16213E]/10 transition-all pr-9 [color-scheme:light]"
                      value={returnTime}
                      onChange={e => setReturnTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Reserve Button */}
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                {vehicle.status === "available" ? (
                  <Link 
                    href={`/booking?vehicle=${vehicle.id}${pickupDate ? `&start_date=${pickupDate}` : ''}${returnDate ? `&end_date=${returnDate}` : ''}${pickupTime ? `&start_time=${pickupTime}` : ''}${returnTime ? `&end_time=${returnTime}` : ''}`}
                    className="flex items-center justify-center gap-3 w-full bg-[#16213E] text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all hover:bg-[#1a2744] hover:shadow-lg hover:shadow-[#16213E]/30"
                  >
                    Reserve Now
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-500 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider">
                      Non disponible
                    </div>
                    <WaitlistButton vehicleId={vehicle.id!} vehicleName={`${vehicle.brand} ${vehicle.model}`} />
                  </div>
                )}
              </motion.div>

              {/* WhatsApp & Call */}
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://wa.me/212600000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a 
                  href="tel:+212600000000"
                  className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Phone size={16} />
                  Call Us
                </a>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Inclusions */}
              <div className="space-y-3.5">
                {[
                  "Free Cancellation",
                  "Insurance Included",
                  "Airport Delivery",
                  "Secure Booking",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Total Price (when dates selected) */}
              {days > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 p-4 rounded-2xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">{vehicle.price_per_day} MAD × {days} jours</span>
                    <span className="text-xs font-bold text-gray-700">{fmt(totalPrice)} MAD</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Estimé</span>
                    <span className="text-xl font-black text-[#16213E]">{fmt(totalPrice)} MAD</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Quels documents sont nécessaires pour louer un véhicule ?",
      a: "Une carte d'identité nationale ou passeport en cours de validité, ainsi qu'un permis de conduire valide. Pour les clients internationaux, un permis de conduire international est requis."
    },
    {
      q: "Comment fonctionne l'assurance tous risques ?",
      a: "Tous nos véhicules sont couverts par une assurance tous risques premium. En cas d'incident, vous bénéficiez d'une franchise réduite et d'une prise en charge complète des dommages matériels."
    },
    {
      q: "Puis-je modifier ou annuler ma réservation ?",
      a: "Oui, vous pouvez modifier ou annuler votre réservation gratuitement jusqu'à 24 heures avant la date de retrait prévue. Au-delà, des frais d'annulation peuvent s'appliquer."
    },
    {
      q: "Le kilométrage est-il illimité ?",
      a: "Oui, tous nos forfaits incluent un kilométrage illimité à travers le Maroc. Aucune restriction de distance ne s'applique."
    },
    {
      q: "Livrez-vous le véhicule à l'aéroport ?",
      a: "Oui, nous offrons un service de livraison et de retrait gratuit dans les principaux aéroports du Maroc (Mohammed V Casablanca, Menara Marrakech, Ibn Battouta Tanger)."
    },
    {
      q: "Un dépôt de garantie est-il requis ?",
      a: "Un blocage de caution est effectué sur votre carte bancaire lors de la prise en charge du véhicule. Le montant varie selon le type de véhicule et est entièrement remboursé à la restitution si aucun dommage n'est constaté."
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="space-y-8"
    >
      <p className="section-eyebrow">Questions Fréquentes</p>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border-2 border-border rounded-xl overflow-hidden hover:border-gold/30 transition-colors">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left bg-surface-0 hover:bg-surface-1 transition-colors"
            >
              <span className="text-sm font-bold text-ink-1 pr-4">{faq.q}</span>
              {openIndex === i ? (
                <ChevronUp size={18} className="text-gold shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-ink-3 shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm text-ink-2 leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
