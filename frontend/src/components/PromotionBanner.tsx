"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Award } from "lucide-react";
import Link from "next/link";

interface PromotionBannerProps {
  content?: {
    badge?: string;
    title_line1?: string;
    title_line2?: string;
    description?: string;
    cta_text?: string;
    cta_link?: string;
    side_note?: string;
    footer_items?: string[];
  };
}

export default function PromotionBanner({ content = {} }: PromotionBannerProps) {
  const badge = content?.badge || "Programme Privilège";
  const title_line1 = content?.title_line1 || "L'exclusivité au";
  const title_line2 = content?.title_line2 || "bout des doigts.";
  const description = content?.description || "Accédez à des tarifs préférentiels, un service de livraison sur-mesure et des avantages réservés à notre cercle d'initiés.";
  const cta_text = content?.cta_text || "Rejoindre le cercle";
  const cta_link = content?.cta_link || "/register";
  const side_note = content?.side_note || "Inscription gratuite";
  const footer_items = content?.footer_items || ["Paiement sécurisé", "Conciergerie 24/7"];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {badge}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-6"
          >
            {title_line1}
            <br /><span className="text-primary italic">{title_line2}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto mb-10"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link
              href={cta_link}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary hover:bg-primary/90 text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-all"
            >
              {cta_text}
              <ArrowRight size={16} />
            </Link>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {side_note}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-12 pt-12 border-t border-slate-800/50"
          >
            {footer_items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {idx === 0 ? <Shield size={18} className="text-slate-600" /> : <Award size={18} className="text-slate-600" />}
                <span className="text-xs text-slate-500">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
