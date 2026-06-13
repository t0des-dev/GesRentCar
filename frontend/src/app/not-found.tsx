"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center max-w-md mx-auto px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary mb-4">
          Erreur 404
        </p>
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Page introuvable
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-10">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft size={14} />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
