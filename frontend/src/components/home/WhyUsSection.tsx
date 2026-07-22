"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getImageUrl } from "@/shared/utils/image";
import { ALL_ICONS } from "@/modules/storefront/components/cms/IconPicker";

interface WhyUsSectionProps {
  content?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    features?: { icon: string; image?: string; title: string; desc: string }[];
  };
}

export default function WhyUsSection({ content = {} }: WhyUsSectionProps) {
  const { t } = useTranslation();

  const defaultFeatures: { icon: string; image?: string; title: string; desc: string }[] = [
    { icon: "Crown", title: t("feat_fleet_title"), desc: t("feat_fleet_desc") },
    { icon: "Headphones", title: t("feat_support_title"), desc: t("feat_support_desc") },
    { icon: "ShieldCheck", title: t("feat_chauffeur_title"), desc: t("feat_chauffeur_desc") },
  ];

  const features = content?.features?.length ? content.features : defaultFeatures;

  const getIcon = (iconName: string) => {
    const Icon = ALL_ICONS[iconName];
    return Icon || Crown;
  };

  return (
    <section className="py-24 lg:py-32 bg-surface-1">
      <div className="max-w-[var(--container)] mx-auto px-8">
        <div className="section-head max-w-[640px] mb-16">
          <div className="section-mark" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow-theme"
          >
            {content?.eyebrow || "Nos engagements"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(30px,3.6vw,44px)] font-bold tracking-tight text-[var(--navy)]"
          >
            {content?.title || t("features_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[17px] text-[#5b6472] leading-[1.65] max-w-lg"
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
                className="group bg-white rounded-[18px] border border-[var(--line)] overflow-hidden flex flex-col transition-all duration-400 hover:border-[var(--gold)] hover:-translate-y-1 hover:shadow-[var(--shadow-theme)]"
              >
                {feature.image ? (
                  <div className="w-full h-48 relative overflow-hidden shrink-0 bg-surface-2">
                    <img src={getImageUrl(feature.image) || feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="px-8 pt-8 pb-2">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/[0.14] flex items-center justify-center text-[var(--gold)] group-hover:bg-[var(--gold)]/20 transition-all duration-500">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[var(--navy)] mb-3 group-hover:text-[var(--gold)] transition-colors">{feature.title}</h3>
                  <p className="text-sm text-[#5b6472] leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
