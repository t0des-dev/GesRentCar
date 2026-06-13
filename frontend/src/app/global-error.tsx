"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#f8fafc]">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-destructive mb-4">
              Erreur Système
            </p>
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Une erreur critique est survenue
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
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
                className="text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
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
