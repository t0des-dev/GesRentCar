"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, CreditCard, Globe, Banknote, Loader2, CheckCircle2 } from "lucide-react";
import { BookingState } from "@/types/booking";
import { StripeCheckout } from "@/components/StripeCheckout";
import { CmiCheckout } from "@/components/CmiCheckout";
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="flex items-center gap-6 mb-10 border-b border-slate-50 pb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
            <Lock size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Garantie & Paiement</h3>
            <p className="text-sm text-slate-400 font-medium italic">Sécurisez votre réservation via nos passerelles certifiées.</p>
          </div>
        </div>

        {/* Gateway Selector - Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { id: "stripe", label: "Stripe", sub: "International", icon: CreditCard, color: "slate-900" },
            { id: "cmi", label: "CMI", sub: "Maroc Local", icon: Globe, color: "blue-600" },
            { id: "on_site", label: "Sur Place", sub: "Agence", icon: Banknote, color: "emerald-600" },
          ].map((gateway) => (
            <button
              key={gateway.id}
              onClick={() => setSelectedGateway(gateway.id as any)}
              className={cn(
                "flex flex-col items-center gap-4 p-8 rounded-[32px] border-2 transition-all duration-500 group",
                selectedGateway === gateway.id 
                  ? `border-${gateway.color} bg-${gateway.color} text-white shadow-2xl scale-[1.05]` 
                  : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedGateway === gateway.id ? "bg-white/20" : "bg-white shadow-sm"
              )}>
                <gateway.icon size={24} className={cn(
                  selectedGateway === gateway.id ? "text-white" : `text-${gateway.color}`
                )} />
              </div>
              <div className="text-center">
                <span className="block text-xs font-black uppercase tracking-[0.2em]">{gateway.label}</span>
                <span className="text-[10px] opacity-60 font-bold">{gateway.sub}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="min-h-[200px] flex flex-col items-center justify-center">
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
                <motion.div key="on_site" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center space-y-8">
                  <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100/50">
                    <p className="text-emerald-700 font-bold text-sm leading-relaxed max-w-sm mx-auto">
                      Vous avez choisi de régler le montant total ou l'acompte directement en agence lors de la prise en charge. 
                      <br/><br/>
                      <span className="text-xs opacity-70">Votre réservation sera confirmée immédiatement après validation.</span>
                    </p>
                  </div>
                  <button 
                    onClick={handleOnSiteReservation}
                    disabled={loading}
                    className="w-full py-6 rounded-[24px] bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-emerald-700 shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                    {loading ? "Confirmation en cours..." : "Confirmer ma réservation"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="text-slate-300 flex flex-col items-center gap-4 py-12">
              <CreditCard size={48} className="opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">En attente de finalisation...</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start">
        <button 
          onClick={onPrev} 
          className="px-10 py-5 rounded-[24px] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          ← Retour aux options
        </button>
      </div>
    </div>
  );
}
