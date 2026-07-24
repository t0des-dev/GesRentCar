"use client";

import { useMemo, useEffect, useState, Component } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVehicles } from "@/shared/hooks/useApi";
import { getImageUrl } from "@/shared/utils/image";
import { useBooking } from "@/modules/booking/hooks/useBooking";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { fmt } from "@/shared/utils/format";
import {
  ChevronRight, Check, MapPin, Calendar, Clock, Car,
  CreditCard, Building2, Shield, Phone, MessageCircle, Loader2,
} from "lucide-react";
import Link from "next/link";
import ConfirmationView from "@/modules/booking/components/ConfirmationView";

class StepErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-sm font-medium">Une erreur est survenue.</p>
          <button onClick={() => this.setState({ hasError: false })} className="mt-3 text-[var(--navy)] underline text-sm">
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DESTINATIONS = [
  "Casablanca — Mohammed V Airport",
  "Marrakech — Menara Airport",
  "Rabat — Salé Airport",
  "Tangier — Ibn Battouta Airport",
  "Agadir — Al Massira Airport",
  "Fez — Saïss Airport",
];

const EXTRAS = [
  { id: "gps", label: "GPS Navigation", icon: "📍" },
  { id: "child_seat", label: "Child Seat", icon: "🪑" },
  { id: "unlimited_mileage", label: "Unlimited Mileage", icon: "🛣️" },
  { id: "baby_chair", label: "Baby Chair", icon: "👶" },
  { id: "wifi", label: "Wi-Fi Hotspot", icon: "📶" },
  { id: "ski_rack", label: "Ski Rack", icon: "🎿" },
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

const STEPS = ["Reservation", "Personal Info", "Confirmation", "Secure Payment"];

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles({ status: 'available' });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const displayVehicles = useMemo(() => {
    if (!vehiclesData?.data) return [];
    return vehiclesData.data.map((v) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      price: v.price_per_day,
      type: v.category || "Premium",
      img: v.image_url ? getImageUrl(v.image_url) || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600" : "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600",
      specs: { transmission: v.transmission || "Auto", fuel: v.fuel_type || "Diesel", seats: v.seats || 5, mileage: v.mileage },
      desc: v.description_fr || "L'élégance et le confort absolu pour vos trajets.",
      gps: v.gps || false,
      airConditioning: v.air_conditioning || false,
      equipements: v.equipements || [],
      category: v.category,
    }));
  }, [vehiclesData]);

  const {
    step, setStep, nextStep, prevStep, canNext,
    confirmed, setConfirmed,
    reservationId, setReservationId,
    reservationStatus, setReservationStatus,
    booking, setBooking, update,
    vehicle, days, total, deposit,
    availabilityStatus,
    getFieldError, handleBlur, clientFieldChange,
  } = useBooking(displayVehicles);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (confirmed) {
    return (
      <ConfirmationView
        booking={booking}
        reservationId={reservationId}
        reservationStatus={reservationStatus}
        deposit={deposit}
        total={total}
        vehicle={vehicle}
      />
    );
  }

  const currentStepIdx = Math.min(step, 3);
  const basePrice = (vehicle?.price ?? 0) * Math.max(days, 1);
  const extrasPrice = selectedExtras.length * 50;
  const taxFee = Math.round(basePrice * 0.1);
  const grandTotal = basePrice + extrasPrice + taxFee;

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleReserve = async () => {
    if (!acceptedTerms || !vehicle) return;
    setSubmitting(true);
    try {
      nextStep();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <nav className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
            <Link href="/" className="hover:text-gray-700 transition-colors">{t("nav_home")}</Link>
            <span className="text-gray-300">/</span>
            <Link href="/fleet" className="hover:text-gray-700 transition-colors">{t("nav_fleet")}</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700">Reservation</span>
          </nav>
        </div>
      </div>

      {/* ── Progress Steps ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 py-5">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((label, i) => {
              const isCompleted = i < currentStepIdx;
              const isCurrent = i === currentStepIdx;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                      isCompleted
                        ? "bg-[var(--navy)] text-white"
                        : isCurrent
                        ? "bg-[var(--navy)] text-white ring-4 ring-[var(--navy)]/15"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </div>
                    <span className={`text-[13px] font-semibold hidden sm:block ${
                      isCurrent ? "text-gray-900" : isCompleted ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 sm:w-20 h-px mx-3 sm:mx-5 ${
                      i < currentStepIdx ? "bg-[var(--navy)]" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Left: Main Content ── */}
          <div className="space-y-10">
            <StepErrorBoundary>
              {/* ── Reservation Summary ── */}
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Reservation Summary</h2>
                {vehicle ? (
                  <div className="flex gap-5">
                    <div className="w-[140px] h-[100px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={vehicle.img}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{vehicle.brand}</p>
                      <h3 className="text-lg font-bold text-gray-900 mt-0.5">{vehicle.model}</h3>
                      <div className="flex items-center gap-4 mt-2 text-[12px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Car size={12} /> {vehicle.specs?.transmission}</span>
                        <span>{vehicle.type}</span>
                        <span className="text-gray-900 font-bold">{vehicle.price?.toLocaleString()} MAD/day</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setStep(0)}
                          className="px-4 py-1.5 bg-[var(--navy)] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#1a2747] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { update("vehicleId", null); setStep(0); }}
                          className="px-4 py-1.5 border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">No vehicle selected</p>
                    <button onClick={() => setStep(0)} className="text-[var(--navy)] text-sm font-semibold underline">
                      Choose a vehicle
                    </button>
                  </div>
                )}
              </section>

              {/* ── Rental Details ── */}
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Rental Details</h2>
                <p className="text-[13px] text-gray-500 mb-6">Specify your preferred pickup and return details to complete reservation.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Pickup Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={booking.location}
                        onChange={e => update("location", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer appearance-none"
                      >
                        <option value="">Select location</option>
                        {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Return Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={booking.location}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Pickup Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={booking.startDate}
                        onChange={e => update("startDate", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Pickup Time</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer appearance-none">
                        {TIME_SLOTS.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Return Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={booking.endDate}
                        onChange={e => update("endDate", e.target.value)}
                        min={booking.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Return Time</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[var(--navy)] transition-colors cursor-pointer appearance-none">
                        {TIME_SLOTS.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {days > 0 && (
                  <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-[13px] text-amber-700 font-medium">
                      ▸ This reservation includes {days} days — {days === 1 ? "1 day" : `${days} days`} free cancellation.
                    </p>
                  </div>
                )}

                <button className="mt-4 text-[13px] text-[var(--navy)] font-semibold underline underline-offset-2">
                  Flexible dates — Search again
                </button>
              </section>

              {/* ── Rental Extras ── */}
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Rental Extras</h2>
                <p className="text-[13px] text-gray-500 mb-6">Customize your ride with optional add-ons, insurance, and protections.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EXTRAS.map(extra => (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        selectedExtras.includes(extra.id)
                          ? "border-[var(--navy)] bg-[var(--navy)]/5"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        selectedExtras.includes(extra.id)
                          ? "border-[var(--navy)] bg-[var(--navy)]"
                          : "border-gray-300"
                      }`}>
                        {selectedExtras.includes(extra.id) && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-700">{extra.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Customer Information ── */}
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Customer Information</h2>
                <p className="text-[13px] text-gray-500 mb-6">Enter your personal details for the reservation.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={booking.client.name}
                      onChange={e => clientFieldChange("name", e.target.value)}
                      onBlur={e => handleBlur("name", e.target.value)}
                      placeholder="John"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                    />
                    {getFieldError("name") && <p className="text-red-500 text-[11px] mt-1">{getFieldError("name")}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={booking.client.email}
                      onChange={e => clientFieldChange("email", e.target.value)}
                      onBlur={e => handleBlur("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                    />
                    {getFieldError("email") && <p className="text-red-500 text-[11px] mt-1">{getFieldError("email")}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={booking.client.phone}
                      onChange={e => clientFieldChange("phone", e.target.value)}
                      onBlur={e => handleBlur("phone", e.target.value)}
                      placeholder="+212 600 00 00 00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                    />
                    {getFieldError("phone") && <p className="text-red-500 text-[11px] mt-1">{getFieldError("phone")}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">ID Number (CIN) *</label>
                    <input
                      type="text"
                      value={booking.client.cin}
                      onChange={e => clientFieldChange("cin", e.target.value)}
                      onBlur={e => handleBlur("cin", e.target.value)}
                      placeholder="XXXXXXX"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                    />
                    {getFieldError("cin") && <p className="text-red-500 text-[11px] mt-1">{getFieldError("cin")}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">License Number *</label>
                    <input
                      type="text"
                      value={booking.client.licenseNumber}
                      onChange={e => clientFieldChange("licenseNumber", e.target.value)}
                      onBlur={e => handleBlur("licenseNumber", e.target.value)}
                      placeholder="XXXXXXX"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                    />
                    {getFieldError("licenseNumber") && <p className="text-red-500 text-[11px] mt-1">{getFieldError("licenseNumber")}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Special requests (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Any special requests or notes for your rental..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors resize-none"
                  />
                </div>
              </section>

              {/* ── Reservation Flow ── */}
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Reservation Flow</h2>
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <Check size={18} className="text-emerald-600 mt-0.5 shrink-0" strokeWidth={3} />
                  <div>
                    <p className="text-[14px] font-semibold text-emerald-800">This vehicle is available immediately</p>
                    <p className="text-[13px] text-emerald-600 mt-0.5">You can proceed with the reservation. Payment of the 30% deposit.</p>
                  </div>
                </div>
              </section>

              {/* ── Payment ── */}
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Payment</h2>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      paymentMethod === "card"
                        ? "border-[var(--navy)] bg-[var(--navy)]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard size={20} className={paymentMethod === "card" ? "text-[var(--navy)]" : "text-gray-400"} />
                    <div className="text-left">
                      <p className={`text-[13px] font-semibold ${paymentMethod === "card" ? "text-gray-900" : "text-gray-600"}`}>Credit/Debit Card</p>
                      <p className="text-[11px] text-gray-400">Visa, Mastercard</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      paymentMethod === "transfer"
                        ? "border-[var(--navy)] bg-[var(--navy)]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Building2 size={20} className={paymentMethod === "transfer" ? "text-[var(--navy)]" : "text-gray-400"} />
                    <div className="text-left">
                      <p className={`text-[13px] font-semibold ${paymentMethod === "transfer" ? "text-gray-900" : "text-gray-600"}`}>Bank Transfer</p>
                      <p className="text-[11px] text-gray-400">Direct bank payment</p>
                    </div>
                  </button>
                </div>

                <div className="flex gap-2 mb-6">
                  {["Visa", "Mastercard", "Amex", "Discover"].map(card => (
                    <div key={card} className="px-3 py-1.5 bg-gray-100 rounded-lg text-[11px] font-bold text-gray-500 uppercase">
                      {card}
                    </div>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors tracking-wider"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">MM / YY</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          maxLength={7}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--navy)] transition-colors"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      ▸ Your card will be charged automatically after rental. No charges until pick up.
                    </p>
                  </div>
                )}
              </section>

              {/* ── Terms ── */}
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Terms</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      acceptedTerms ? "border-[var(--navy)] bg-[var(--navy)]" : "border-gray-300"
                    }`} onClick={() => setAcceptedTerms(!acceptedTerms)}>
                      {acceptedTerms && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[13px] text-gray-600 leading-relaxed">
                      I have read and agree to the <span className="text-[var(--navy)] font-semibold underline">Terms &amp; Conditions</span> and <span className="text-[var(--navy)] font-semibold underline">Privacy Policy</span>.
                    </span>
                  </label>
                </div>
              </section>
            </StepErrorBoundary>
          </div>

          {/* ── Right: Sticky Sidebar ── */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-5">

              {/* Vehicle mini info */}
              {vehicle && (
                <div className="flex gap-4 pb-5 border-b border-gray-100">
                  <div className="w-[80px] h-[60px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={vehicle.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{vehicle.brand}</p>
                    <p className="text-[14px] font-bold text-gray-900">{vehicle.model}</p>
                    <p className="text-[12px] text-gray-500">{vehicle.type}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="space-y-2 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Pickup</span>
                  <span className="font-semibold text-gray-900">{booking.startDate || "—"}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Return</span>
                  <span className="font-semibold text-gray-900">{booking.endDate || "—"}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-gray-900">{days > 0 ? `${days} Day${days > 1 ? "s" : ""}` : "—"}</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Base rate ({days || 1} day{days > 1 ? "s" : ""})</span>
                  <span className="font-semibold text-gray-900">{fmt(basePrice)} MAD</span>
                </div>
                {extrasPrice > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">Extras ({selectedExtras.length})</span>
                    <span className="font-semibold text-gray-900">{fmt(extrasPrice)} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Taxes &amp; fees</span>
                  <span className="font-semibold text-gray-900">{fmt(taxFee)} MAD</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline pb-5 border-b border-gray-100">
                <span className="text-[13px] font-bold uppercase tracking-wider text-gray-400">Total Rental</span>
                <span className="text-[24px] font-bold text-gray-900">{fmt(grandTotal)} <span className="text-[13px] font-medium text-gray-400">MAD</span></span>
              </div>

              {deposit > 0 && (
                <div className="flex justify-between text-[12px] text-gray-500">
                  <span>Deposit due today (30%)</span>
                  <span className="font-semibold text-gray-700">{fmt(deposit)} MAD</span>
                </div>
              )}

              {/* Proceed button */}
              <button
                onClick={handleReserve}
                disabled={!acceptedTerms || submitting}
                className="w-full bg-[var(--navy)] hover:bg-[#1a2747] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-full py-4 text-[14px] tracking-wide transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Proceed to Payment"
                )}
              </button>

              {/* Trust badges */}
              <div className="space-y-3 pt-2">
                {[
                  { icon: <Shield size={16} className="text-emerald-500" />, text: "Secure Checkout" },
                  { icon: <Check size={16} className="text-emerald-500" />, text: "Free Cancellation" },
                  { icon: <Clock size={16} className="text-emerald-500" />, text: "24/7 Support" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {badge.icon}
                    <span className="text-[13px] text-gray-500 font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Questions?</p>
                <div className="flex gap-2">
                  <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a href="tel:+212600000000"
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <Phone size={14} /> Call Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
