"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface DocumentScanOverlayProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  scanning: boolean;
  title: string;
}

export default function DocumentScanOverlay({ open, onClose, onCapture, scanning, title }: DocumentScanOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          if (!cancelled) setCameraReady(true);
        }
      } catch {
        if (!cancelled) {
          const isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost";
          setError(isSecure
            ? "Caméra indisponible. Vérifiez les paramètres navigateur et autorisez l'accès caméra."
            : "La caméra nécessite HTTPS. Contactez l'administrateur pour activer le certificat SSL.");
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraReady(false);
      setError(null);
    };
  }, [open]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scan_${Date.now()}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
      onCapture(file);
    }, "image/jpeg", 0.92);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onCapture(e.target.files[0]);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-black/80 backdrop-blur-sm z-20">
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Scanner</p>
            <h3 className="text-white text-lg font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-0/10 hover:bg-surface-0/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Document frame guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative w-[85vw] max-w-[400px] aspect-[1.586/1]">
              {/* Corner brackets */}
              <div className="absolute -top-0.5 -left-0.5 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-lg" />
              <div className="absolute -top-0.5 -right-0.5 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-lg" />
              <div className="absolute -bottom-0.5 -left-0.5 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-lg" />
              <div className="absolute -bottom-0.5 -right-0.5 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-lg" />

              {/* Semi-transparent overlay outside frame */}
              <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] rounded-lg" />

              {/* Scanning line */}
              {scanning && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.6)]"
                />
              )}
            </div>
          </div>

          {/* Hint text */}
          <div className="absolute bottom-28 inset-x-0 text-center z-10">
            <p className="text-white/80 text-xs font-semibold drop-shadow-lg">
              {error
                ? error
                : scanning
                ? "Analyse en cours..."
                : "Cadrez le document dans le cadre"}
            </p>
          </div>

          {/* Error fallback: file picker */}
          {error && !scanning && (
            <div className="absolute bottom-44 inset-x-0 flex justify-center z-10">
              <label className="flex items-center gap-2 bg-surface-0/15 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-semibold cursor-pointer hover:bg-surface-0/25 transition-colors border border-white/20">
                <Camera size={18} />
                Choisir depuis la galerie
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-center gap-6 py-8 bg-black/80 backdrop-blur-sm z-20">
          {/* Gallery fallback */}
          <label className="w-12 h-12 rounded-full bg-surface-0/10 hover:bg-surface-0/20 flex items-center justify-center text-white cursor-pointer transition-colors border border-white/20">
            <Camera size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          {/* Capture button */}
          <button
            onClick={handleCapture}
            disabled={scanning || !cameraReady}
            className={cn(
              "w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center transition-all",
              scanning ? "bg-surface-0/20" : "bg-surface-0 hover:scale-105 active:scale-95"
            )}
          >
            {scanning ? (
              <Loader2 size={28} className="text-white animate-spin" />
            ) : (
              <div className="w-[58px] h-[58px] rounded-full bg-surface-0" />
            )}
          </button>

          {/* Spacer for symmetry */}
          <div className="w-12 h-12" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
