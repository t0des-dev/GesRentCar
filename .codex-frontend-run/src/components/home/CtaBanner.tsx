"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/50" aria-labelledby="cta-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <p className="text-primary font-semibold text-xs uppercase tracking-[0.3em] mb-4">
          Prêt à prendre le volant&nbsp;?
        </p>
        <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          {t("cta_title")}
        </h2>
        <p className="text-base text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
          {t("cta_desc")}
        </p>
        <Link
          href="/fleet"
          className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary hover:bg-primary/90 text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-all"
        >
          {t("btn_catalog")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
