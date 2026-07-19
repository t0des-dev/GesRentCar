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

  const steps = content?.steps?.length
    ? content.steps.map((s, i) => ({
        num: s.num || String(i + 1).padStart(2, "0"),
        title: s.title || t(`step_${i + 1}_title`),
        desc: s.desc || t(`step_${i + 1}_desc`),
      }))
    : [
        { num: "01", title: "Choisissez", desc: "Parcourez notre collection et sélectionnez le véhicule parfait" },
        { num: "02", title: "Réservez", desc: "Complétez votre réservation en quelques clics" },
        { num: "03", title: "Récupérez", desc: "À l'aéroport ou dans l'une de nos agences" },
        { num: "04", title: "Profitez", desc: "Kilométrage illimité, assistance 24/7" },
        { num: "05", title: "Rendez", desc: "Déposez et partez — on s'occupe du reste" },
      ];

  return (
    <section className="py-24 lg:py-32 bg-[var(--light-gray)]" aria-labelledby="how-it-works-heading">
      <div className="max-w-[var(--container)] mx-auto px-8">
        {/* Section Head — centered */}
        <div className="section-head section-head-center">
          <div className="section-mark section-mark-center" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow-theme"
            style={{ justifyContent: "center" }}
          >
            {content?.badge || "Simple & Rapide"}
          </motion.div>
          <motion.h2
            id="how-it-works-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-[clamp(30px,3.6vw,44px)] font-bold tracking-tight text-[var(--navy)]"
          >
            {content?.title || t("how_it_works")}
          </motion.h2>
        </div>

        {/* Process Track — 5 columns with connecting gold line */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[27px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(194,161,91,0.4)] to-transparent" />

          {steps.map(({ num, title, desc }, idx) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="text-center relative"
            >
              <div className="w-[54px] h-[54px] rounded-full bg-white border border-[var(--gold)]/[0.14] flex items-center justify-center mx-auto mb-5 relative z-10 font-[var(--font-sora)] font-bold text-[var(--gold)] text-[16px]">
                {num}
              </div>
              <h3 className="text-[15.5px] font-bold text-[var(--navy)] mb-2">{title}</h3>
              <p className="text-[13px] text-[#6b7280] leading-[1.6] max-w-[200px] mx-auto">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
