"use client";

import { motion } from "framer-motion";
import { ArrowRight, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PromotionBanner() {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-50%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[60px] p-12 md:p-24 relative overflow-hidden group">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crown size={200} className="text-white" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 justify-center lg:justify-start mb-8"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Programme Privilège</span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
              >
                ACCÉDEZ À <br />
                <span className="text-gradient-gold">L'INACCESSIBLE</span>.
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed"
              >
                Devenez membre Vectoria et bénéficiez de tarifs préférentiels, d'un accès prioritaire à nos nouveautés et d'un service de livraison sur-mesure.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 justify-center lg:justify-start"
              >
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group/btn"
                >
                  REJOINDRE LE CERCLE
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  INSCRIPTION GRATUITE • OFFRE LIMITÉE
                </span>
              </motion.div>
            </div>

            {/* Visual Teaser */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10 w-full max-w-sm aspect-square rounded-[40px] overflow-hidden border border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000&auto=format&fit=crop" 
                  alt="Membership"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
