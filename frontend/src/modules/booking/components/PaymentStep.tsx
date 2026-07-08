"use client";

import { useState } from "react";
import { cn } from "@/shared/utils";
import { Lock, CreditCard, Globe, Banknote, Loader2, CheckCircle2, type LucideIcon } from "lucide-react";
import { BookingState } from "@/types/booking";
import { StripeCheckout } from "@/modules/payments/components/StripeCheckout";
import { CmiCheckout } from "@/modules/payments/components/CmiCheckout";
import { reservationService } from "@/lib/api/reservations";
import { motion, AnimatePresence } from "framer-motion";
import { notifyError } from "@/components/Notifications";
import { fmt } from "@/shared/utils/format";

interface PaymentStepProps {
  booking: BookingState;
  deposit: number;
  total: number;
  days: number;
  signature: string | null;
  onSuccess: (resId?: number, status?: string) => void;
  onPrev: () => void;
}

const GATEWAY_STYLES: Record<string, { selected: string; icon: string }> = {
  stripe: { selected: "border-indigo-600 bg-indigo-600 text-white", icon: "text-indigo-600" },
  cmi: { selected: "border-emerald-600 bg-emerald-600 text-white", icon: "text-emerald-600" },
  on_site: { selected: "border-amber-600 bg-amber-600 text-white", icon: "text-amber-600" },
};

const GATEWAYS: { id: "stripe" | "cmi" | "on_site"; label: string; sub: string; icon: LucideIcon }[] = [
  { id: "stripe", label: "Stripe", sub: "International", icon: CreditCard },
  { id: "cmi", label: "CMI", sub: "Maroc Local", icon: Globe },
  { id: "on_site", label: "Sur Place", sub: "Agence", icon: Banknote },
];

const CARD_LOGOS = [
  { src: "https://cdn.jsdelivr.net/gh/vectoria-assets/payment/visa.svg", label: "Visa" },
  { src: "https://cdn.jsdelivr.net/gh/vectoria-assets/payment/mastercard.svg", label: "Mastercard" },
  { src: "https://cdn.jsdelivr.net/gh/vectoria-assets/payment/cmi.svg", label: "CMI" },
];

export default function PaymentStep({ booking, deposit, total, days, signature, onSuccess, onPrev }: PaymentStepProps) {
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
      onSuccess(res.id, res.status);
    } catch (err) {
      console.error("OnSite Reservation Error", err);
      notifyError("Une erreur est survenue lors de la reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-0 p-10 rounded-3xl border border-border/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink-1 tracking-tight">Garantie & Paiement</h3>
            <p className="text-sm text-ink-3 italic">Sécurisez votre réservation via nos passerelles certifiées.</p>
          </div>
        </div>

        {/* Price Breakdown */}
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-1 rounded-2xl p-6 border border-border mb-8 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-4">Détail du prix</h4>
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Prix de base</span>
              <span className="font-semibold text-ink-1">{fmt(total - (booking.flexibility === "flexible" ? 60 * days : 0) - (booking.mileage === "unlimited" ? 140 * days : 0))} DH</span>
            </div>
            {booking.flexibility === "flexible" && (
              <div className="flex justify-between text-sm">
                <span className="text-ink-3">Flexibilité</span>
                <span className="font-semibold text-ink-1">+{fmt(60 * days)} DH</span>
              </div>
            )}
            {booking.mileage === "unlimited" && (
              <div className="flex justify-between text-sm">
                <span className="text-ink-3">Kilométrage illimité</span>
                <span className="font-semibold text-ink-1">+{fmt(140 * days)} DH</span>
              </div>
            )}
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-bold text-ink-1">Total</span>
              <span className="text-xl font-bold text-ink-1">{fmt(total)} DH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-4">Acompte (10%)</span>
              <span className="font-semibold text-emerald-600">{fmt(deposit)} DH</span>
            </div>
          </motion.div>
        )}

        {/* Gateway Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {GATEWAYS.map((gateway) => {
            const isSelected = selectedGateway === gateway.id;
            const gwStyle = GATEWAY_STYLES[gateway.id];
            const Icon = gateway.icon;

            return (
              <button
                key={gateway.id}
                onClick={() => setSelectedGateway(gateway.id)}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 group",
                  isSelected ? gwStyle.selected + " scale-[1.02] shadow-sm" : "border-border bg-surface-1/50 text-ink-3 hover:border-border hover:bg-surface-0"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isSelected ? "bg-surface-0/20" : "bg-surface-0 border border-border"
                )}>
                  <Icon size={20} className={isSelected ? "text-white" : "text-ink-2"} />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-semibold uppercase tracking-wider">{gateway.label}</span>
                  <span className="text-[10px] opacity-60 font-medium">{gateway.sub}</span>
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
                    bookingPayload={{
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
                    }}
                    deposit={deposit}
                    onSuccess={(resId) => { if (resId) onSuccess(resId); }}
                  />
                </motion.div>
              )}
              {selectedGateway === "on_site" && (
                <motion.div key="on_site" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full text-center space-y-6">
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100/50">
                    <p className="text-amber-700 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                      Vous avez choisi de régler le montant total ou l&apos;acompte directement en agence lors de la prise en charge.
                      <br /><br />
                      <span className="text-xs opacity-70">Votre réservation sera confirmée immédiatement après validation.</span>
                    </p>
                  </div>
                  <button
                    onClick={handleOnSiteReservation}
                    disabled={loading}
                    className="w-full py-5 rounded-xl bg-amber-600 text-white font-semibold uppercase text-xs tracking-wider hover:bg-amber-700 shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    {loading ? "Confirmation en cours..." : "Confirmer ma réservation"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="text-ink-4 flex flex-col items-center gap-3 py-10">
              <CreditCard size={36} className="opacity-20" />
              <p className="text-xs font-semibold uppercase tracking-wider">En attente de finalisation...</p>
            </div>
          )}
        </div>

        {/* Card logos */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-6 opacity-40">
            {CARD_LOGOS.map((card) => (
              <div key={card.label} className="flex items-center gap-2">
                <div className="w-8 h-5 bg-surface-2 rounded border border-border flex items-center justify-center text-[7px] font-bold text-ink-4 uppercase">
                  {card.label}
                </div>
                <span className="text-[9px] text-ink-4 font-medium">{card.label}</span>
              </div>
            ))}
            <span className="text-[9px] text-ink-4 font-medium">+ autres</span>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={onPrev}
          className="px-8 py-4 rounded-xl text-ink-3 font-semibold uppercase text-xs tracking-wider hover:bg-surface-1 transition-all flex items-center gap-2"
        >
          ← Retour aux options
        </button>
      </div>
    </div>
  );
}
