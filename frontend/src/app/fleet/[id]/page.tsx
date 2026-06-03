"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, Gauge, Fuel, Users, Calendar, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/client";
import { getImageUrl } from "@/lib/utils/image";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./page.module.css";

export default function VehiclePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking simulation state
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

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
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <h1 className="text-4xl font-black">Véhicule introuvable</h1>
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
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 pb-24">
      {/* SEO JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Image Header */}
      <div className={styles.heroSection}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
        <img 
          src={getImageUrl(vehicle.image_url) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"} 
          alt={`${vehicle.brand} ${vehicle.model}`}
          className={styles.heroImage}
        />
        
        <div className="absolute top-32 left-4 md:left-12 z-20">
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft size={20} />
            Retour au catalogue
          </button>
        </div>

        <div className="absolute bottom-12 left-4 md:left-12 z-20 max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black text-sm md:text-base uppercase tracking-[0.3em] mb-4"
          >
            {vehicle.brand}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6"
          >
            {vehicle.model}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span>4.9 / 5.0</span>
            </div>
            <span className="text-white/60 font-black uppercase tracking-widest text-xs">
              {t(`cat_${(vehicle.type || 'LUXURY').toLowerCase()}`)}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Details */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Specs Grid */}
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-8">Spécifications Techniques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Places", value: `${vehicle.seats || 5}` },
                  { icon: Gauge, label: "Transmission", value: vehicle.transmission || "Automatique" },
                  { icon: Fuel, label: "Carburant", value: vehicle.fuel_type || "Diesel" },
                  { icon: ShieldCheck, label: "Catégorie", value: "Premium" },
                ].map((spec, i) => (
                  <div key={i} className={styles.specCard}>
                    <spec.icon size={24} className="text-primary mb-4" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">{spec.label}</span>
                    <span className="text-lg font-bold text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-8">Expérience de conduite</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-white/80 leading-relaxed font-medium">
                  Le {vehicle.brand} {vehicle.model} redéfinit le luxe et la performance. 
                  Conçu pour offrir une expérience de conduite inégalée, ce véhicule allie une technologie de pointe 
                  à un confort absolu. Que ce soit pour un voyage d'affaires à Casablanca ou une escapade 
                  à Marrakech, voyagez avec l'élégance et le prestige de l'Arctic Luxury.
                </p>
              </div>
            </section>

            {/* Included Features */}
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-8">Inclus dans la location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Assurance tous risques (Premium)",
                  "Kilométrage illimité",
                  "Assistance routière 24/7",
                  "Deuxième conducteur gratuit",
                  "Nettoyage intégral avant livraison",
                  "Conciergerie dédiée"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Sticky Booking Widget */}
          <div className="lg:col-span-4 relative">
            <div className={styles.stickyWidget}>
              <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-2">Tarif Journalier</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white">{vehicle.price_per_day?.toLocaleString()}</span>
                  <span className="text-lg font-bold text-primary mb-1">MAD</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 ml-4">Retrait</label>
                  <div className={styles.dateInputWrapper}>
                    <Calendar size={18} className="text-primary" />
                    <input 
                      type="date" 
                      className={styles.dateInput} 
                      value={pickupDate}
                      onChange={e => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 ml-4">Retour</label>
                  <div className={styles.dateInputWrapper}>
                    <Calendar size={18} className="text-primary" />
                    <input 
                      type="date" 
                      className={styles.dateInput} 
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {days > 0 && (
                <div className="bg-primary/10 border border-primary/20 p-6 rounded-[24px] mb-8 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-primary font-bold">{vehicle.price_per_day} MAD × {days} jours</span>
                    <span className="text-sm text-primary font-black">{totalPrice.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-primary/20 mt-4">
                    <span className="text-xs uppercase tracking-widest font-black text-white">Total Estimé</span>
                    <span className="text-2xl font-black text-white">{totalPrice.toLocaleString()} MAD</span>
                  </div>
                </div>
              )}

              <Link 
                href={`/booking?vehicle=${vehicle.id}${pickupDate ? `&start_date=${pickupDate}` : ''}${returnDate ? `&end_date=${returnDate}` : ''}`}
                className={styles.bookButton}
              >
                Réserver ce véhicule
                <ArrowRight size={20} />
              </Link>

              <p className="text-center text-[10px] uppercase tracking-widest text-white/30 font-bold mt-6">
                Aucun paiement requis pour réserver
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
