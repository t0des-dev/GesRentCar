"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useVehicles } from "@/hooks/useApi";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Components
import StepIndicator from "@/components/booking/StepIndicator";
import BookingSummary from "@/components/booking/BookingSummary";
import ConfirmationView from "@/components/booking/ConfirmationView";
import VehicleStep from "@/components/booking/VehicleStep";
import PeriodStep from "@/components/booking/PeriodStep";
import OptionsStep from "@/components/booking/OptionsStep";
import IdentityStep from "@/components/booking/IdentityStep";
import SignatureStep from "@/components/booking/SignatureStep";
import PaymentStep from "@/components/booking/PaymentStep";
import { VehicleShowroom } from "@/components/booking/VehicleShowroom";

// Types
import { BookingState } from "@/types/booking";

const MOCK_OPTIONS = [
  { id: "chauffeur", price: 1500, type: "per_day" },
  { id: "airport_vip", price: 500, type: "fixed" },
  { id: "champagne", price: 1200, type: "fixed" },
  { id: "vip_insure", price: 300, type: "per_day" },
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [previewVehicle, setPreviewVehicle] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles({ status: 'available' });
  const { t } = useTranslation();

  const [booking, setBooking] = useState<BookingState>({
    vehicleId: null, startDate: "", endDate: "", location: "", options: [],
    client: { 
      name: "", email: "", phone: "", cin: "", licenseNumber: "",
      cinImageUrl: "", licenseImageUrl: "", verified: false 
    },
    paymentMethod: "deposit_card",
  });

  const update = (key: keyof BookingState, val: any) => setBooking(prev => ({ ...prev, [key]: val }));
  
  const displayVehicles = useMemo(() => {
    if (!vehiclesData?.data) return [];
    return vehiclesData.data.map(v => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      price: v.price_per_day,
      type: "Premium",
      img: v.image_url ? `http://localhost:8000${v.image_url}` : "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600",
      specs: { transmission: v.transmission || "Auto", fuel: v.fuel_type || "Diesel", seats: v.seats || 5, mileage: v.mileage },
      desc: v.description_fr || "L'élégance et le confort absolu pour vos trajets."
    }));
  }, [vehiclesData]);

  const vehicle = displayVehicles.find(v => v.id === booking.vehicleId);
  const days = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const diff = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
    return Math.max(1, Math.round(diff / 86400000));
  }, [booking.startDate, booking.endDate]);

  const basePrice = vehicle ? vehicle.price * days : 0;
  const isHighSeason = booking.startDate && (new Date(booking.startDate).getMonth() === 6 || new Date(booking.startDate).getMonth() === 7);
  const dynamicBasePrice = Math.round(basePrice * (isHighSeason ? 1.15 : 1));
  
  const optionsPrice = booking.options.reduce((sum, optId) => {
    const opt = MOCK_OPTIONS.find(o => o.id === optId);
    if (!opt) return sum;
    return sum + (opt.type === "per_day" ? opt.price * days : opt.price);
  }, 0);

  const total = dynamicBasePrice + optionsPrice;
  const deposit = Math.round(total * 0.1);

  const canNext = () => {
    if (step === 0) return booking.vehicleId !== null;
    if (step === 1) return !!booking.startDate && !!booking.endDate && !!booking.location;
    if (step === 3) return !!(booking.client.name && booking.client.phone && booking.client.cin);
    if (step === 4) return !!signature;
    return true;
  };

  if (confirmed) {
    return (
      <ConfirmationView 
        booking={booking} 
        reservationId={reservationId} 
        deposit={deposit} 
        total={total} 
        vehicle={vehicle} 
      />
    );
  }

  return (
    <main className="min-h-screen pt-36 pb-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-16 text-center">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Votre Réservation</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4">Réservez <span className="text-gradient-gold">l'Exception</span></h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">Sécurisez votre véhicule de luxe en quelques étapes simples.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-2/3">
            <StepIndicator currentStep={step} onStepClick={setStep} />

            <div className="mb-8 min-h-[500px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && (
                    <VehicleStep 
                      booking={booking} 
                      update={update} 
                      isLoading={isLoadingVehicles} 
                      vehicles={displayVehicles} 
                      onPreview={setPreviewVehicle} 
                      onNext={() => setStep(1)} 
                    />
                  )}
                  {step === 1 && <PeriodStep booking={booking} update={update} />}
                  {step === 2 && <OptionsStep booking={booking} update={update} />}
                  {step === 3 && (
                    <IdentityStep 
                      booking={booking} 
                      update={update} 
                      isScanning={isScanning} 
                      setIsScanning={setIsScanning} 
                    />
                  )}
                  {step === 4 && (
                    <SignatureStep 
                      /* Force refresh props */
                      onComplete={(sig) => { setSignature(sig); setStep(5); }} 
                      onBack={() => setStep(3)} 
                    />
                  )}
                  {step === 5 && (
                    <PaymentStep 
                      booking={booking} 
                      deposit={deposit} 
                      reservationId={reservationId} 
                      signature={signature} 
                      onSuccess={(resId) => { if (resId) setReservationId(resId); setConfirmed(true); }}
                      onPrev={() => setStep(4)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {step < 5 && (
              <div className="flex justify-between items-center pt-10 border-t border-slate-100">
                <button 
                  onClick={() => setStep(Math.max(0, step - 1))} 
                  disabled={step === 0} 
                  className="px-10 py-5 rounded-[24px] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 disabled:opacity-0 transition-all flex items-center gap-2"
                >
                  Précédent
                </button>
                {step > 0 && (
                  <button 
                    onClick={() => setStep(step + 1)} 
                    disabled={!canNext()} 
                    className="px-12 py-5 rounded-[24px] bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-primary shadow-2xl hover:shadow-primary/30 disabled:opacity-30 disabled:hover:shadow-none transition-all flex items-center gap-3 group/btn"
                  >
                    Continuer
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            )}
          </div>

          <BookingSummary 
            booking={booking} 
            days={days} 
            total={total} 
            deposit={deposit} 
            vehicle={vehicle} 
          />
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
