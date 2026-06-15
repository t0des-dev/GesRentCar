"use client";

import { motion } from "framer-motion";
import { Crown, HeadphonesIcon, ShieldCheck, Star, Car, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

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

  const defaultFeatures: { icon: string; image?: string; title: string; desc: string }[] = [
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
                className="group bg-white rounded-2xl border border-slate-100 hover:border-primary/20 transition-all duration-500 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-primary/5"
              >
                {feature.image ? (
                  <div className="w-full h-48 relative overflow-hidden shrink-0 bg-slate-100">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="px-8 pt-8 pb-2">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
