"use client";

import { motion } from "framer-motion";
import { useStorefront } from "@/hooks/useStorefront";
import { 
  Plane, Crown, Shield, Clock, MapPin, Phone, Headphones, Car, 
  Briefcase, Baby, Camera, Globe, Users, Award, Star, Zap 
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const ICON_MAP: Record<string, any> = {
  Plane, Crown, Shield, Clock, MapPin, Phone, Headphones, Car, Briefcase, Baby, Camera, Globe, Users, Award, Star, Zap
};

function getIconComponent(iconName?: string, defaultIcon = Shield) {
  if (!iconName) return defaultIcon;
  return ICON_MAP[iconName] || defaultIcon;
}

export default function ServicesPage() {
  const storefront = useStorefront();
  const servicesContent = storefront.sections_content?.services || {};

  const eyebrow = servicesContent.eyebrow || "Nos Services";
  const title = servicesContent.title || "Un service d'exception à chaque étape";
  const subtitle = servicesContent.subtitle || "De la réservation au retour du véhicule, Vectoria vous accompagne avec un service premium pensé pour les voyageurs exigeants.";

  const dynamicItems = servicesContent.items || [
    { id: "srv-1", title: "Livraison Aéroport 24/7", description: "Accueil personnalisé dès votre descente d'avion avec gestion VIP des bagages.", icon: "Plane", badge: "24/7", color: "blue" },
    { id: "srv-2", title: "Service Conciergerie VIP", description: "Conciergerie dédiée, véhicule haut de gamme, conducteur privé sur demande.", icon: "Crown", badge: "VIP", color: "amber" },
    { id: "srv-3", title: "Location Longue Durée", description: "Tarifs dégressifs pour les séjours de 7 jours et plus. Flexibilité totale.", icon: "Clock", badge: "Flex", color: "emerald" },
    { id: "srv-4", title: "Assurance Premium", description: "Couverture complète zéro franchise. Conduisez l'esprit tranquille.", icon: "Shield", badge: "Tranquillité", color: "violet" },
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
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-4">{eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              {title}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dynamicItems.map((svc: any, i: number) => {
              const IconComp = getIconComponent(svc.icon, Shield);
              return (
                <motion.div
                  key={svc.id || i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  {svc.badge && (
                    <span className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-wider bg-gold/10 text-gold px-3 py-1 rounded-full">
                      {svc.badge}
                    </span>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{svc.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{svc.description || svc.desc}</p>
                </motion.div>
              );
            })}
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

