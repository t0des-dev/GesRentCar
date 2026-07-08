"use client";

import { motion } from "framer-motion";
import { HelpCircle, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import { useStorefront } from "@/hooks/useStorefront";

export default function FaqPage() {
  const storefront = useStorefront();

  return (
    <main className="min-h-screen bg-surface-0">
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-950 to-gold/10" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm font-semibold mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Retour à l&apos;accueil
            </Link>

            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full mb-8">
              <HelpCircle size={16} className="text-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">Support Client</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 leading-[0.9]">
              Questions <span className="text-gold">Fréquentes</span>
            </h1>

            <p className="text-xl text-slate-300 font-medium max-w-xl leading-relaxed">
              Tout ce que vous devez savoir sur la location de prestige chez Vectoria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <FAQSection
        content={storefront.sections_content.faq}
      />

      {/* Bottom CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
              <MessageCircle size={28} className="text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Vous n&apos;avez pas trouvé votre réponse ?</h2>
            <p className="text-slate-500">Notre équipe est disponible 24/7 pour répondre à toutes vos questions.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white rounded-xl text-sm font-bold hover:bg-gold/90 transition-all hover:shadow-lg hover:shadow-gold/30 uppercase tracking-wider"
            >
              Nous contacter
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
