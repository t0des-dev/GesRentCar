"use client";

import { useMemo, useEffect, useState, Component } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useVehicles } from "@/shared/hooks/useApi";
import { getImageUrl } from "@/shared/utils/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ChevronUp, Check, MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Components
import StepIndicator from "@/modules/booking/components/StepIndicator";
import BookingSummary from "@/modules/booking/components/BookingSummary";
import ConfirmationView from "@/modules/booking/components/ConfirmationView";
import VehicleStep from "@/modules/booking/components/VehicleStep";
import PeriodStep from "@/modules/booking/components/PeriodStep";
import OptionsStep from "@/modules/booking/components/OptionsStep";
import IdentityStep from "@/modules/booking/components/IdentityStep";
import SignatureStep from "@/modules/booking/components/SignatureStep";
import PaymentStep from "@/modules/booking/components/PaymentStep";
import { VehicleShowroom } from "@/modules/booking/components/VehicleShowroom";

// Hooks
import { useBooking } from "@/modules/booking/hooks/useBooking";
import { useDirection } from "@/shared/hooks/useDirection";

// Error boundary
class StepErrorBoundary extends Component<
  { children: React.ReactNode; step: number; t: (key: string) => string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; step: number; t: (key: string) => string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-ink-4">
          <p className="text-xs font-semibold uppercase tracking-wider">
            {this.props.t("booking_step_error")} {this.props.step + 1}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 text-primary underline text-sm"
          >
            {this.props.t("booking_step_retry")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BookingPage() {
  const { t } = useTranslation();
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles({ status: 'available' });
  const dir = useDirection();
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);

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
      category: v.category,
    }));
  }, [vehiclesData]);

  const {
    step, setStep, nextStep, prevStep, canNext,
    confirmed, setConfirmed,
    reservationId, setReservationId,
    reservationStatus, setReservationStatus,
    previewVehicle, setPreviewVehicle,
    isScanning, setIsScanning,
    signature, setSignature,
    booking, setBooking, update,
    vehicle, days, total, deposit,
    availabilityStatus,
    getFieldError, handleBlur, clientFieldChange,
  } = useBooking(displayVehicles);

  // Auto-scroll to top on step change
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

  return (
    <main className="min-h-screen py-24 bg-[#fafbfc]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Left Content */}
          <div className="w-full lg:w-2/3 space-y-10">

            {/* Section 1 — Reservation Summary */}
            {vehicle && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gold" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Section 1</p>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Reservation Summary</h2>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={vehicle.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
                        alt={vehicle.model || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">{vehicle.type || "Premium"}</p>
                      <h3 className="text-lg font-black text-gray-900">{vehicle.brand} {vehicle.model || "Similar"}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                        {booking.startDate && (
                          <span className="flex items-center gap-1"><Calendar size={12} /> Pickup {new Date(booking.startDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        )}
                        {booking.endDate && (
                          <span className="flex items-center gap-1"><Calendar size={12} /> Return {new Date(booking.endDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        )}
                        {days > 0 && <span className="flex items-center gap-1"><Clock size={12} /> {days} Days</span>}
                        {booking.location && <span className="flex items-center gap-1"><MapPin size={12} /> {booking.location}</span>}
                      </div>
                    </div>
                  </div>
                  {vehicle && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check size={12} className="text-emerald-600" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">Instant Confirmation</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-3 py-1.5 bg-[#16213E] text-white text-[11px] font-bold rounded-lg">ART Fleet — Instant</span>
                    {vehicle.category === "collaborator" && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-lg">Partner Vehicle</span>
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Section 2 — Rental Details */}
            {vehicle && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gold" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Section 2</p>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Rental Details</h2>
                <p className="text-sm text-gray-500">These were set on the vehicle page and are locked for checkout.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Location</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.location || "Casablanca — Mohammed V Airport"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Return Location</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.location || "Casablanca — Mohammed V Airport"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Date</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.startDate ? new Date(booking.startDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Time</p>
                    <p className="text-sm font-semibold text-gray-900">10:00</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Return Date</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.endDate ? new Date(booking.endDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Return Time</p>
                    <p className="text-sm font-semibold text-gray-900">10:00</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Rental Duration</p>
                    <p className="text-sm font-semibold text-gray-900">{days > 0 ? `${days} Days` : "—"}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  <span className="text-gold font-semibold cursor-pointer hover:underline">Need to change these details? Go back to the Vehicle page</span>
                </p>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold" />
                  <span className="text-sm text-gray-600">I would like airport pickup / delivery</span>
                </label>
              </motion.section>
            )}

            {/* Step Wizard */}
            <div>
              <StepIndicator currentStep={step} onStepClick={setStep} />

              <div className="mb-8 min-h-[500px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <StepErrorBoundary step={step} t={t}>
                      {step === 0 && (
                        <VehicleStep
                          booking={booking} update={update} isLoading={isLoadingVehicles}
                          vehicles={displayVehicles} setStep={setStep}
                        />
                      )}
                      {step === 1 && (
                        <PeriodStep
                          booking={booking} update={update}
                          getFieldError={getFieldError} handleBlur={handleBlur}
                          availability={availabilityStatus}
                          vehiclePricePerDay={vehicle?.price ?? 0}
                        />
                      )}
                      {step === 2 && <OptionsStep booking={booking} update={update} />}
                      {step === 3 && (
                        <IdentityStep
                          booking={booking} update={update} setBooking={setBooking}
                          isScanning={isScanning} setIsScanning={setIsScanning}
                          getFieldError={getFieldError} handleBlur={handleBlur}
                          clientFieldChange={clientFieldChange}
                        />
                      )}
                      {step === 4 && (
                        <SignatureStep
                          onComplete={(sig) => { setSignature(sig); nextStep(); }}
                          onBack={prevStep}
                        />
                      )}
                      {step === 5 && (
                        <PaymentStep
                          booking={booking} deposit={deposit} total={total} days={days}
                          signature={signature}
                          onSuccess={(resId, status) => { if (resId) setReservationId(resId); if (status) setReservationStatus(status); setConfirmed(true); }}
                          onPrev={prevStep}
                        />
                      )}
                    </StepErrorBoundary>
                  </motion.div>
                </AnimatePresence>
              </div>

              {step > 0 && step < 5 && (
                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                  <button
                    onClick={prevStep}
                    disabled={step === 0}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!canNext()}
                    className="px-6 py-3 bg-[#16213E] text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#1a2744] transition-all disabled:opacity-30"
                  >
                    Continue
                    <ChevronRight size={16} className="inline ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile summary toggle */}
          <button
            onClick={() => setShowSummaryMobile(!showSummaryMobile)}
            className="lg:hidden flex items-center gap-2 w-full py-3 px-5 bg-white rounded-2xl border border-gray-100 text-sm font-semibold text-gray-600"
          >
            {showSummaryMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showSummaryMobile ? "Masquer le récapitulatif" : "Afficher le récapitulatif"}
          </button>

          {/* Right Sidebar */}
          <div className={`w-full lg:w-1/3 ${showSummaryMobile ? "block" : "hidden"} lg:block`}>
            <BookingSummary
              booking={booking} days={days} total={total}
              deposit={deposit} vehicle={vehicle}
              vehicleLoading={isLoadingVehicles}
              currentStep={step}
              onEditVehicle={() => { setStep(0); setShowSummaryMobile(false); }}
              onEditPeriod={() => { setStep(1); setShowSummaryMobile(false); }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewVehicle && (
          <VehicleShowroom
            vehicle={previewVehicle}
            onClose={() => setPreviewVehicle(null)}
            onSelect={() => { update("vehicleId", previewVehicle.id); setStep(1); }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
