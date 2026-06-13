"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import { cn } from "@/lib/utils";

export default function FAQSection() {
  const { t } = useTranslation();
  const agency = useAgency();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];

  const faqs = (agency.faq_config && (agency.faq_config as any[]).length > 0) 
    ? agency.faq_config as { q: string, a: string }[] 
    : defaultFaqs;

  return (
    <section className="py-32 bg-surface-0 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto space-y-6">
          
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-full mx-auto"
          >
            <HelpCircle size={16} className="text-gold" />
            <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Support Client</span>
          </motion.div>
          
          {/* Title — Instrument Serif */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="display-md text-ink-1"
          >
            {t("faq_title")}
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="body-feature text-ink-2 leading-relaxed"
          >
            {t("faq_subtitle")}
          </motion.p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className={cn(
                "rounded-xl border-2 transition-all duration-300 overflow-hidden",
                openIndex === index 
                  ? "bg-gradient-to-br from-white to-gold/5 border-gold/40 shadow-lg shadow-gold/15 card-premium" 
                  : "bg-white border-border hover:border-gold/30 hover:shadow-md hover:shadow-gold/10"
              )}
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-7 py-6 flex items-center justify-between text-left group"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={cn(
                  "text-base font-bold transition-colors duration-300 text-ink-1 flex-1",
                  openIndex === index ? "text-gold" : "group-hover:text-primary"
                )}>
                  {faq.q}
                </span>
                <motion.div 
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all shrink-0 ml-4 font-bold",
                    openIndex === index 
                      ? "bg-gold text-white shadow-lg shadow-gold/30" 
                      : "bg-surface-1 text-gold group-hover:bg-gold/10"
                  )}
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-6">
                      <div className="w-full h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent mb-5" />
                      <p className="text-sm text-ink-2 leading-relaxed font-normal">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-20 space-y-4"
        >
          <p className="text-sm text-ink-3">Vous avez encore des questions ?</p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 px-7 py-3 bg-gold text-ink-1 rounded-lg text-sm font-bold hover:bg-gold/90 transition-all hover:shadow-lg hover:shadow-gold/30 uppercase tracking-wider"
          >
            Contacter le support
            <span className="ml-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
