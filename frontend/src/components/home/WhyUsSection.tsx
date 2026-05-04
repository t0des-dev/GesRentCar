"use client";

import { motion } from "framer-motion";
import { Crown, HeadphonesIcon, ShieldCheck, Star, Car, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface WhyUsSectionProps {
  agency: any;
  content: any;
  aboutText: string;
}

export default function WhyUsSection({ agency, content, aboutText }: WhyUsSectionProps) {
  const { t } = useTranslation();

  const defaultFeatures = [
    { icon: Crown, title: t("feat_fleet_title"), desc: t("feat_fleet_desc") },
    { icon: HeadphonesIcon, title: t("feat_support_title"), desc: t("feat_support_desc") },
    { icon: ShieldCheck, title: t("feat_chauffeur_title"), desc: t("feat_chauffeur_desc") },
  ];

  const features = (agency.features_config && (agency.features_config as any[]).length > 0)
    ? (agency.features_config as any[]).map(f => {
        let IconComp = Crown;
        if (f.icon === "HeadphonesIcon") IconComp = HeadphonesIcon;
        if (f.icon === "ShieldCheck") IconComp = ShieldCheck;
        if (f.icon === "Star") IconComp = Star;
        if (f.icon === "Car") IconComp = Car;
        if (f.icon === "LayoutDashboard") IconComp = LayoutDashboard;
        if (f.icon === "Settings") IconComp = Settings;
        if (f.icon === "Users") IconComp = Users;
        return { icon: IconComp, title: f.title, desc: f.desc };
      })
    : defaultFeatures;

  return (
    <section className="py-40 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100/50 -skew-x-12 translate-x-1/4 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-end mb-32">
          <div className="lg:w-1/2">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-black text-xs uppercase tracking-[0.5em] mb-6"
            >
              Nos Engagements
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase"
            >
              {content.title || t("features_title") || "L'excellence au service de votre mobilité"}
            </motion.h2>
          </div>
          <div className="lg:w-1/2">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg"
            >
              {content.subtitle || aboutText || t("features_subtitle") || "Découvrez pourquoi Vectoria est le choix privilégié des voyageurs exigeants au Maroc."}
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white p-12 rounded-[56px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-4 border border-slate-100 hover:border-primary/20 overflow-hidden"
            >
              {/* Card Sheen */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-20 h-20 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black mb-6 tracking-tight uppercase group-hover:text-primary transition-colors duration-500">{title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
