"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, CreditCard, Globe } from "lucide-react";
import { BookingState } from "@/types/booking";
import { StripeCheckout } from "@/components/StripeCheckout";
import { CmiCheckout } from "@/components/CmiCheckout";

interface PaymentStepProps {
  booking: BookingState;
  deposit: number;
  reservationId: number | null;
  signature: string | null;
  onSuccess: (resId?: number) => void;
  onPrev: () => void;
}

export default function PaymentStep({ booking, deposit, reservationId, signature, onSuccess, onPrev }: PaymentStepProps) {
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "cmi">("stripe");

  return (
    <div className="animate-in fade-in">
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
          <Lock className="text-green-500" size={24} />
          <div>
            <h3 className="text-xl font-black text-slate-900">Garantie "Hold my Car"</h3>
            <p className="text-sm text-slate-500 font-medium">Bloquez votre véhicule en réglant l'acompte de 10%.</p>
          </div>
        </div>

        {/* Gateway Selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedGateway("stripe")}
            className={cn(
              "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all",
              selectedGateway === "stripe" 
                ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
            )}
          >
            <CreditCard size={24} />
            <span className="text-xs font-black uppercase tracking-widest">Stripe (International)</span>
          </button>
          <button
            onClick={() => setSelectedGateway("cmi")}
            className={cn(
              "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all",
              selectedGateway === "cmi" 
                ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
            )}
          >
            <Globe size={24} />
            <span className="text-xs font-black uppercase tracking-widest">CMI (Maroc Local)</span>
          </button>
        </div>

        {deposit > 0 && booking.vehicleId ? (
          selectedGateway === "stripe" ? (
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
          ) : (
            <CmiCheckout 
              reservationId={reservationId || 0}
              deposit={deposit}
            />
          )
        ) : (
          <p className="text-slate-400 text-center py-8">Sélectionnez un véhicule et des dates pour continuer.</p>
        )}
      </div>

      <div className="pt-6 border-t-2 border-slate-100 mt-6">
        <button onClick={onPrev} className="px-8 py-4 rounded-2xl text-slate-400 font-black hover:bg-slate-100 transition-all">← Retour</button>
      </div>
    </div>
  );
}
