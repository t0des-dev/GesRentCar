"use client";

import { motion } from "framer-motion";
import { useStorefront } from "@/hooks/useStorefront";
import { useTranslation } from "@/shared/hooks/useTranslation";
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
  const { t } = useTranslation();
  const storefront = useStorefront();
  const servicesContent = storefront.sections_content?.services || {};

  const eyebrow = servicesContent.eyebrow || t("services_eyebrow");
  const title = servicesContent.title || t("services_hero_title");
  const subtitle = servicesContent.subtitle || t("services_hero_subtitle");

  const dynamicItems = servicesContent.items || [
    { id: "srv-1", title: t("feat_support_title"), description: t("feat_support_desc"), icon: "Plane", badge: "24/7", color: "blue" },
    { id: "srv-2", title: t("feat_chauffeur_title"), description: t("feat_chauffeur_desc"), icon: "Crown", badge: "VIP", color: "amber" },
    { id: "srv-3", title: t("feat_fleet_title"), description: t("feat_fleet_desc"), icon: "Clock", badge: "Flex", color: "emerald" },
    { id: "srv-4", title: t("quickview_spec_insurance"), description: t("faq_a3"), icon: "Shield", badge: "VIP", color: "violet" },
  ];

  const extraServices = [
    { icon: Baby, title: t("services_extra_baby_seat"), desc: t("services_extra_baby_seat_desc"), price: "50 MAD / " + t("quickview_day") },
    { icon: Briefcase, title: t("services_extra_gps"), desc: t("services_extra_gps_desc"), price: t("services_extra_included") },
    { icon: Camera, title: t("services_extra_dashcam"), desc: t("services_extra_dashcam_desc"), price: "30 MAD / " + t("quickview_day") },
    { icon: Headphones, title: t("services_extra_support"), desc: t("services_extra_support_desc"), price: t("services_extra_included") },
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
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{t("services_extras_title")}</h2>
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
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">{t("cta_title")}</h2>
            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">{t("cta_desc")}</p>
            <Link href="/fleet" className="inline-flex items-center gap-2 bg-[#16213E] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
              <Car size={18} /> {t("btn_catalog")}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}


