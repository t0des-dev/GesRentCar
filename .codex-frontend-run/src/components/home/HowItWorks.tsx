"use client";

import { useTranslation } from "@/hooks/useTranslation";

interface HowItWorksStep { num?: string; title?: string; desc?: string; }
interface HowItWorksProps { config?: { steps?: HowItWorksStep[]; title?: string; badge?: string; }; }

export default function HowItWorks({ config }: HowItWorksProps) {
  const { t } = useTranslation();

  const steps = config?.steps?.length
    ? config.steps.map((s, i) => ({
        num: s.num || String(i + 1).padStart(2, "0"),
        title: s.title || t(`step_${i + 1}_title`),
        desc: s.desc || t(`step_${i + 1}_desc`),
      }))
    : [
        { num: "01", title: t("step_1_title"), desc: t("step_1_desc") },
        { num: "02", title: t("step_2_title"), desc: t("step_2_desc") },
        { num: "03", title: t("step_3_title"), desc: t("step_3_desc") },
      ];

  return (
    <section className="py-24 bg-white" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-xs uppercase tracking-[0.3em] mb-4">
            {config?.badge || "Simple & Rapide"}
          </p>
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold tracking-tight">
            {config?.title || t("how_it_works")}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="flex md:flex-col items-start md:items-center gap-4 md:gap-6 md:text-center flex-1">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {num}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
