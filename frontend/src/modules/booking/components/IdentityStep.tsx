"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/shared/utils";
import { ScanLine, Loader2, ShieldCheck, QrCode, Smartphone, Camera, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingStepProps, BookingState } from "@/types/booking";
import DocumentScanOverlay from "./DocumentScanOverlay";
import { scanSessionService, type ScanSession } from "@/lib/api/scan-sessions";

const ScanSessionQR = dynamic(() => import("./ScanSessionQR"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-4 py-12">
      <Loader2 className="animate-spin text-primary" size={32} />
      <p className="text-xs text-ink-3 uppercase tracking-wider font-semibold">Chargement...</p>
    </div>
  ),
});

interface IdentityStepProps extends BookingStepProps {
  isScanning: boolean;
  setIsScanning: (val: boolean) => void;
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>;
  getFieldError: (field: string) => string | null;
  handleBlur: (field: string, value: string) => void;
  clientFieldChange: (field: string, value: string) => void;
}

function FieldError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-xs font-semibold text-red-500"
    >
      <AlertCircle size={12} />
      {error}
    </motion.p>
  );
}

export default function IdentityStep({ booking, update, isScanning, setIsScanning, setBooking, getFieldError, handleBlur, clientFieldChange }: IdentityStepProps) {
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayScanType, setOverlayScanType] = useState<"cin" | "license">("cin");
  const [overlayScanning, setOverlayScanning] = useState(false);
  const [scanSession, setScanSession] = useState<ScanSession | null>(null);
  const [scanData, setScanData] = useState<{
    name?: string; cin?: string; licenseNumber?: string;
    cinImageUrl?: string; licenseImageUrl?: string;
  }>({});

  const handleScanComplete = useCallback((data: {
    name?: string;
    cin?: string;
    licenseNumber?: string;
    cinImageUrl?: string;
    licenseImageUrl?: string;
  }) => {
    setBooking((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        name: data.name || prev.client.name,
        cin: data.cin || prev.client.cin,
        licenseNumber: data.licenseNumber || prev.client.licenseNumber,
        cinImageUrl: data.cinImageUrl || prev.client.cinImageUrl,
        licenseImageUrl: data.licenseImageUrl || prev.client.licenseImageUrl,
        verified: true,
      },
    }));

    setScanSuccess(true);
    setTimeout(() => {
      setScanSuccess(false);
      setShowQR(false);
    }, 3000);
  }, [setBooking]);

  const handleOpenCamera = useCallback(async () => {
    try {
      const session = await scanSessionService.create();
      setScanSession(session);
      setScanData({});
      setOverlayScanType("cin");
      setOverlayScanning(false);
      setShowOverlay(true);
      setIsScanning(true);
    } catch {
      setIsScanning(false);
    }
  }, [setIsScanning]);

  const handleOverlayCapture = useCallback(async (file: File) => {
    if (!scanSession) return;
    setOverlayScanning(true);

    try {
      const result = await scanSessionService.upload(scanSession.token, overlayScanType, file);

      if (!result.success) {
        setOverlayScanning(false);
        return;
      }

      const newData = { ...scanData };
      if (overlayScanType === "cin") {
        newData.name = result.data?.name || "";
        newData.cin = result.data?.id_number || "";
        newData.cinImageUrl = result.data?.image_url || "";
      } else {
        newData.licenseNumber = result.data?.license_number || "";
        newData.licenseImageUrl = result.data?.image_url || "";
      }
      setScanData(newData);

      if (result.status === "completed") {
        setShowOverlay(false);
        setIsScanning(false);
        handleScanComplete(newData);
      } else {
        setOverlayScanType("license");
        setOverlayScanning(false);
      }
    } catch {
      setOverlayScanning(false);
    }
  }, [scanSession, overlayScanType, scanData, setIsScanning, handleScanComplete]);

  const handleCloseOverlay = useCallback(() => {
    setShowOverlay(false);
    setIsScanning(false);
    setScanSession(null);
  }, [setIsScanning]);

  return (
    <div className="space-y-8">
      {/* AI Scanner Box */}
      <div className="bg-surface-1 rounded-3xl p-10 border border-border/80 relative overflow-hidden">
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
                <h3 className="text-2xl font-bold text-ink-1 mb-3 tracking-tight">
                  Vérification <span className="text-primary">Instantanée</span>
                </h3>
                <p className="text-sm text-ink-2 leading-relaxed">
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
                  isScanning ? "bg-surface-3 text-ink-2 border-transparent cursor-not-allowed" :
                  "bg-surface-0 text-ink-1 border-border hover:border-primary/50 hover:shadow-md"
                )}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <QrCode size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider">Scanner depuis le téléphone</p>
                  <p className="text-[10px] text-ink-3 mt-1">CIN & Permis en un scan</p>
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
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-2">
                      Scannez ce QR code avec votre téléphone
                    </p>
                  </div>

                  <ScanSessionQR
                    onComplete={handleScanComplete}
                    onScanningChange={setIsScanning}
                  />

                  <button
                    onClick={handleOpenCamera}
                    className="mt-4 inline-flex items-center gap-2 text-xs text-ink-3 font-semibold underline hover:text-slate-600 transition-colors"
                  >
                    <Camera size={14} />
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
                  <p className="text-xs text-ink-3 mt-1">Formulaire pré-rempli automatiquement</p>
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
              className="mt-8 flex items-center gap-4 bg-surface-0 border border-border p-6 rounded-2xl relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Identité Authentifiée</p>
                <p className="text-sm text-ink-2 italic">
                  Vos documents ont été validés par notre système.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual Fields */}
      <div className="bg-surface-0 p-10 rounded-3xl border border-border/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="md:col-span-2 mb-2">
          <h4 className="text-xl font-bold text-ink-1 tracking-tight">Informations Personnelles</h4>
          <p className="text-sm text-ink-3 mt-1">Vérifiez ou complétez les champs ci-dessous.</p>
        </div>

        {[
          { k: "name" as const, l: "Nom Complet", p: "Ex: John Doe" },
          { k: "email" as const, l: "Adresse Email", p: "Ex: contact@premium.com", t: "email" },
          { k: "phone" as const, l: "Téléphone Mobile", p: "Ex: +212 6 00 00 00 00", t: "tel" },
          { k: "cin" as const, l: "Numéro CIN / Passeport", p: "Ex: AB123456" },
          { k: "licenseNumber" as const, l: "Numéro de Permis", p: "Ex: 12345678", span: "md:col-span-2" }
        ].map((f) => {
          const err = getFieldError(f.k);
          return (
            <div key={f.k} className={cn("space-y-2", f.span || "")}>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-3 flex items-center gap-2">
                {f.l}
                {scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") &&
                  <span className="text-emerald-500 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">EXTRAIT PAR IA</span>
                }
              </label>
              <input
                type={f.t || "text"}
                placeholder={f.p}
                value={booking.client[f.k] ?? ""}
                onChange={(e) => clientFieldChange(f.k, e.target.value)}
                onBlur={(e) => handleBlur(f.k, e.target.value)}
                className={cn(
                  "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 outline-none transition-all duration-200 placeholder:text-ink-4",
                  err ? "border-red-200 bg-red-50" :
                  scanSuccess && (f.k === "name" || f.k === "cin" || f.k === "licenseNumber") ? "bg-emerald-50/30 border-emerald-100" : "border-border"
                )}
              />
              <FieldError error={err} />
            </div>
          );
        })}
      </div>

      <DocumentScanOverlay
        open={showOverlay}
        onClose={handleCloseOverlay}
        onCapture={handleOverlayCapture}
        scanning={overlayScanning}
        title={overlayScanType === "cin" ? "Carte Nationale d'Identité" : "Permis de Conduire"}
      />
    </div>
  );
}
