"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, Gauge, Fuel, Users, Calendar, ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { fmt } from "@/shared/utils/format";

export default function VehicleClient() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [pickupDate, setPickupDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem('vrc_search_start') || "";
  });
  const [returnDate, setReturnDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem('vrc_search_end') || "";
  });

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

              {/* GPS & Climatiseur Badges */}
              {(vehicle.gps || vehicle.air_conditioning) && (
                <div className="flex gap-3 mt-4">
                  {vehicle.gps && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-xl">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                      </svg>
                      GPS
                    </span>
                  )}
                  {vehicle.air_conditioning && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border-2 border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-xl">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z"/>
                        <path d="M6 10v2a6 6 0 0 0 12 0v-2"/>
                        <line x1="12" x2="12" y1="18" y2="22"/>
                      </svg>
                      Climatiseur
                    </span>
                  )}
                </div>
              )}
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
          </div>

          {/* Right Sidebar — Booking Widget (1/3) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-1 relative"
          >
            <div className="sticky top-32 bg-white rounded-2xl shadow-xl shadow-gold/20 border-2 border-border card-premium p-8 space-y-6">
              
              {/* Price Display */}
              <div className="pb-6 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-3">Tarif Journalier</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-gold">{vehicle.price_per_day?.toLocaleString()}</span>
                  <span className="text-lg font-bold text-ink-3 mb-1">MAD</span>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="space-y-4">
                {/* Pickup Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-3 mb-2">Retrait</label>
                  <div className="relative group">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                    <input 
                      type="date" 
                      className="w-full pl-12 pr-4 py-3 bg-surface-0 border-2 border-border rounded-lg text-ink-1 font-semibold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                      value={pickupDate}
                      onChange={e => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-3 mb-2">Retour</label>
                  <div className="relative group">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                    <input 
                      type="date" 
                      className="w-full pl-12 pr-4 py-3 bg-surface-0 border-2 border-border rounded-lg text-ink-1 font-semibold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Total Price */}
              {days > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gold/20 to-gold/10 border-2 border-gold/40 p-6 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gold font-bold">{vehicle.price_per_day} MAD × {days} jours</span>
                    <span className="text-sm text-gold font-bold">{fmt(totalPrice)} MAD</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gold/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-ink-1">Total Estimé</span>
                    <span className="text-2xl font-bold text-gold">{fmt(totalPrice)} MAD</span>
                  </div>
                </motion.div>
              )}

              {/* CTA Button */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href={`/booking?vehicle=${vehicle.id}${pickupDate ? `&start_date=${pickupDate}` : ''}${returnDate ? `&end_date=${returnDate}` : ''}`}
                  className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-gold to-gold/90 text-ink-1 py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-gold/40"
                >
                  Réserver ce véhicule
                  <ArrowRight size={18} strokeWidth={3} />
                </Link>
              </motion.div>

              {/* Note */}
              <p className="text-center text-xs font-medium text-ink-3">
                Aucun paiement requis pour réserver
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
