"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, Shield } from "lucide-react";
import api from "@/shared/services/client";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";

import VehicleInfo from "@/modules/booking/components/VehicleInfo";
import BookingForm from "@/modules/booking/components/BookingForm";
import BookingSuccess from "@/modules/booking/components/BookingSuccess";
import SignatureStep from "@/modules/booking/components/SignatureStep";
import { StripeCheckout } from "@/modules/payments/components/StripeCheckout";

const IMAGE_MAPPING: Record<string, string> = {
  "mercedes": "/mercedes_c_class_white_1777383858811.png",
  "bmw": "/bmw_x5_black_1777383873396.png",
  "range rover": "/range_rover_grey_1777383961416.png",
};

type BookingStep = "info" | "signature" | "payment" | "success";

export default function SearchClient() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<BookingStep>("info");
  const [totalPrice, setTotalPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [signature, setSignature] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", cin: "", start_date: "", end_date: "",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then(res => {
        setVehicle(res.data);
        setTotalPrice(res.data.price_per_day);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (form.start_date && form.end_date && vehicle) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const total = diffDays * vehicle.price_per_day;
      setTotalPrice(total);
      setDeposit(Math.floor(total * 0.15));
    }
  }, [form.start_date, form.end_date, vehicle]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("signature");
  };

  const handleSignatureComplete = (sig: string) => {
    setSignature(sig);
    setStep("payment");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Initialisation de votre voyage...</p>
       </div>
    </div>
  );

  if (!vehicle) return <div className="container py-32">Véhicule introuvable.</div>;

  const vehicleImage = IMAGE_MAPPING[vehicle.brand.toLowerCase()] || "/car-placeholder.png";

  const bookingPayload = {
    vehicle_id: Number(id),
    start_date: form.start_date,
    end_date: form.end_date,
    client: {
      name: form.name,
      email: form.email,
      phone: form.phone,
      cin: form.cin
    },
    signature: signature || undefined
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#f8fafc] relative selection:bg-primary/10 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1000px] pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-400 hover:text-primary transition-all text-xs font-black uppercase tracking-widest">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la sélection
          </button>
          
          <div className="flex items-center gap-6">
             {["info", "signature", "payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step === s ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : i < ["info", "signature", "payment"].indexOf(step) ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-400"}`}>
                      {i < ["info", "signature", "payment"].indexOf(step) ? <CheckCircle2 size={14} /> : i + 1}
                   </div>
                   {i < 2 && <div className={`w-12 h-0.5 rounded-full ${i < ["info", "signature", "payment"].indexOf(step) ? "bg-emerald-500" : "bg-slate-200"}`} />}
                </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <VehicleInfo vehicle={vehicle} image={vehicleImage} />
          </div>

          <aside className="lg:col-span-5 bg-white rounded-[40px] border border-slate-200/60 shadow-2xl p-10 lg:sticky lg:top-32 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {step === "info" && (
                <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Estimation du séjour</p>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{totalPrice.toLocaleString("fr-FR")} DH</h2>
                    </div>
                    <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">{form.start_date && form.end_date ? "Total" : "/ jour"}</span>
                    </div>
                  </div>
                  <BookingForm form={form} setForm={setForm} onSubmit={handleInfoSubmit} loading={false} today={today} />
                </motion.div>
              )}

              {step === "signature" && (
                <SignatureStep key="signature" onComplete={handleSignatureComplete} onBack={() => setStep("info")} />
              )}

              {step === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                   <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4">
                         <Shield size={14} /> Paiement de l'acompte (15%)
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{deposit.toLocaleString()} DH</h3>
                      <p className="text-slate-400 text-xs font-medium italic">Le reste ({ (totalPrice - deposit).toLocaleString() } DH) sera payé lors de la prise du véhicule.</p>
                   </div>
                   <StripeCheckout deposit={deposit} bookingPayload={bookingPayload} onSuccess={() => setStep("success")} />
                </motion.div>
              )}

              {step === "success" && (
                <BookingSuccess key="success" />
              )}
            </AnimatePresence>

            {step !== "success" && (
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500"><CheckCircle2 size={14} /> Annulation gratuite (24h)</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><CheckCircle2 size={14} /> Kilométrage illimité</div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
