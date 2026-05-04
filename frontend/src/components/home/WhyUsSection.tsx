"use client";

import { motion } from "framer-motion";
import { Crown, HeadphonesIcon, ShieldCheck, Star, Car, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface WhyUsSectionProps {
  agency: any;
  content: any;
}

export default function WhyUsSection({ agency, content }: WhyUsSectionProps) {
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
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Nos Engagements</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {content.title || t("features_title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {content.subtitle || t("features_subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="card-premium p-12 group rounded-[48px] border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/5 text-primary flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500">
                <Icon size={36} />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">{title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium opacity-80">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
