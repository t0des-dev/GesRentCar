"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, Gauge, Fuel, Users, Calendar, ArrowRight, Check, Loader2, MapPin, Palette, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { fmt } from "@/shared/utils/format";
import ReviewSection from "@/components/ReviewSection";
import Vehicle360Viewer from "@/components/Vehicle360Viewer";
import WaitlistButton from "@/components/WaitlistButton";
import { useVehicleReviewStats } from "@/shared/hooks/useApi";

export default function VehicleClient() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [similarVehicles, setSimilarVehicles] = useState<any[]>([]);

  const [pickupDate, setPickupDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem('vrc_search_start') || "";
  });
  const [returnDate, setReturnDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem('vrc_search_end') || "";
  });

  const { data: reviewStats } = useVehicleReviewStats(vehicle?.id || 0);

  const photos = useMemo(() => {
    if (!vehicle) return [];
    if (vehicle.photos && Array.isArray(vehicle.photos) && vehicle.photos.length > 0) {
      return vehicle.photos;
    }
    return vehicle.image_url ? [vehicle.image_url] : [];
  }, [vehicle]);

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
    if (!vehicle?.type) return;
    const fetchSimilar = async () => {
      try {
        const res = await api.get(`/vehicles?type=${vehicle.type.toLowerCase()}&per_page=5`);
        const all = res.data.data || res.data;
        setSimilarVehicles(
          (Array.isArray(all) ? all : []).filter((v: any) => v.id !== vehicle.id).slice(0, 4)
        );
      } catch {}
    };
    fetchSimilar();
  }, [vehicle?.type, vehicle?.id]);

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

  const specs = [
    { icon: Gauge, label: "Transmission", value: vehicle.transmission || "Automatique" },
    { icon: Fuel, label: "Carburant", value: vehicle.fuel_type || "Diesel" },
    { icon: Users, label: "Places", value: `${vehicle.seats || 5}` },
    { icon: Calendar, label: "Année", value: `${vehicle.year || "N/A"}` },
    { icon: Palette, label: "Couleur", value: vehicle.color || "N/A" },
    { icon: Zap, label: "Puissance", value: vehicle.horsepower ? `${vehicle.horsepower} ch` : "N/A" },
  ];

  return (
    <main className="min-h-screen bg-surface-0 text-ink-1 selection:bg-gold/30 pb-24 relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Photo Gallery */}
      {photos.length > 0 ? (
        <div className="relative w-full">
          <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedPhoto}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={getImageUrl(photos[selectedPhoto]) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"}
                alt={`${vehicle.brand} ${vehicle.model} - Photo ${selectedPhoto + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedPhoto(prev => prev > 0 ? prev - 1 : photos.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-xl p-3 rounded-full text-white hover:bg-gold transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedPhoto(prev => prev < photos.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-xl p-3 rounded-full text-white hover:bg-gold transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {photos.length > 1 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {photos.map((photo: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedPhoto ? "border-gold scale-110 shadow-lg" : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={getImageUrl(photo)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

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

          <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-24">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-4xl space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-gold rounded-full" />
                  <span className="text-gold font-bold text-sm uppercase tracking-widest">{vehicle.brand}</span>
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="display-xl text-white leading-tight font-serif"
                >
                  {vehicle.model}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex items-center gap-6 flex-wrap"
                >
                  {reviewStats && reviewStats.average_rating > 0 ? (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold text-white">
                      <Star size={16} className="text-gold fill-gold" />
                      <span>{reviewStats.average_rating} / 5.0 ({reviewStats.total_reviews} avis)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold text-white">
                      <Star size={16} className="text-gold fill-gold" />
                      <span>Nouveau</span>
                    </div>
                  )}
                  <span className="text-white/80 font-bold uppercase tracking-wider text-xs bg-white/10 px-4 py-2 rounded-full">
                    {t(`cat_${(vehicle.type || 'LUXURY').toLowerCase()}`)}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[85vh] min-h-[600px] w-full overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover object-center"
          />
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
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-24">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-gold rounded-full" />
                  <span className="text-gold font-bold text-sm uppercase tracking-widest">{vehicle.brand}</span>
                </div>
                <h1 className="display-xl text-white leading-tight font-serif">{vehicle.model}</h1>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Left Content */}
          <div className="lg:col-span-2 space-y-16">

            {/* Specs Grid */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <p className="section-eyebrow mb-8">Spécifications Techniques</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {specs.map((spec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="bg-gradient-to-br from-surface-1 to-surface-2 border-2 border-border p-6 rounded-xl hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group"
                  >
                    <spec.icon size={28} className="text-gold mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-2 block">{spec.label}</span>
                    <span className="text-xl font-bold text-ink-1">{spec.value}</span>
                  </motion.div>
                ))}
              </div>

              {(vehicle.gps || vehicle.air_conditioning) && (
                <div className="flex gap-3 mt-4">
                  {vehicle.gps && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-xl">
                      <MapPin size={14} />
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
          </div>

          {/* Right Sidebar — Booking Widget */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-1 relative"
          >
            <div className="sticky top-32 bg-white rounded-2xl shadow-xl shadow-gold/20 border-2 border-border card-premium p-8 space-y-6">

              <div className="pb-6 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-3">Tarif Journalier</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-gold">{vehicle.price_per_day?.toLocaleString()}</span>
                  <span className="text-lg font-bold text-ink-3 mb-1">MAD</span>
                </div>
              </div>

              <div className="space-y-4">
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

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                {vehicle.status === "available" ? (
                  <Link
                    href={`/booking?vehicle=${vehicle.id}${pickupDate ? `&start_date=${pickupDate}` : ''}${returnDate ? `&end_date=${returnDate}` : ''}`}
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-gold to-gold/90 text-ink-1 py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-gold/40"
                  >
                    Réserver ce véhicule
                    <ArrowRight size={18} strokeWidth={3} />
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 w-full bg-surface-2 text-ink-3 py-4 rounded-lg text-xs font-bold uppercase tracking-widest border-2 border-border">
                      Véhicule non disponible
                    </div>
                    <WaitlistButton vehicleId={vehicle.id!} vehicleName={`${vehicle.brand} ${vehicle.model}`} />
                  </div>
                )}
              </motion.div>

              <p className="text-center text-xs font-medium text-ink-3">
                Aucun paiement requis pour réserver
              </p>
            </div>
          </motion.div>
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-24 space-y-8"
          >
            <p className="section-eyebrow">Véhicules Similaires</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarVehicles.map((sv) => (
                <Link
                  key={sv.id}
                  href={`/fleet/${sv.id}`}
                  className="bg-white rounded-xl border-2 border-border hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 transition-all overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(sv.image_url) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop"}
                      alt={`${sv.brand} ${sv.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold">{sv.brand}</p>
                    <p className="text-sm font-bold text-ink-1">{sv.model}</p>
                    <p className="text-lg font-bold text-gold">{sv.price_per_day?.toLocaleString()} <span className="text-xs text-ink-3">MAD/j</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
