"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { useAgency } from "@/hooks/useAgency";

export default function ConciergeBanner() {
  const agency = useAgency();
  const openConcierge = () => {
    window.dispatchEvent(new CustomEvent("open-concierge"));
  };

  const config = agency.concierge_config as { title: string, text: string } || {};

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <motion.button
          onClick={openConcierge}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="w-full rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 group relative overflow-hidden text-left transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(13, 15, 23, 0.95) 0%, rgba(13, 15, 23, 0.85) 100%)",
            border: "2px solid rgba(216, 177, 65, 0.2)"
          }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-gold/20 rounded-full blur-3xl group-hover:bg-gold/30 transition-all duration-700" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

          {/* Icon Box */}
          <div className="flex items-center gap-8 relative z-10 flex-shrink-0">
            <motion.div 
              className="w-28 h-28 bg-gradient-to-br from-gold/30 to-gold/10 backdrop-blur-xl border border-gold/40 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-gold/20"
              whileHover={{ scale: 1.12, rotate: 8 }}
              transition={{ duration: 0.5 }}
            >
              <Bot size={56} className="text-gold" />
            </motion.div>
            
            <div className="space-y-3">
              {/* Badge */}
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-gold animate-shimmer" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Assistance Personnalisée</span>
              </div>
              
              {/* Title — Instrument Serif */}
              <h3 className="display-md text-white leading-tight">
                {config.title || <>Besoin d'aide pour <span className="text-gold">choisir</span> ?</>}
              </h3>
              
              {/* Description */}
              <p className="body-feature text-ink-2 max-w-xl">
                {config.text || "Laissez notre Concierge IA vous guider vers le véhicule parfait selon votre occasion et votre style."}
              </p>
            </div>
          </div>

          {/* CTA Arrow */}
          <motion.div 
            className="relative z-10 shrink-0"
            whileHover={{ scale: 1.15, x: 8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-gold to-gold/80 text-ink-1 p-6 rounded-full shadow-xl shadow-gold/40 font-bold group-hover:shadow-2xl group-hover:shadow-gold/60 transition-all">
              <ArrowRight size={32} strokeWidth={3} />
            </div>
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
