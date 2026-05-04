"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Simple & Rapide</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">{t("how_it_works")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 max-w-5xl mx-auto">
          {[
            { num: "01", title: t("step_1_title"), desc: t("step_1_desc") },
            { num: "02", title: t("step_2_title"), desc: t("step_2_desc") },
            { num: "03", title: t("step_3_title"), desc: t("step_3_desc") },
          ].map(({ num, title, desc }) => (
            <div key={num} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center text-3xl font-black text-primary mb-8 group-hover:border-primary transition-all">
                {num}
              </div>
              <h3 className="text-2xl font-bold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
