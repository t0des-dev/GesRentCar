"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { MapPin, Plane, Building2, Waves, Mountain, Navigation, Car, Phone } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ZonesPage() {
  const { t } = useTranslation();

  const zones = [
    {
      icon: Plane,
      name: "Aéroport Mohammed V",
      desc: "Livraison et retour directement en zone arrivée. Service de accueil personnalisé avec panneau Vectoria.",
      address: "Aéroport Mohammed V, Terminal 1",
      hours: "24h/24, 7j/7",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Building2,
      name: "Centre-ville Casablanca",
      desc: "Agence principale Corniche. Livraison gratuite dans un rayon de 5 km.",
      address: "Boulevard de la Corniche, Casablanca",
      hours: "Lun-Sam: 9h00 - 19h00",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Waves,
      name: "Corniche & Ain Diab",
      desc: "Zone touristique et balnéaire. Livraison à votre hôtel ou résidence.",
      address: "Zone Corniche, Ain Diab",
      hours: "Lun-Sam: 9h00 - 19h00",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Building2,
      name: "Casa Finance City",
      desc: "Zone d'affaires. Service express pour les professionnels. Livraison en 30 min.",
      address: "Casa Finance City, Tour 1",
      hours: "Lun-Ven: 8h00 - 20h00",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Mountain,
      name: "Casablanca>Anfa",
      desc: "Quartier résidentiel haut de gamme. Service VIP à domicile.",
      address: "Zone Anfa, Casablanca",
      hours: "Lun-Sam: 9h00 - 19h00",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Navigation,
      name: "Livraison nationale",
      desc: "Marrakech, Rabat, Tanger, Agadir. Supplément selon distance. Demandez un devis.",
      address: "Partout au Maroc",
      hours: "Sur réservation",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative pt-32 pb-20 bg-[#16213E] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-4">Nos Agences</p>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Où nous <span className="text-gold">trouver</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Plusieurs points de service à Casablanca et livraison dans tout le Maroc. Retrouvez-nous près de chez vous.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {zones.map((zone, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${zone.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <zone.icon size={24} className={zone.color} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{zone.name}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{zone.desc}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-600">{zone.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Car size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-600">{zone.hours}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-3">Carte</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Notre zone de couverture</h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden aspect-[16/9] md:aspect-[21/9]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.838!2d-7.589!3d33.573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjAiTiA3wrAzNScyMC40Ilc!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vectoria locations"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#16213E]">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">Besoin d&apos;un renseignement ?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">Notre équipe est disponible pour répondre à toutes vos questions sur nos zones de service.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+212600000000" className="inline-flex items-center justify-center gap-2 bg-white text-[#16213E] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
                <Phone size={18} /> +212 6 00 00 00 00
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-gold text-[#16213E] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
