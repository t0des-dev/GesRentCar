"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { stripeService } from "@/lib/api/stripe";

// ─── Stripe instance (singleton) ─────────────────────────────────────────────
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

// ─── Stripe Appearance for Arctic Luxury theme ────────────────────────────────
const appearance = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#6366f1",
    colorBackground: "#f8fafc",
    colorText: "#0f172a",
    colorDanger: "#ef4444",
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: "16px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "2px solid #e2e8f0",
      padding: "14px 18px",
      fontSize: "15px",
      fontWeight: "600",
    },
    ".Input:focus": {
      border: "2px solid #6366f1",
      boxShadow: "0 0 0 4px rgba(99,102,241,0.1)",
    },
    ".Label": {
      fontSize: "11px",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#64748b",
      marginBottom: "8px",
    },
  },
};

// ─── Inner form (must be inside <Elements>) ───────────────────────────────────
function CheckoutForm({
  reservationId,
  deposit,
  onSuccess,
}: {
  reservationId: number;
  deposit: number;
  onSuccess: (reservationId?: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isReady, setIsReady] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements || !isReady) return;
    setStatus("loading");
    setErrorMsg("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/booking/success",
      },
      redirect: "if_required",
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message ?? "Une erreur est survenue.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await stripeService.confirm(reservationId, paymentIntent.id);
        onSuccess(reservationId);
      } catch {
        onSuccess(reservationId);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className={!isReady ? "opacity-50 pointer-events-none" : ""}>
        <PaymentElement
          onReady={() => setIsReady(true)}
          onLoadError={(e) => {
            setErrorMsg("Échec du chargement du module de paiement.");
            console.error("Stripe Load Error:", e);
          }}
          options={{
            layout: "accordion",
            defaultValues: { billingDetails: { address: { country: "MA" } } },
          }}
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-sm font-semibold">{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={!stripe || !isReady || status === "loading"}
        className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3"
      >
        {status === "loading" ? (
          <Loader2 className="animate-spin" size={22} />
        ) : (
          <Lock size={20} />
        )}
        {status === "loading" ? "Traitement en cours..." : `Payer ${deposit.toLocaleString()} DH`}
      </button>

      <p className="text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
        <Lock size={12} /> Paiement 100% sécurisé par Stripe (PCI-DSS Level 1)
      </p>
    </div>
  );
}

// ─── Public component: create intent then render Elements ─────────────────────
export interface StripeCheckoutProps {
  deposit: number;
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
  onSuccess: (reservationId?: number) => void;
}

export function StripeCheckout({ deposit, bookingPayload, onSuccess }: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [initError, setInitError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deposit || !bookingPayload.vehicle_id) {
      setLoading(false);
      return;
    }

    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key || key.includes("1000000")) {
      console.error("Stripe Error: Publishable key is missing or is a placeholder.");
      setInitError("Erreur de configuration Stripe (Clé manquante).");
      setLoading(false);
      return;
    }

    stripeService
      .createIntent({ ...bookingPayload, amount: deposit })
      .then((res) => {
        if (!res.client_secret) {
          throw new Error("Client secret missing from API response");
        }
        setClientSecret(res.client_secret);
        setReservationId(res.reservation_id);
      })
      .catch((err) => {
        console.error("Stripe Intent Error:", err);
        const msg = err?.response?.data?.message ?? "Impossible d'initialiser le paiement.";
        setInitError(msg);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-4">
        <Loader2 className="animate-spin" size={32} />
        <p className="font-semibold">Initialisation du paiement sécurisé...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="text-red-500" size={28} />
        </div>
        <p className="text-red-600 font-bold text-center max-w-sm">{initError}</p>
        <p className="text-slate-400 text-sm text-center">Vérifiez la disponibilité du véhicule et réessayez.</p>
      </div>
    );
  }

  if (!clientSecret || !reservationId) return null;

  // Masking for security in logs
  const maskedSecret = clientSecret.substring(0, 10) + "..." + clientSecret.substring(clientSecret.length - 10);
  console.log("Stripe: Rendering Elements with clientSecret:", maskedSecret);

  return (
    <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm
        reservationId={reservationId}
        deposit={deposit}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
