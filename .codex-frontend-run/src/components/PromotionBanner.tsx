"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Award } from "lucide-react";
import Link from "next/link";

export default function PromotionBanner() {
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
              Programme Privilège
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-6"
          >
            L&rsquo;exclusivité au
            <br /><span className="text-primary italic">bout des doigts.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto mb-10"
          >
            Accédez à des tarifs préférentiels, un service de livraison sur-mesure et des avantages réservés à notre cercle d&apos;initiés.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary hover:bg-primary/90 text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-all"
            >
              Rejoindre le cercle
              <ArrowRight size={16} />
            </Link>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Inscription gratuite
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-12 pt-12 border-t border-slate-800/50"
          >
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-slate-600" />
              <span className="text-xs text-slate-500">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-3">
              <Award size={18} className="text-slate-600" />
              <span className="text-xs text-slate-500">Conciergerie 24/7</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
