"use client";

import { useState } from "react";
import { cn } from "@/shared/utils";
import { Lock, CreditCard, Globe, Banknote, Loader2, CheckCircle2 } from "lucide-react";
import { BookingState } from "@/types/booking";
import { StripeCheckout } from "@/modules/payments/components/StripeCheckout";
import { CmiCheckout } from "@/modules/payments/components/CmiCheckout";
import { reservationService } from "@/lib/api/reservations";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentStepProps {
  booking: BookingState;
  deposit: number;
  reservationId: number | null;
  signature: string | null;
  onSuccess: (resId?: number) => void;
  onPrev: () => void;
}

const GATEWAY_STYLES: Record<string, { selected: string; icon: string }> = {
  stripe: { selected: "border-slate-900 bg-slate-900 text-white", icon: "text-slate-900" },
  cmi: { selected: "border-primary bg-primary text-white", icon: "text-primary" },
  on_site: { selected: "border-emerald-600 bg-emerald-600 text-white", icon: "text-emerald-600" },
};

const GATEWAYS = [
  { id: "stripe", label: "Stripe", sub: "International", icon: CreditCard },
  { id: "cmi", label: "CMI", sub: "Maroc Local", icon: Globe },
  { id: "on_site", label: "Sur Place", sub: "Agence", icon: Banknote },
];

export default function PaymentStep({ booking, deposit, reservationId, signature, onSuccess, onPrev }: PaymentStepProps) {
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "cmi" | "on_site">("stripe");
  const [loading, setLoading] = useState(false);

  const handleOnSiteReservation = async () => {
    setLoading(true);
    try {
      const res = await reservationService.create({
        vehicle_id: booking.vehicleId!,
        start_date: booking.startDate,
        end_date: booking.endDate,
        signature: signature || undefined,
        client: {
          name: booking.client.name,
          email: booking.client.email,
          phone: booking.client.phone,
          cin: booking.client.cin,
          license_number: booking.client.licenseNumber,
          cin_image_url: booking.client.cinImageUrl,
          license_image_url: booking.client.licenseImageUrl,
        },
        options: {
          flexibility: booking.flexibility,
          mileage: booking.mileage,
        },
        payment_method: "on_site",
      });
      onSuccess(res.id);
    } catch (err) {
      console.error("OnSite Reservation Error", err);
      alert("Une erreur est survenue lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-10 rounded-3xl border border-slate-100/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Garantie & Paiement</h3>
            <p className="text-sm text-slate-400 italic">Sécurisez votre réservation via nos passerelles certifiées.</p>
          </div>
        </div>

        {/* Gateway Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {GATEWAYS.map((gateway) => {
            const isSelected = selectedGateway === gateway.id;
            const gwStyle = GATEWAY_STYLES[gateway.id];
            const Icon = gateway.icon;
            
            return (
              <button
                key={gateway.id}
                onClick={() => setSelectedGateway(gateway.id as any)}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 group",
                  isSelected ? gwStyle.selected + " scale-[1.02] shadow-sm" : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isSelected ? "bg-white/20" : "bg-white border border-slate-100"
                )}>
                  <Icon size={20} className={isSelected ? "text-white" : "text-slate-500"} />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-semibold uppercase tracking-wider">{gateway.label}</span>
                  <span className="text-xs opacity-60 font-medium">{gateway.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="min-h-[180px] flex flex-col items-center justify-center">
          {deposit > 0 && booking.vehicleId ? (
            <AnimatePresence mode="wait">
              {selectedGateway === "stripe" && (
                <motion.div key="stripe" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
                  <StripeCheckout
                    deposit={deposit}
                    bookingPayload={{
                      vehicle_id: booking.vehicleId,
                      start_date: booking.startDate,
                      end_date: booking.endDate,
                      signature: signature || undefined,
                      client: {
                        name: booking.client.name,
                        email: booking.client.email,
                        phone: booking.client.phone,
                        cin: booking.client.cin,
                        license_number: booking.client.licenseNumber,
                        cin_image_url: booking.client.cinImageUrl,
                        license_image_url: booking.client.licenseImageUrl,
                      },
                      options: {
                        flexibility: booking.flexibility,
                        mileage: booking.mileage,
                      },
                    }}
                    onSuccess={onSuccess}
                  />
                </motion.div>
              )}
              {selectedGateway === "cmi" && (
                <motion.div key="cmi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
                  <CmiCheckout 
                    reservationId={reservationId || 0}
                    deposit={deposit}
                  />
                </motion.div>
              )}
              {selectedGateway === "on_site" && (
                <motion.div key="on_site" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center space-y-6">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100/50">
                    <p className="text-emerald-700 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                      Vous avez choisi de régler le montant total ou l&apos;acompte directement en agence lors de la prise en charge. 
                      <br/><br/>
                      <span className="text-xs opacity-70">Votre réservation sera confirmée immédiatement après validation.</span>
                    </p>
                  </div>
                  <button 
                    onClick={handleOnSiteReservation}
                    disabled={loading}
                    className="w-full py-5 rounded-xl bg-emerald-600 text-white font-semibold uppercase text-xs tracking-wider hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    {loading ? "Confirmation en cours..." : "Confirmer ma réservation"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="text-slate-300 flex flex-col items-center gap-3 py-10">
              <CreditCard size={36} className="opacity-20" />
              <p className="text-xs font-semibold uppercase tracking-wider">En attente de finalisation...</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start">
        <button 
          onClick={onPrev} 
          className="px-8 py-4 rounded-xl text-slate-400 font-semibold uppercase text-xs tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          ← Retour aux options
        </button>
      </div>
    </div>
  );
}
