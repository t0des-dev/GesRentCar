"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { motion } from "framer-motion";

interface HowItWorksStep { num?: string; title?: string; desc?: string; }
interface HowItWorksProps { 
  content?: { 
    steps?: HowItWorksStep[]; 
    title?: string; 
    badge?: string; 
  }; 
}

export default function HowItWorks({ content = {} }: HowItWorksProps) {
  const { t } = useTranslation();

  const isCustomSteps = content?.steps?.length && content.steps.some(
    s => s.title && !["Choisissez", "Réservez", "Profitez", "Choose", "Book", "Drive", "Enjoy"].includes(s.title)
  );

  const steps = isCustomSteps && content?.steps
    ? content.steps.map((s, i) => ({
        num: s.num || String(i + 1).padStart(2, "0"),
        title: s.title || t(`step_${i + 1}_title`),
        desc: s.desc || t(`step_${i + 1}_desc`),
      }))
    : [
        { num: "01", title: t("step_1_title"), desc: t("step_1_desc") },
        { num: "02", title: t("step_2_title"), desc: t("step_2_desc") },
        { num: "03", title: t("step_3_title"), desc: t("step_3_desc") },
      ];

  const badge = content?.badge && content.badge !== "Simple & Rapide" ? content.badge : t("how_it_works_badge");
  const title = content?.title && content.title !== "Comment ça marche ?" ? content.title : t("how_it_works");

  return (
    <section className="py-24 bg-surface-2" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* AR7 vertical gold mark — centered */}
          <div className="section-mark center" />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow justify-center"
          >
            {badge}
          </motion.p>
          <h2 id="how-it-works-heading" className="text-3xl md:text-[40px] font-bold tracking-tight text-ink-1 mt-2">
            {title}
          </h2>
        </div>

        <div className="relative flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
          {/* Gold connector line (desktop) */}
          <div className="hidden md:block absolute top-[27px] left-[10%] right-[10%] h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(194,161,91,0.4) 12%,rgba(194,161,91,0.4) 88%,transparent)" }}
          />

          {steps.map(({ num, title, desc }, idx) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center flex-1"
            >
              {/* Step number circle — AR7 style */}
              <div className="step-num-ar7 shrink-0">
                {num}
              </div>
              <div className="md:mt-0">
                <h3 className="font-bold text-[15.5px] text-ink-1 mb-2">{title}</h3>
                <p className="text-[13px] text-ink-3 leading-[1.6] max-w-xs">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
