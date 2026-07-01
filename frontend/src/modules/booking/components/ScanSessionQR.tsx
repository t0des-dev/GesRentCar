"use client";

import { useEffect, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Loader2, CheckCircle2, Clock, ScanLine } from "lucide-react";
import { cn } from "@/shared/utils";
import { scanSessionService, type ScanSession, type ScanSessionStatus } from "@/lib/api/scan-sessions";

interface ScanSessionQRProps {
  onComplete: (data: { name?: string; cin?: string; licenseNumber?: string; cinImageUrl?: string; licenseImageUrl?: string }) => void;
  onScanningChange?: (scanning: boolean) => void;
}

export default function ScanSessionQR({ onComplete, onScanningChange }: ScanSessionQRProps) {
  const [session, setSession] = useState<ScanSession | null>(null);
  const [status, setStatus] = useState<ScanSessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const createSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await scanSessionService.create();
      setSession(s);
      onScanningChange?.(true);
    } catch {
      setError("Impossible de créer la session de scan.");
    } finally {
      setLoading(false);
    }
  }, [onScanningChange]);

  // Poll status every 2s
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(async () => {
      try {
        const s = await scanSessionService.getStatus(session.session_id);
        setStatus(s);

        if (s.status === "completed") {
          clearInterval(interval);
          onScanningChange?.(false);
          onComplete({
            name: s.cin_name ?? undefined,
            cin: s.cin_number ?? undefined,
            licenseNumber: s.license_number ?? undefined,
            cinImageUrl: s.cin_image_url ?? undefined,
            licenseImageUrl: s.license_image_url ?? undefined,
          });
        } else if (s.status === "expired") {
          clearInterval(interval);
          onScanningChange?.(false);
          setError("Session expirée. Générez un nouveau QR code.");
        }
      } catch {
        // Silently retry on next tick
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [session, onComplete, onScanningChange]);

  useEffect(() => {
    createSession();
  }, [createSession]);

  const expiresIn = session
    ? Math.max(0, Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000))
    : 0;

  if (loading && !session) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Génération du QR code...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-xs text-red-500 font-semibold">{error}</p>
        <button onClick={createSession} className="text-xs text-primary font-bold underline">
          Réessayer
        </button>
      </div>
    );
  }

  if (!mounted || !session) return null;

  const isCompleted = status?.status === "completed";
  const isExpired = status?.status === "expired" || expiresIn <= 0;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* QR Code */}
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex flex-col items-center justify-center gap-3"
          >
            <CheckCircle2 size={48} className="text-emerald-500" />
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Scan terminé</p>
          </motion.div>
        ) : isExpired ? (
          <motion.div
            key="expired"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 rounded-3xl bg-red-50 border-2 border-red-200 flex flex-col items-center justify-center gap-3"
          >
            <Clock size={48} className="text-red-400" />
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Expiré</p>
            <button onClick={createSession} className="text-[10px] text-red-600 font-bold underline">
              Nouveau QR
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="qr"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg">
              <QRCodeSVG
                value={session.scan_url}
                size={180}
                bgColor="#ffffff"
                fgColor="#1a1a2e"
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Pulse ring */}
            {status?.status === "scanning" && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-2 border-primary rounded-3xl"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status text */}
      <div className="text-center space-y-2">
        {isCompleted ? (
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Données reçues — formulaire pré-rempli
          </p>
        ) : isExpired ? (
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">
            QR code expiré
          </p>
        ) : status?.status === "scanning" ? (
          <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2 justify-center">
            <ScanLine size={14} className="animate-pulse" />
            Scan en cours sur le téléphone...
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 justify-center">
              <Smartphone size={14} className="text-slate-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Scannez avec votre téléphone
              </p>
            </div>
            <p className="text-[10px] text-slate-400">
              Ouvrez l&apos;appareil photo et scannez ce QR code
            </p>
          </>
        )}
      </div>

      {/* Timer */}
      {!isCompleted && !isExpired && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
          <Clock size={10} />
          Expire dans {Math.floor(expiresIn / 60)}:{String(expiresIn % 60).padStart(2, "0")}
        </div>
      )}

      {/* Refresh button when expired */}
      {isExpired && (
        <button
          onClick={createSession}
          className="text-xs font-bold text-primary underline hover:text-primary/80 transition-colors"
        >
          Générer un nouveau QR code
        </button>
      )}
    </div>
  );
}
