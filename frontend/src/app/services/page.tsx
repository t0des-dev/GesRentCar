"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Plane, Crown, Shield, Clock, MapPin, Phone, Headphones, Car, Sparkles, Briefcase, Baby, Camera } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ServicesPage() {
  const { t } = useTranslation();

  const mainServices = [
    { icon: Plane, title: "Livraison Aéroport", desc: "Accueil personnalisé à l'aéroport Mohammed V. Votre véhicule vous attend, clés en main.", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Crown, title: "Service VIP", desc: "Conciergerie dédiée, véhicule haut de gamme, conducteur privé sur demande.", color: "text-gold", bg: "bg-amber-50" },
    { icon: Clock, title: "Location Longue Durée", desc: "Tarifs dégressifs pour les séjours de 7 jours et plus. Flexibilité totale.", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Shield, title: "Assurance Premium", desc: "Couverture complète zéro franchise. Conduisez l'esprit tranquille.", color: "text-violet-600", bg: "bg-violet-50" },
  ];

  const extraServices = [
    { icon: Baby, title: "Siège bébé", desc: "Ensemble complet homologué disponible", price: "50 MAD/jour" },
    { icon: Briefcase, title: "GPS intégré", desc: "Système de navigation dernière génération", price: "Inclus" },
    { icon: Camera, title: "Dashcam", desc: "Enregistreur vidéo embarqué pour votre sécurité", price: "30 MAD/jour" },
    { icon: Headphones, title: "Assistance 24/7", desc: "Support téléphonique multilingue à tout moment", price: "Inclus" },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative pt-32 pb-20 bg-[#16213E] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-4">Nos Services</p>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Un service <span className="text-gold">d&apos;exception</span> à chaque étape
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              De la réservation au retour du véhicule, Vectoria vous accompagne avec un service premium pensé pour les voyageurs exigeants.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((svc, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${svc.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <svc.icon size={24} className={svc.color} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{svc.title}</h3>
                <p className="text-slate-500 leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-3">Options</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Services supplémentaires</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {extraServices.map((svc, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svc.icon size={20} className="text-primary" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{svc.title}</h4>
                <p className="text-sm text-slate-500 mb-3">{svc.desc}</p>
                <span className="text-xs font-black text-gold">{svc.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Prêt à réserver ?</h2>
            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">Découvrez notre flotte et choisissez le véhicule parfait pour votre prochain voyage.</p>
            <Link href="/fleet" className="inline-flex items-center gap-2 bg-[#16213E] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
              <Car size={18} /> Voir la flotte
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
