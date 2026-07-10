"use client";

import { useMemo, useEffect, useState, Component } from "react";
import { useVehicles } from "@/shared/hooks/useApi";
import { getImageUrl } from "@/shared/utils/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

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
        <div className="flex flex-col items-center justify-center py-24 text-ink-4">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Une erreur est survenue à l&apos;étape {this.props.step + 1}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 text-primary underline text-sm"
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
    <main className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="section-header text-center">
          <p className="text-primary font-semibold text-[10px] uppercase tracking-[0.2em] mb-4">Votre Réservation</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">Réservez l'Exception</h1>
          <p className="text-ink-2 text-base max-w-xl mx-auto">Sécurisez votre véhicule de luxe en quelques étapes simples.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-2/3">
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
                  <StepErrorBoundary step={step}>
                    {step === 0 && (
                      <VehicleStep
                        booking={booking} update={update} isLoading={isLoadingVehicles}
                        vehicles={displayVehicles} onNext={nextStep}
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

            {step < 5 && (
              <div className="flex justify-between items-center pt-8 border-t border-border">
                <button
                  onClick={prevStep}
                  disabled={step === 0}
                  className="btn-ghost disabled:opacity-0"
                >
                  Précédent
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canNext()}
                  className="btn-primary disabled:opacity-30"
                >
                  Continuer
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile summary toggle */}
          <button
            onClick={() => setShowSummaryMobile(!showSummaryMobile)}
            className="lg:hidden flex items-center gap-2 w-full py-3 px-5 bg-surface-0 rounded-2xl border border-border text-sm font-semibold text-ink-2"
          >
            {showSummaryMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showSummaryMobile ? "Masquer le récapitulatif" : "Voir le récapitulatif"}
          </button>

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
