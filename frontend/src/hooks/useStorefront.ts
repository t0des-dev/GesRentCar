"use client";

import { useAgency, DEFAULT_SECTIONS_CONTENT } from "@/hooks/useAgency";
import type { SectionsContent, Testimonial, StatItem, SectionOrder } from "@/types/storefront";
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
  testimonials: Testimonial[];
  stats_config: { columns?: string; theme?: string; height?: string; text_size?: string; text_color?: string; items: StatItem[] };
  sections_config: Record<string, boolean | undefined>;
  sections_order?: SectionOrder[];
  header_config?: import("./useAgency").AgencyConfig["header_config"];
  footer_config?: import("./useAgency").AgencyConfig["footer_config"];
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
    hero: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.hero || {}),
      ...(agency.sections_content?.hero || {}),
    },
    search_form: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.search_form || {}),
      ...(agency.sections_content?.search_form || {}),
    },
    featured_vehicles: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.featured_vehicles || {}),
      ...(agency.sections_content?.featured_vehicles || {}),
    },
    why_us: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.why_us || {}),
      ...(agency.sections_content?.why_us || {}),
    },
    experience: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.experience || {}),
      ...(agency.sections_content?.experience || {}),
    },
    faq: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.faq || {}),
      ...(agency.sections_content?.faq || {}),
    },
    cta_banner: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.cta_banner || {}),
      ...(agency.sections_content?.cta_banner || {}),
    },
    promotion_banner: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.promotion_banner || {}),
      ...(agency.sections_content?.promotion_banner || {}),
    },
    fleet: {
      ...(FULL_DEFAULT_SECTIONS_CONTENT.fleet || {}),
      ...(agency.sections_content?.fleet || {}),
    },
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

  // Recover legacy stats_config
  let statsItems = agency.stats_config?.items;
  if (!statsItems || statsItems.length === 0) {
    if (agency.stats_config && ('label_1' in agency.stats_config || 'value_1' in agency.stats_config)) {
      const legacy = agency.stats_config as Record<string, string | undefined>;
      statsItems = [];
      if (legacy.label_1 || legacy.value_1) statsItems.push({ id: "s1", label: legacy.label_1 || "Clients", value: legacy.value_1 || "", icon: "Users", color: "primary" });
      if (legacy.label_2 || legacy.value_2) statsItems.push({ id: "s2", label: legacy.label_2 || "Véhicules", value: legacy.value_2 || "", icon: "Car", color: "indigo" });
      if (legacy.label_3 || legacy.value_3) statsItems.push({ id: "s3", label: legacy.label_3 || "Expérience", value: legacy.value_3 || "", icon: "Clock", color: "emerald" });
      if (legacy.label_4 || legacy.value_4) statsItems.push({ id: "s4", label: legacy.label_4 || "Support", value: legacy.value_4 || "", icon: "Phone", color: "rose" });
    } else {
      // Default items matching TrustBar service advantages
      statsItems = [
        { id: "s1", label: "24/7 Assistance", value: "", icon: "Clock", color: "primary" },
        { id: "s2", label: "Airport Delivery", value: "", icon: "Car", color: "primary" },
        { id: "s3", label: "Unlimited Mileage", value: "", icon: "Target", color: "primary" },
        { id: "s4", label: "Insurance Included", value: "", icon: "Shield", color: "primary" },
        { id: "s5", label: "Transparent Pricing", value: "", icon: "CreditCard", color: "primary" },
        { id: "s6", label: "Fast Booking", value: "", icon: "Zap", color: "primary" },
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
    faq_config: agency.faq_config || (content.faq as unknown as { q: string; a: string }[]),
    features_config: agency.features_config || [],
    concierge_config: {
      title: agency.concierge_config?.title || "Besoin d'aide pour choisir ?",
      text: agency.concierge_config?.text || "Laissez notre Concierge IA vous guider vers le véhicule parfait selon votre occasion et votre style.",
      badge: agency.concierge_config?.badge || "Assistance Personnalisée",
    },
    testimonials: agency.testimonials || [],
    stats_config: {
      columns: agency.stats_config?.columns || "4",
      theme: agency.stats_config?.theme || "dark",
      height: agency.stats_config?.height || "normal",
      text_size: agency.stats_config?.text_size || "normal",
      text_color: agency.stats_config?.text_color || "",
      items: statsItems
    },
    sections_config: agency.sections_config || {},
    sections_order: agency.sections_order || [],
    header_config: agency.header_config,
    footer_config: agency.footer_config,
  };
}