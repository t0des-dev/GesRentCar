"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Clock, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LIFESTYLES = [
  { id: "business", label: "Business Elite", desc: "La ponctualité et le prestige pour vos enjeux stratégiques.", icon: Shield },
  { id: "romance", label: "Grand Tourisme", desc: "L'élégance à ciel ouvert pour vos moments d'exception.", icon: Star },
  { id: "adventure", label: "Wild Adventure", desc: "La puissance sans limite pour explorer de nouveaux horizons.", icon: Compass },
];

export default function ExperienceSection() {
  return (
    <section className="py-40 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          {/* Left Side: Visual & Content */}
          <div className="lg:w-1/2 space-y-12">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full text-white"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">L'Expérience Premium</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase"
              >
                Bien plus qu'un <br />
                <span className="text-primary italic">simple trajet.</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl"
              >
                Nous redéfinissons la mobilité de luxe en intégrant chaque voyage dans un style de vie d'exception. De la précision mécanique au confort absolu, chaque détail est une invitation à l'évasion.
              </motion.p>
            </div>

            {/* Micro-Stats */}
            <div className="flex gap-16 pt-6">
              {[
                { value: "98%", label: "Recommandation", sub: "Satisfaction Client" },
                { value: "24h", label: "Service VIP", sub: "Support Dédié" },
              ].map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <p className="text-5xl font-black text-slate-900 mb-1">{s.value}</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">{s.label}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Lifestyle Selection Cards */}
          <div className="lg:w-1/2 space-y-6">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4 ml-4"
            >
              Explorez par Style de Vie
            </motion.p>
            
            <div className="grid gap-6">
              {LIFESTYLES.map((ls, i) => (
                <motion.div
                  key={ls.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link 
                    href={`/fleet?lifestyle=${ls.id}`}
                    className="group block relative bg-white p-8 rounded-[40px] border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center gap-8 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                        <ls.icon size={28} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">{ls.label}</h4>
                        <p className="text-sm text-slate-500 font-medium line-clamp-1">{ls.desc}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary transition-all group-hover:translate-x-2">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="pt-8"
            >
              <Link 
                href="/fleet"
                className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors group"
              >
                Découvrir l'intégralité de la collection
                <div className="w-10 h-px bg-slate-200 group-hover:w-20 group-hover:bg-primary transition-all" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
