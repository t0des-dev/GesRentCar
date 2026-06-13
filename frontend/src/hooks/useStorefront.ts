"use client";

import { useAgency, DEFAULT_SECTIONS_CONTENT } from "@/hooks/useAgency";
import type { SectionsContent } from "@/types/storefront";
import { DEFAULT_GALLERY_IMAGES, DEFAULT_GALLERY_STATS } from "@/components/LifestyleGallery";

export interface StorefrontData {
  agency_name: string;
  agency_slogan: string;
  hero_image_url: string;
  hero_video_url: string | null;
  about_text_fr: string;
  about_text_en: string;
  about_text_ar: string;
  sections_content: SectionsContent;
  faq_config: { q: string; a: string }[];
  features_config: { icon: string; title: string; desc: string }[];
  concierge_config: { title: string; text: string; badge: string };
  testimonials: any[];
  stats_config: { label_1: string; value_1: string; label_2: string; value_2: string; label_3: string; value_3: string; label_4: string; value_4: string };
  sections_config: Record<string, boolean | undefined>;
  sections_order?: any[];
}

// Ensure DEFAULT_SECTIONS_CONTENT has all required fields with proper defaults
const FULL_DEFAULT_SECTIONS_CONTENT: SectionsContent = {
  ...DEFAULT_SECTIONS_CONTENT,
  lifestyle: {
    subtitle: "L'Expérience",
    title: "Bien plus qu'un simple trajet",
    text: "Nous redéfinissons la mobilité de luxe en intégrant chaque voyage dans un style de vie d'exception",
    images: DEFAULT_GALLERY_IMAGES,
  },
  testimonials: {
    badge: "Avis Clients",
    heading: "Ce que disent nos clients",
    description: "Découvrez les expériences de ceux qui nous ont fait confiance.",
  },
};

export function useStorefront(): StorefrontData {
  const agency = useAgency();

  // Merge agency sections_content with defaults
  const content: SectionsContent = {
    ...FULL_DEFAULT_SECTIONS_CONTENT,
    ...agency.sections_content,
  };

  // Recover why_us fields correctly
  content.why_us = {
    ...(FULL_DEFAULT_SECTIONS_CONTENT.why_us || {}),
    ...(agency.sections_content?.why_us || {}),
  };

  // Recover custom features from old features_config if they exist
  if (!content.why_us.features || content.why_us.features.length === 0) {
    if (agency.features_config && agency.features_config.length > 0) {
      content.why_us.features = agency.features_config;
    } else {
      content.why_us.features = [
        { icon: "Crown", title: "Flotte d'Exception", desc: "Une sélection rigoureuse des modèles les plus prestigieux du marché." },
        { icon: "ShieldCheck", title: "Assurance Premium", desc: "Roulez en toute sérénité avec nos couvertures tous risques incluses." },
        { icon: "HeadphonesIcon", title: "Service Conciergerie", desc: "Une assistance personnalisée disponible 24h/7j pour tous vos besoins." },
      ];
    }
  }

  return {
    agency_name: agency.agency_name || "Vectoria Rent Car",
    agency_slogan: agency.agency_slogan || "Premium Car Rental Experience",
    hero_image_url: agency.hero_image_url || "",
    hero_video_url: agency.hero_video_url || null,
    about_text_fr: agency.about_text_fr || "",
    about_text_en: agency.about_text_en || "",
    about_text_ar: agency.about_text_ar || "",
    sections_content: content,
    faq_config: agency.faq_config || content.faq as any,
    features_config: agency.features_config || [],
    concierge_config: {
      title: agency.concierge_config?.title || "Besoin d'aide pour choisir ?",
      text: agency.concierge_config?.text || "Laissez notre Concierge IA vous guider vers le véhicule parfait selon votre occasion et votre style.",
      badge: agency.concierge_config?.badge || "Assistance Personnalisée",
    },
    testimonials: agency.testimonials || [],
    stats_config: {
      label_1: agency.stats_config?.label_1 || "Clients satisfaits",
      value_1: agency.stats_config?.value_1 || "2,400+",
      label_2: agency.stats_config?.label_2 || "Véhicules premium",
      value_2: agency.stats_config?.value_2 || "80+",
      label_3: agency.stats_config?.label_3 || "Années d'expérience",
      value_3: agency.stats_config?.value_3 || "15",
      label_4: agency.stats_config?.label_4 || "Support disponible",
      value_4: agency.stats_config?.value_4 || "24/7",
    },
    sections_config: agency.sections_config || {},
    sections_order: agency.sections_order || [],
  };
}