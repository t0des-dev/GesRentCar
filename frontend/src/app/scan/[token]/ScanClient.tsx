"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Loader2, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils";
import { compressImage } from "@/shared/utils/image";
import { scanSessionService } from "@/lib/api/scan-sessions";

type Step = "loading" | "camera" | "uploading" | "done" | "error";

export default function ScanClient() {
  const { token } = useParams<{ token: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<Step>("loading");
  const [scanType, setScanType] = useState<"cin" | "license">("cin");
  const [errorMsg, setErrorMsg] = useState("");
  const [cinDone, setCinDone] = useState(false);
  const [licenseDone, setLicenseDone] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const loc = (fr: string) => fr;

  // Verify token is valid
  useEffect(() => {
    scanSessionService.phoneStatus(token)
      .then((data) => {
        if (data.status === "completed") {
          setStep("done");
        } else if (data.status === "expired") {
          setErrorMsg(loc("Session expirée. Retournez sur votre ordinateur."));
          setStep("error");
        } else {
          if (data.cin_number) setCinDone(true);
          if (data.license_number) setLicenseDone(true);
          setStep("camera");
          startCamera();
        }
      })
      .catch(() => {
        setErrorMsg(loc("Lien invalide ou expiré."));
        setStep("error");
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [token]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch {
      setErrorMsg(loc("Caméra indisponible. Autorisez l'accès dans les paramètres."));
      setStep("error");
    }
  };

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || step === "uploading") return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    setStep("uploading");

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setStep("camera");
        return;
      }

      const file = new File([blob], `scan_${scanType}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
      const compressed = await compressImage(file);

      try {
        const result = await scanSessionService.upload(token, scanType, compressed);

        if (!result.success) {
          setErrorMsg(result.message || loc("Impossible de lire le document. Réessayez avec un meilleur éclairage."));
          setStep("error");
          return;
        }

        if (scanType === "cin") {
          setCinDone(true);
          if (result.status !== "completed") {
            setScanType("license");
          }
        } else {
          setLicenseDone(true);
        }

        if (result.status === "completed") {
          setStep("done");
        } else {
          setStep("camera");
          setCameraReady(false);
          await startCamera();
        }
      } catch {
        setErrorMsg(loc("Erreur lors de l'envoi. Réessayez."));
        setStep("error");
      }
    }, "image/jpeg", 0.92);
  }, [token, scanType, step]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep("uploading");
    const compressed = await compressImage(file);

    try {
      const result = await scanSessionService.upload(token, scanType, compressed);

      if (!result.success) {
        setErrorMsg(result.message || loc("Impossible de lire le document. Réessayez avec un meilleur éclairage."));
        setStep("error");
        return;
      }

      if (scanType === "cin") {
        setCinDone(true);
        if (result.status !== "completed") {
          setScanType("license");
        }
      } else {
        setLicenseDone(true);
      }

      if (result.status === "completed") {
        setStep("done");
      } else {
        setStep("camera");
        setCameraReady(false);
        await startCamera();
      }
    } catch {
      setErrorMsg(loc("Erreur lors de l'envoi. Réessayez."));
      setStep("error");
    }
  };

  // Loading state
  if (step === "loading") {
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-white" size={36} />
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">{loc("Vérification du lien...")}</p>
      </div>
    );
  }

  // Error state
  if (step === "error") {
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle size={32} className="text-red-400" />
        </div>
        <p className="text-white text-center text-sm font-medium">{errorMsg}</p>
      </div>
    );
  }

  // Done state
  if (step === "done") {
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center gap-6 px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-white" />
          </div>
        </motion.div>
        <div className="text-center">
          <h2 className="text-white text-xl font-bold mb-2">{loc("Documents envoyés !")}</h2>
          <p className="text-white/50 text-sm">{loc("Retournez sur votre ordinateur pour continuer.")}</p>
        </div>
      </div>
    );
  }

  // Camera / Uploading states
  return (
    <div className="min-h-[100dvh] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-black/80 backdrop-blur-sm z-20 shrink-0">
        <div>
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{loc("Scan Vectoria")}</p>
          <h3 className="text-white text-base font-bold">
            {scanType === "cin" ? loc("Carte Nationale d'Identité") : loc("Permis de Conduire")}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {cinDone && (
            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              <CheckCircle2 size={10} /> CIN
            </div>
          )}
          {licenseDone && (
            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              <CheckCircle2 size={10} /> {loc("Permis")}
            </div>
          )}
        </div>
      </div>

      {/* Camera */}
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />

        {/* Frame guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative w-[85vw] max-w-[360px] aspect-[1.586/1]">
            <div className="absolute -top-0.5 -left-0.5 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
            <div className="absolute -top-0.5 -right-0.5 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
            <div className="absolute -bottom-0.5 -left-0.5 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
            <div className="absolute -bottom-0.5 -right-0.5 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
            <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] rounded-lg" />

            {step === "uploading" && (
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.6)]"
              />
            )}
          </div>
        </div>

        {/* Hint */}
        <div className="absolute bottom-6 inset-x-0 text-center z-10">
          <p className="text-white/80 text-xs font-semibold drop-shadow-lg">
            {step === "uploading" ? loc("Analyse en cours...") : loc("Cadrez le document dans le cadre")}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-8 py-6 bg-black/80 backdrop-blur-sm z-20 shrink-0">
        {/* Gallery fallback */}
        <label className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors border border-white/20">
          <Camera size={20} />
          <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
        </label>

        {/* Capture */}
        <button
          onClick={handleCapture}
          disabled={step === "uploading" || !cameraReady}
          className={cn(
            "w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center transition-all",
            step === "uploading" ? "bg-white/20" : "bg-white hover:scale-105 active:scale-95"
          )}
        >
          {step === "uploading" ? (
            <Loader2 size={28} className="text-white animate-spin" />
          ) : (
            <div className="w-[58px] h-[58px] rounded-full bg-white" />
          )}
        </button>

        <div className="w-12 h-12" />
      </div>
    </div>
  );
}
