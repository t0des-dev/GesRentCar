"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import { useStorefront } from "@/hooks/useStorefront";

export default function FaqPage() {
  const storefront = useStorefront();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#16213E]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg,rgba(15,20,38,0.85) 0%,rgba(15,20,38,0.6) 50%,rgba(15,20,38,0.35) 100%)" }} />
        </div>

        <div className="max-w-[1280px] mx-auto px-8 relative z-10 pt-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[620px]"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm font-semibold mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Retour à l&apos;accueil
            </Link>

            <div className="inline-flex items-center gap-[10px] text-gold text-[12px] font-semibold uppercase tracking-[0.16em] mb-[18px]">
              <span className="w-[22px] h-[1px] bg-gold" />
              Support Client
            </div>

            <h1 className="font-sora text-[clamp(28px,3.8vw,42px)] font-bold text-white leading-[1.18] mb-4">
              Questions <span className="text-gold">Fréquentes</span>
            </h1>

            <p className="text-[15.5px] text-white/80 max-w-[520px]">
              Tout ce que vous devez savoir sur la location de prestige chez Vectoria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <FAQSection
        content={{
          ...storefront.sections_content.faq,
          items: storefront.faq_config,
        }}
      />

      {/* Bottom CTA */}
      <section className="py-20 bg-[#EEF2F6]">
        <div className="max-w-[620px] mx-auto px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(194,161,91,0.14)] flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={28} className="text-gold" />
          </div>
          <h2 className="font-sora text-[22px] font-bold text-navy mb-3">Vous n&apos;avez pas trouvé votre réponse ?</h2>
          <p className="text-[#5b6472] text-[15px] mb-8">Notre équipe est disponible 24/7 pour répondre à toutes vos questions.</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy text-white rounded-full font-sora font-semibold text-[14px] uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(22,33,62,0.5)]"
          >
            Nous contacter
            <span className="ml-1">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
