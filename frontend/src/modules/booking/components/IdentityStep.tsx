"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/shared/utils";
import { ScanLine, Loader2, ShieldCheck, QrCode, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingStepProps } from "@/types/booking";

const ScanSessionQR = dynamic(() => import("./ScanSessionQR"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-4 py-12">
      <Loader2 className="animate-spin text-primary" size={32} />
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Chargement...</p>
    </div>
  ),
});

interface IdentityStepProps extends BookingStepProps {
  isScanning: boolean;
  setIsScanning: (val: boolean) => void;
}

export default function IdentityStep({ booking, update, isScanning, setIsScanning }: IdentityStepProps) {
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleScanComplete = useCallback((data: {
    name?: string;
    cin?: string;
    licenseNumber?: string;
    cinImageUrl?: string;
    licenseImageUrl?: string;
  }) => {
    update("client", {
      ...booking.client,
      name: data.name || booking.client.name,
      cin: data.cin || booking.client.cin,
      licenseNumber: data.licenseNumber || booking.client.licenseNumber,
      cinImageUrl: data.cinImageUrl || booking.client.cinImageUrl,
      licenseImageUrl: data.licenseImageUrl || booking.client.licenseImageUrl,
    });

    setTimeout(() => {
      update("client", { ...booking.client, verified: true });
    }, 1500);

    setScanSuccess(true);
    setTimeout(() => {
      setScanSuccess(false);
      setShowQR(false);
    }, 3000);
  }, [booking.client, update]);

  return (
    <div className="space-y-8">
      {/* AI Scanner Box */}
      <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100/80 relative overflow-hidden">
        {isScanning && (
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-0.5 bg-primary z-20"
          />
        )}

        <div className="relative z-10">
          {/* Intro text */}
          {!showQR && !scanSuccess && (
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-md text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
                  <ScanLine size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">IA Smart Verification</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  Vérification <span className="text-primary">Instantanée</span>
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Scannez vos documents depuis votre téléphone. Le formulaire se remplit automatiquement.
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowQR(true)}
                disabled={isScanning}
                className={cn(
                  "flex flex-col items-center gap-3 px-10 py-8 rounded-2xl font-semibold transition-all border text-center min-w-[220px]",
                  isScanning ? "bg-slate-200 text-slate-500 border-transparent cursor-not-allowed" :
                  "bg-white text-slate-900 border-slate-200 hover:border-primary/50 hover:shadow-md"
                )}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <QrCode size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider">Scanner depuis le téléphone</p>
                  <p className="text-[10px] text-slate-400 mt-1">CIN & Permis en un scan</p>
                </div>
              </motion.button>
            </div>
          )}

          {/* QR Code display */}
          <AnimatePresence mode="wait">
            {showQR && !scanSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-6">
                    <Smartphone size={16} className="text-primary" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Scannez ce QR code avec votre téléphone
                    </p>
                  </div>

                  <ScanSessionQR onComplete={handleScanComplete} />

                  <button
                    onClick={() => setShowQR(false)}
                    className="mt-4 text-xs text-slate-400 font-semibold underline hover:text-slate-600 transition-colors"
                  >
                    Utiliser la caméra de cet appareil
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success badge */}
          <AnimatePresence>
            {scanSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Documents reçus !</p>
                  <p className="text-xs text-slate-400 mt-1">Formulaire pré-rempli automatiquement</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Identity Verified Badge */}
        <AnimatePresence>
          {booking.client.verified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 flex items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Identité Authentifiée</p>
                <p className="text-sm text-slate-500 italic">
                  Vos documents ont été validés par notre système.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual Fields */}
      <div className="bg-white p-10 rounded-3xl border border-slate-100/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="md:col-span-2 mb-2">
          <h4 className="text-xl font-bold text-slate-900 tracking-tight">Informations Personnelles</h4>
          <p className="text-sm text-slate-400 mt-1">Vérifiez ou complétez les champs ci-dessous.</p>
        </div>

        {[
          { k: "name" as const, l: "Nom Complet", p: "Ex: John Doe" },
          { k: "email" as const, l: "Adresse Email", p: "Ex: contact@premium.com", t: "email" },
          { k: "phone" as const, l: "Téléphone Mobile", p: "Ex: +212 6 00 00 00 00", t: "tel" },
          { k: "cin" as const, l: "Numéro CIN / Passeport", p: "Ex: AB123456" },
          { k: "licenseNumber" as const, l: "Numéro de Permis", p: "Ex: 12345678", span: "md:col-span-2" }
        ].map((f) => (
          <div key={f.k} className={cn("space-y-2", f.span || "")}>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              {f.l}
              {scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") &&
                <span className="text-emerald-500 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">EXTRAIT PAR IA</span>
              }
            </label>
            <input
              type={f.t || "text"}
              placeholder={f.p}
              value={booking.client[f.k] ?? ""}
              onChange={(e) => update("client", { ...booking.client, [f.k]: e.target.value })}
              className={cn(
                "w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:border-primary/20 outline-none transition-all duration-200 placeholder:text-slate-300",
                scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") ? "bg-emerald-50/30 border-emerald-100" : ""
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
