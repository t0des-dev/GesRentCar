"use client";

import { motion } from "framer-motion";
import { Crown, HeadphonesIcon, ShieldCheck, Star, Car, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getImageUrl } from "@/shared/utils/image";

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
    <section className="pt-10 pb-24 bg-surface-1">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          {/* AR7 Section mark — gold vertical tick */}
          <div className="section-mark" />
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow"
          >
            {content?.eyebrow || "Nos engagements"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-[44px] font-bold tracking-tight leading-[1.15] text-ink-1"
          >
            {content?.title || t("features_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[17px] text-ink-3 leading-relaxed max-w-lg"
          >
            {content?.subtitle || t("features_subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {features.map((feature, idx) => {
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="service-card-ar7 flex flex-col"
              >
                {feature.image ? (
                  <div className="w-full h-48 relative overflow-hidden rounded-xl mb-7 shrink-0 bg-surface-2">
                    <img
                      src={getImageUrl(feature.image) || feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="service-icon-ar7">
                    <Icon size={27} strokeWidth={1.4} className="text-gold" />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-[18.5px] font-bold text-ink-1 mb-3 leading-snug">{feature.title}</h3>
                  <p className="text-[14.5px] text-ink-3 leading-[1.7]">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
