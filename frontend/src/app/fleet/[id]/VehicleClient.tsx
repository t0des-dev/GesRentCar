"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Check, Loader2, Phone, MessageCircle, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import api from "@/shared/services/client";
import { getImageUrl } from "@/shared/utils/image";
import { useTranslation } from "@/shared/hooks/useTranslation";
import ReviewSection from "@/components/ReviewSection";
import WaitlistButton from "@/components/WaitlistButton";
import { useVehicleReviewStats } from "@/shared/hooks/useApi";

const DESTINATIONS = [
  "Casablanca — Mohammed V Airport",
  "Marrakech — Menara Airport",
  "Rabat — Salé Airport",
  "Tangier — Ibn Battouta Airport",
  "Agadir — Al Massira Airport",
  "Fez — Saïss Airport",
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00",
];

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
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState(DESTINATIONS[0]);

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

  const mainImage = photos[selectedPhoto] || photos[0] || "";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--warm-white)]">
        <Loader2 className="animate-spin text-[var(--gold)]" size={48} />
        <p className="mt-4 text-gray-400 text-sm font-medium">Chargement du véhicule...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--warm-white)] text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Véhicule introuvable</h1>
        <p className="text-gray-500 mb-6">Le véhicule demandé n&apos;existe pas ou a été supprimé.</p>
        <Link href="/fleet" className="px-6 py-3 bg-[var(--navy)] text-white font-bold rounded-xl hover:bg-[#1a2747] transition-all">
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

  const isAvailable = vehicle.status === "available";

  const handleReserve = () => {
    const q = new URLSearchParams({ vehicle: String(vehicle.id) });
    if (pickupDate) q.set("start_date", pickupDate);
    if (returnDate) q.set("end_date", returnDate);
    if (pickupTime && pickupTime !== "10:00") q.set("start_time", pickupTime);
    if (returnTime && returnTime !== "10:00") q.set("end_time", returnTime);
    if (pickupLocation) q.set("location", pickupLocation);
    router.push(`/booking?${q.toString()}`);
  };

  const whatsappNumber = "+212600000000";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Bonjour, je suis intéressé par le ${vehicle.brand} ${vehicle.model}.`;

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero Section ── */}
      <div className="relative h-[300px] overflow-hidden bg-[#0a0f1a]">
        {mainImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: `url('${getImageUrl(mainImage)}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#0a0f1a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent" />

        <div className="relative z-10 max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 h-full flex flex-col justify-center pt-8">
          <nav className="flex items-center gap-2 text-white/50 text-[13px] mb-5 font-medium">
            <Link href="/" className="hover:text-white transition-colors">{t("nav_home")}</Link>
            <span className="text-white/30">/</span>
            <Link href="/fleet" className="hover:text-white transition-colors">{t("nav_fleet")}</Link>
            <span className="text-white/30">/</span>
            <span className="text-white">{vehicle.brand} {vehicle.model}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t(`cat_${(vehicle.type || 'luxury').toLowerCase()}`)}
            </span>
          </div>

          <h1 className="font-[var(--font-instrument-serif)] text-[clamp(28px,4vw,44px)] font-medium text-white leading-[1.15] mb-3 max-w-[520px]">
            {vehicle.brand} {vehicle.model} or Similar
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-[480px]">
            Elegant transportation designed for executives, business travel and premium experiences across Morocco.
          </p>
        </div>
      </div>

      {/* ── Main Content: 2-column ── */}
      <div className="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Left: Image Gallery ── */}
          <div className="space-y-5">
            {/* Main Image */}
            <div className="relative bg-[#0a0f1a] rounded-2xl overflow-hidden aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedPhoto}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={getImageUrl(mainImage) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"}
                  alt={`${vehicle.brand} ${vehicle.model} - Photo ${selectedPhoto + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Photo label */}
              <div className="absolute bottom-4 left-5 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                  Front Three-Quarter
                </span>
              </div>

              {/* Expand button */}
              <button className="absolute bottom-4 right-5 bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/80 transition-colors">
                <Maximize2 size={16} />
              </button>

              {/* Navigation arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedPhoto(prev => prev > 0 ? prev - 1 : photos.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl p-2.5 rounded-full text-white hover:bg-white/40 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedPhoto(prev => prev < photos.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl p-2.5 rounded-full text-white hover:bg-white/40 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {photos.map((photo: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhoto(i)}
                    className={`shrink-0 w-[100px] h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedPhoto
                        ? "border-[var(--gold)] opacity-100 shadow-lg"
                        : "border-gray-200 opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={getImageUrl(photo)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ── Specs + Info below image ── */}
            <div className="mt-10 space-y-10">
              {/* Specs */}
              <section className="space-y-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Specifications</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Transmission", value: vehicle.transmission || "Automatique" },
                    { label: "Fuel", value: vehicle.fuel_type || "Diesel" },
                    { label: "Seats", value: `${vehicle.seats || 5}` },
                    { label: "Year", value: `${vehicle.year || "N/A"}` },
                    { label: "Color", value: vehicle.color || "N/A" },
                    { label: "Power", value: vehicle.horsepower ? `${vehicle.horsepower} ch` : "N/A" },
                  ].map((spec, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-4 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{spec.label}</span>
                      <span className="text-sm font-bold text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Description */}
              <section className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">About this vehicle</p>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  The {vehicle.brand} {vehicle.model} redefines luxury and performance.
                  Designed to deliver an unmatched driving experience, this vehicle combines cutting-edge technology
                  with absolute comfort. Whether for a business trip in Casablanca or an getaway
                  to Marrakech, travel with the elegance and prestige of Vectoria.
                </p>
              </section>

              {/* Inclusions */}
              <section className="space-y-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Included in rental</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Full insurance coverage",
                    "Unlimited mileage",
                    "24/7 roadside assistance",
                    "Free second driver",
                    "Complete cleaning before delivery",
                    "Dedicated concierge",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Check size={14} className="text-emerald-600" strokeWidth={3} />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews */}
              <section>
                <ReviewSection vehicleId={vehicle.id!} />
              </section>
            </div>
          </div>

          {/* ── Right: Booking Card ── */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-5">

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold text-gray-900">{vehicle.price_per_day?.toLocaleString()}</span>
                  <span className="text-[15px] font-medium text-gray-400">MAD / day</span>
                </div>
                {isAvailable && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Check size={14} className="text-emerald-500" strokeWidth={3} />
                    <span className="text-[13px] font-semibold text-emerald-600">Available Today</span>
                  </div>
                )}
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Pickup Location</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors"
                />
              </div>

              {/* Pickup Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={e => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Pickup Time</label>
                  <select
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer appearance-none"
                  >
                    {TIME_SLOTS.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                  </select>
                </div>
              </div>

              {/* Return Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Return Time</label>
                  <select
                    value={returnTime}
                    onChange={e => setReturnTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer appearance-none"
                  >
                    {TIME_SLOTS.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                  </select>
                </div>
              </div>

              {/* Reserve Now */}
              {isAvailable ? (
                <button
                  onClick={handleReserve}
                  className="w-full bg-[var(--navy)] hover:bg-[#1a2747] text-white font-semibold rounded-full py-4 text-[14px] tracking-wide transition-all cursor-pointer"
                >
                  Reserve Now
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="w-full bg-gray-100 text-gray-400 font-semibold rounded-full py-4 text-[14px] tracking-wide text-center border border-gray-200">
                    Vehicle Unavailable
                  </div>
                  <WaitlistButton vehicleId={vehicle.id!} vehicleName={`${vehicle.brand} ${vehicle.model}`} />
                </div>
              )}

              {/* WhatsApp + Call */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href="tel:+212600000000"
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Phone size={16} />
                  Call Us
                </a>
              </div>

              {/* Benefits */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                {[
                  "Free Cancellation",
                  "Insurance Included",
                  "Airport Delivery",
                  "Secure Booking",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check size={14} className="text-gray-400" strokeWidth={2.5} />
                    <span className="text-[13px] text-gray-500 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Similar Vehicles ── */}
        {similarVehicles.length > 0 && (
          <section className="mt-20 space-y-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Similar Vehicles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarVehicles.map((sv) => (
                <Link
                  key={sv.id}
                  href={`/fleet/${sv.id}`}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(sv.image_url) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop"}
                      alt={`${sv.brand} ${sv.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{sv.brand}</p>
                    <p className="text-sm font-bold text-gray-900">{sv.model}</p>
                    <p className="text-lg font-bold text-gray-900">{sv.price_per_day?.toLocaleString()} <span className="text-xs text-gray-400 font-medium">MAD/day</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
