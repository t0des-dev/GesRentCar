"use client";

import Link from "next/link";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface CtaBannerProps {
  content?: {
    eyebrow?: string;
    button_text?: string;
    button_link?: string;
  };
}

export default function CtaBanner({ content = {} }: CtaBannerProps) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/50" aria-labelledby="cta-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <p className="text-primary font-semibold text-xs uppercase tracking-[0.3em] mb-4">
          {content?.eyebrow || "Prêt à prendre le volant ?"}
        </p>
        <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          {t("cta_title")}
        </h2>
        <p className="text-base text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
          {t("cta_desc")}
        </p>
        <Button asChild variant="default" size="lg" className="rounded-full px-8 py-6 h-auto text-xs">
          <Link href={content?.button_link || "/fleet"}>
            {content?.button_text || t("btn_catalog")}
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
