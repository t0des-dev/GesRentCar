"use client";

import { useState } from "react";
import { Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import axios from "axios";
import { fmt } from "@/shared/utils/format";
import { reservationService } from "@/lib/api/reservations";

interface CmiCheckoutProps {
  bookingPayload: {
    vehicle_id: number;
    start_date: string;
    end_date: string;
    client: {
      name: string;
      email: string;
      phone: string;
      cin: string;
      license_number?: string;
      cin_image_url?: string;
      license_image_url?: string;
    };
    signature?: string;
    options?: any;
  };
  deposit: number;
  onSuccess?: (reservationId?: number, status?: string) => void;
}

export function CmiCheckout({ bookingPayload, deposit, onSuccess }: CmiCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCmiPay = async () => {
    setLoading(true);
    setError("");

    try {
      const reservation = await reservationService.create({
        ...bookingPayload,
        payment_method: "cmi",
      });

      const reservationId = reservation.id;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cmi/init/${reservationId}`);
      const { action_url, params } = response.data;

      if (onSuccess) onSuccess(reservationId, reservation.status);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = action_url;

      Object.keys(params).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("CMI Init Error:", err);
      setError("Impossible d'initialiser le paiement CMI. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-100">
            <img src="/cmi-logo.png" alt="CMI" className="w-10 h-auto grayscale-0" onError={(e) => e.currentTarget.src = 'https://www.cmi.co.ma/sites/default/files/Logo-cmi_0.png'} />
        </div>
        <div>
            <h3 className="text-blue-900 font-bold text-lg">Centre Monétique Interbancaire</h3>
            <p className="text-blue-700/70 text-sm font-medium mt-1">Paiement sécurisé via toutes les cartes bancaires marocaines et internationales.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <ShieldCheck className="text-green-600" size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">3D Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <ExternalLink className="text-blue-600" size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Redirection</span>
          </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
          {error}
        </div>
      )}

      <button
        onClick={handleCmiPay}
        disabled={loading}
        className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={22} />
        ) : (
          <img src="https://www.cmi.co.ma/sites/default/files/Logo-cmi_0.png" className="h-5 brightness-0 invert" alt="" />
        )}
        {loading ? "Redirection..." : `Payer ${fmt(deposit)} DH via CMI`}
      </button>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
        Vous allez être redirigé vers la plateforme sécurisée du CMI
      </p>
    </div>
  );
}
