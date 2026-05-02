"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-white border border-slate-200 px-6 py-2 rounded-full shadow-sm mb-6"
          >
            <HelpCircle size={18} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Support Client</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6"
          >
            {t("faq_title")}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-medium"
          >
            {t("faq_subtitle")}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group rounded-[32px] border transition-all duration-500 overflow-hidden",
                openIndex === index 
                  ? "bg-white border-primary/20 shadow-2xl shadow-primary/5" 
                  : "bg-white/50 border-slate-200 hover:border-primary/20 hover:bg-white"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-8 flex items-center justify-between text-left"
              >
                <span className={cn(
                  "text-lg md:text-xl font-black tracking-tight transition-colors duration-300",
                  openIndex === index ? "text-primary" : "text-slate-900"
                )}>
                  {faq.q}
                </span>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  openIndex === index ? "bg-primary text-white rotate-180" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 pb-8">
                      <div className="w-full h-px bg-slate-100 mb-6" />
                      <p className="text-slate-500 text-lg leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-slate-400 font-bold mb-6">Vous avez encore des questions ?</p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1"
          >
            Contacter le support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
