"use client";

import { useEffect } from "react";
import Link from "next/link";
import { reportError } from "@/shared/utils/errorReporting";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, "GlobalError");

    const errorMsg = error?.message || "";
    if (
      errorMsg.includes("ChunkLoadError") ||
      errorMsg.includes("Failed to load chunk") ||
      errorMsg.includes("Loading chunk")
    ) {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  }, [error]);
  return (
    <html>
      <body className="bg-background">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-destructive mb-4">
              Erreur Système
            </p>
            <h1 className="text-5xl font-bold text-ink-1 tracking-tight mb-4">
              Une erreur critique est survenue
            </h1>
            <p className="text-ink-4 text-sm leading-relaxed mb-10">
              Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={reset}
                className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all"
              >
                Rafraîchir
              </button>
              <Link
                href="/"
                className="text-xs font-semibold uppercase tracking-widest text-ink-4 hover:text-ink-1 transition-colors"
              >
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
