"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Check, X, Car, Fuel, Users, Shield, Clock, MapPin } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function PricingPage() {
  const { t } = useTranslation();

  const categories = [
    {
      name: "Économique",
      nameEn: "Economy",
      price: 250,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?auto=format&fit=crop&q=80&w=600",
      features: ["Climatisation", "Bluetooth", "4 places", "GPS intégré"],
      excluded: ["Assurance premium", "Siège bébé"],
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Standard",
      nameEn: "Standard",
      price: 400,
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600",
      features: ["Climatisation", "Bluetooth", "5 places", "GPS intégré", "Caméra recul"],
      excluded: ["Assurance premium"],
      color: "from-blue-500 to-blue-600",
      popular: true,
    },
    {
      name: "SUV",
      nameEn: "SUV",
      price: 600,
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=600",
      features: ["Climatisation", "Bluetooth", "7 places", "GPS intégré", "Caméra 360°", "Toit panoramique"],
      excluded: [],
      color: "from-violet-500 to-violet-600",
    },
    {
      name: "Luxe",
      nameEn: "Luxury",
      price: 1000,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600",
      features: ["Climatisation bi-zone", "Cuir intégral", "5 places", "GPS premium", "Caméra 360°", "Toit panoramique", "Son harman/kardon"],
      excluded: [],
      color: "from-amber-500 to-amber-600",
    },
  ];

  const extras = [
    { name: "Conducteur privé", price: "500 MAD/jour" },
    { name: "Siège bébé", price: "50 MAD/jour" },
    { name: "GPS avancé", price: "30 MAD/jour" },
    { name: "Assurance tous risques", price: "100 MAD/jour" },
    { name: "Lavage extérieur", price: "50 MAD" },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative pt-32 pb-20 bg-[#16213E] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-4">Tarification</p>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Des tarifs <span className="text-gold">transparents</span> et compétitifs
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Pas de frais cachés. Prix affichés TTC avec kilométrage illimité. Le meilleur rapport qualité-prix de Casablanca.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`relative bg-white rounded-3xl border overflow-hidden hover:shadow-xl transition-all ${
                  cat.popular ? "border-primary ring-2 ring-primary/20 scale-[1.02]" : "border-slate-100"
                }`}
              >
                {cat.popular && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-1">{cat.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-[#16213E]">{cat.price}</span>
                    <span className="text-sm text-slate-400 font-medium">MAD/jour</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {cat.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                    {cat.excluded.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                        <X size={14} className="text-slate-300 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/fleet?category=${cat.name.toLowerCase()}`}
                    className={`block text-center py-3 rounded-2xl font-bold text-sm transition-all ${
                      cat.popular
                        ? "bg-[#16213E] text-white hover:scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Voir les véhicules
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-3">Extras</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Options supplémentaires</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {extras.map((extra, i) => (
              <div key={i} className={`flex items-center justify-between px-6 py-4 ${i < extras.length - 1 ? "border-b border-slate-50" : ""}`}>
                <span className="font-semibold text-slate-700">{extra.name}</span>
                <span className="text-sm font-bold text-gold">{extra.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#16213E]">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">Tarifs de groupe et longue durée</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">Réductions exclusives pour les locations de 7+ jours et les flottes d&apos;entreprise.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold text-[#16213E] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
              Demander un devis
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
