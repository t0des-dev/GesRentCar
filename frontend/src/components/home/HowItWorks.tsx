"use client";

import { useTranslation } from "@/hooks/useTranslation";
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
        { num: "03", title: "Profitez", desc: "Prenez le volant et vivez une expérience inoubliable" },
      ];

  return (
    <section className="py-24 bg-white" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-xs uppercase tracking-[0.3em] mb-4"
          >
            {content?.badge || "Simple & Rapide"}
          </motion.p>
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold tracking-tight">
            {content?.title || t("how_it_works")}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
          {steps.map(({ num, title, desc }, idx) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex md:flex-col items-start md:items-center gap-4 md:gap-6 md:text-center flex-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {num}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
