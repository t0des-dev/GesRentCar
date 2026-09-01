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
    <section className="py-24 bg-ink-1 relative overflow-hidden text-center" aria-labelledby="cta-heading">
      {/* AR7 radial gold glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(194,161,91,0.14) 0%, transparent 70%)" }}
      />
      {/* AR7 signature mark — centered at top */}
      <div className="absolute top-0 left-1/2 w-px h-[120px]"
        style={{ background: "linear-gradient(hsl(var(--gold-dark)), transparent)", transform: "translateX(-50%)" }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-[620px]">
        <p className="section-eyebrow justify-center" style={{ color: "hsl(var(--gold-dark))" }}>
          {content?.eyebrow || t("cta_eyebrow")}
        </p>
        <h2 id="cta-heading" className="text-[clamp(32px,4.4vw,50px)] font-bold text-white tracking-tight leading-[1.15] mb-5 mt-3">
          {t("cta_title")}
        </h2>
        <p className="text-[17.5px] text-white/68 max-w-md mx-auto mb-11 leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>
          {t("cta_desc")}
        </p>
        <div className="flex gap-[18px] justify-center flex-wrap">
          <Button asChild variant="default" size="lg"
            className="rounded-full px-[38px] py-[19px] h-auto text-[15.5px] font-semibold"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            <Link href={content?.button_link || "/fleet"}>
              {content?.button_text || t("btn_catalog")}
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-[38px] py-[19px] text-[15.5px] font-semibold border border-white/35 text-white hover:bg-white/8 transition-all duration-300"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            {t("cta_contact_us")}
          </Link>
        </div>
      </div>
    </section>
  );

}
