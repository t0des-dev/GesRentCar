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
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.button
          onClick={openConcierge}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full bg-slate-900 rounded-[48px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden text-left"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700" />

          <div className="flex items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Bot size={48} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Assistance Personnalisée</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                {config.title || <>Besoin d'aide pour <span className="text-primary">choisir</span> ?</>}
              </h3>
              <p className="text-slate-400 font-medium text-lg max-w-xl">
                {config.text || "Laissez notre Concierge IA vous guider vers le véhicule parfait selon votre occasion et votre style."}
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="bg-primary text-white p-6 rounded-full group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-500">
              <ArrowRight size={32} />
            </div>
          </div>
        </motion.button>
      </div>
    </section>
  );
}
