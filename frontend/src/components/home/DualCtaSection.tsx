"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Award } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface DualCtaProps {
  promotion?: {
    badge?: string;
    title_line1?: string;
    title_line2?: string;
    description?: string;
    cta_text?: string;
    cta_link?: string;
    side_note?: string;
    footer_items?: string[];
  };
  cta?: {
    eyebrow?: string;
    button_text?: string;
    button_link?: string;
  };
}

export default function DualCtaSection({ promotion = {}, cta = {} }: DualCtaProps) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-ink-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-1 via-ink-1 to-ink-1" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Promotion Banner — Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[40px] bg-white/5 backdrop-blur-sm border border-white/10 p-10 flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">
                {promotion.badge || "Programme Privilège"}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-[1.05] mb-4">
              {promotion.title_line1 || "L'exclusivité au"}
              <br /><span className="text-primary italic">{promotion.title_line2 || "bout des doigts."}</span>
            </h2>

            <p className="text-sm text-ink-3 leading-relaxed max-w-sm mb-8">
              {promotion.description || "Accédez à des tarifs préférentiels, un service de livraison sur-mesure et des avantages réservés à notre cercle d'initiés."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link
                href={promotion.cta_link || "/register"}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-primary hover:bg-primary/90 text-white text-[10px] font-semibold uppercase tracking-widest rounded-full transition-all"
              >
                {promotion.cta_text || "Rejoindre le cercle"}
                <ArrowRight size={14} />
              </Link>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-2">
                {promotion.side_note || "Inscription gratuite"}
              </span>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10 w-full">
              {(promotion.footer_items || ["Paiement sécurisé", "Conciergerie 24/7"]).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {idx === 0 ? <Shield size={14} className="text-ink-4" /> : <Award size={14} className="text-ink-4" />}
                  <span className="text-[10px] text-ink-2">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Banner — Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[40px] bg-white/5 backdrop-blur-sm border border-white/10 p-10 flex flex-col items-center justify-center text-center"
          >
            <p className="text-primary font-semibold text-[10px] uppercase tracking-[0.3em] mb-4">
              {cta.eyebrow || "Prêt à prendre le volant ?"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              {t("cta_title")}
            </h2>
            <p className="text-sm text-ink-3 max-w-sm mx-auto mb-8 leading-relaxed">
              {t("cta_desc")}
            </p>
            <Link
              href={cta.button_link || "/fleet"}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary hover:bg-primary/90 text-white text-[10px] font-semibold uppercase tracking-widest rounded-full transition-all"
            >
              {cta.button_text || t("btn_catalog")}
              <ArrowRight size={16} />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
