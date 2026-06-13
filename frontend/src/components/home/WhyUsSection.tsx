"use client";

import { motion } from "framer-motion";
import { Crown, HeadphonesIcon, ShieldCheck, Star, Car, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface WhyUsSectionProps {
  content?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    features?: { icon: string; image?: string; title: string; desc: string }[];
  };
}

const ICON_MAP: Record<string, any> = {
  Crown, HeadphonesIcon, ShieldCheck, Star, Car, LayoutDashboard, Settings, Users
};

export default function WhyUsSection({ content = {} }: WhyUsSectionProps) {
  const { t } = useTranslation();

  const defaultFeatures = [
    { icon: "Crown", title: t("feat_fleet_title"), desc: t("feat_fleet_desc") },
    { icon: "HeadphonesIcon", title: t("feat_support_title"), desc: t("feat_support_desc") },
    { icon: "ShieldCheck", title: t("feat_chauffeur_title"), desc: t("feat_chauffeur_desc") },
  ];

  const features = content?.features?.length ? content.features : defaultFeatures;

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon || Crown;
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-xs uppercase tracking-[0.3em] mb-4"
          >
            {content?.eyebrow || "Nos engagements"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            {content?.title || t("features_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg"
          >
            {content?.subtitle || t("features_subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-primary/20 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500 overflow-hidden">
                  {feature.image ? (
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  ) : (
                    <Icon size={24} strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
