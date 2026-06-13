"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Compass, Zap } from "lucide-react";
import Link from "next/link";

const LIFESTYLES = [
  { id: "business", label: "Business Elite", desc: "Ponctualité et prestige pour vos déplacements professionnels.", icon: Shield, color: "from-blue-400/20 to-blue-600/20" },
  { id: "romance", label: "Grand Tourisme", desc: "L'élégance à ciel ouvert pour vos moments d'exception.", icon: Star, color: "from-pink-400/20 to-rose-600/20" },
  { id: "adventure", label: "Wild Adventure", desc: "Puissance et liberté pour explorer de nouveaux horizons.", icon: Compass, color: "from-orange-400/20 to-red-600/20" },
];

export default function ExperienceSection() {
  return (
    <section className="py-28 bg-surface-0 relative overflow-hidden">
      {/* Subtle gradient BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          {/* Left Content */}
          <div className="space-y-10">
            
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="section-eyebrow"
            >
              L'Expérience Premium
            </motion.div>

            {/* Title — Instrument Serif */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="display-lg leading-[1.1] text-ink-1"
            >
              Bien plus qu'un
              <br />
              <span className="bg-gradient-to-r from-gold via-gold/80 to-gold/60 bg-clip-text text-transparent">
                simple trajet.
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="body-feature text-ink-2 leading-relaxed max-w-xl"
            >
              Nous redéfinissons la mobilité de luxe en intégrant chaque voyage dans un style de vie d'exception. Du confort absolu à la performance, chaque détail est pensé pour vous.
            </motion.p>

            {/* Stats Display */}
            <div className="flex gap-12 pt-6">
              {[
                { value: "98%", label: "Recommandation" },
                { value: "24/7", label: "Support VIP" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="stat-display"
                >
                  <div className="number text-gold">{s.value}</div>
                  <p className="label">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Lifestyle Cards */}
          <div className="space-y-5">
            
            {/* Label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-eyebrow"
            >
              Explorer par style
            </motion.p>

            {/* Cards Grid */}
            <div className="space-y-4">
              {LIFESTYLES.map((ls, i) => (
                <motion.div
                  key={ls.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={`/fleet?lifestyle=${ls.id}`}
                    className="group flex items-center gap-5 p-6 bg-white rounded-xl border border-border hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 card-premium"
                  >
                    {/* Icon Container */}
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${ls.color} flex items-center justify-center text-gold group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold/20 transition-all duration-500 shrink-0`}>
                      <ls.icon size={24} className="group-hover:rotate-12 transition-transform" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h4 className="font-bold text-ink-1 text-lg group-hover:text-gold transition-colors duration-300 mb-1">
                        {ls.label}
                      </h4>
                      <p className="text-sm text-ink-3 group-hover:text-ink-2 transition-colors">
                        {ls.desc}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight 
                      size={20} 
                      className="text-gold/60 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 shrink-0" 
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View All Link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-6"
            >
              <Link 
                href="/fleet" 
                className="nav-link-gold text-sm font-bold uppercase tracking-wider"
              >
                Voir toute la collection
                <span className="ml-2">→</span>
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
