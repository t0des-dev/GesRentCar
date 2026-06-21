"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const errorMsg = error?.message || "";
    if (
      errorMsg.includes("ChunkLoadError") ||
      errorMsg.includes("Failed to load chunk") ||
      errorMsg.includes("Loading chunk") ||
      errorMsg.includes("310")
    ) {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center max-w-md mx-auto px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-destructive mb-4">
          Erreur
        </p>
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-10">
          Veuillez réessayer ou contacter le support si le problème persiste.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
