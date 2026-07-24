"use client";

import { useMemo, useEffect, useState, Component } from "react";
import { useVehicles } from "@/shared/hooks/useApi";
import { getImageUrl } from "@/shared/utils/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
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
import { useTranslation } from "@/shared/hooks/useTranslation";

class StepErrorBoundary extends Component<
  { children: React.ReactNode; step: number },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; step: number }) {
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
          <p className="text-sm font-medium">Une erreur est survenue à l&apos;étape {this.props.step + 1}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-[var(--navy)] underline text-sm"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BookingPage() {
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles({ status: 'available' });
  const dir = useDirection();
  const { t } = useTranslation();
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
      equipements: v.equipements || [],
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

      {/* ── Step Indicator ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 py-5">
          <StepIndicator currentStep={step} onStepClick={(s) => { if (s <= step) setStep(s); }} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

          {/* Left: Step Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <StepErrorBoundary step={step}>
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

            {/* Navigation Buttons */}
            {step > 0 && step < 5 && (
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-500 text-[13px] font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canNext()}
                  className="px-8 py-3 bg-[var(--navy)] hover:bg-[#1a2747] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  Continuer
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right: Summary Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit">
            {/* Mobile toggle */}
            <button
              onClick={() => setShowSummaryMobile(!showSummaryMobile)}
              className="lg:hidden flex items-center justify-between w-full py-3 px-5 bg-white rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 mb-3"
            >
              <span>Récapitulatif</span>
              {showSummaryMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div className={`${showSummaryMobile ? "block" : "hidden"} lg:block`}>
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
      </div>

      {/* Vehicle Showroom Modal */}
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
