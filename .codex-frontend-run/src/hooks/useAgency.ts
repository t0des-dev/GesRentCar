"use client";

import { useQuery } from "@tanstack/react-query";
import { hexToHsl } from "@/lib/utils";
import api from "@/lib/api/client";
import { useEffect, useMemo } from "react";

export interface NavLink {
  label: string;
  url: string;
}

export interface AgencyConfig {
  agency_name: string;
  agency_slogan: string;
  primary_color: string;
  hero_image_url?: string;
  hero_video_url?: string;
  about_text_fr?: string;
  about_text_en?: string;
  about_text_ar?: string;
  sections_config?: {
    featured?: boolean;
    stats?: boolean;
    why_us?: boolean;
    testimonials?: boolean;
    map?: boolean;
    vibe_selector?: boolean;
    lifestyle_gallery?: boolean;
    faq?: boolean;
    concierge_banner?: boolean;
  };
  header_config?: {
    sticky?: boolean;
    transparent_hero?: boolean;
    menu_links?: NavLink[];
  };
  footer_config?: {
    address?: string;
    phone?: string;
    email?: string;
    social_links?: {
      facebook?: string;
      instagram?: string;
      whatsapp?: string;
    };
  };
  theme_config?: {
    border_radius?: string;
    button_style?: string;
    glassmorphism?: boolean;
    font_family?: string;
  };
  stats_config?: {
    label_1?: string; value_1?: string;
    label_2?: string; value_2?: string;
    label_3?: string; value_3?: string;
    label_4?: string; value_4?: string;
  };
  category_prices?: any;
  special_offers?: any[];
  testimonials?: any[];
  sections_order?: any[];
  seo_config?: {
    title?: string;
    description?: string;
    keywords?: string;
    og_image?: string;
  };
}

const DEFAULT_CONFIG: AgencyConfig = {
  agency_name: "Vectoria Rent Car",
  agency_slogan: "Premium Car Rental Experience",
  primary_color: "#6366f1",
  sections_config: {
    featured: true,
    stats: true,
    why_us: true,
    testimonials: true,
    map: true,
    vibe_selector: true,
    lifestyle_gallery: true,
    faq: true,
    concierge_banner: true
  },
  header_config: {
    sticky: true,
    transparent_hero: true,
    menu_links: [
      { label: "Accueil", url: "/" },
      { label: "Flotte", url: "/fleet" },
      { label: "Contact", url: "/contact" }
    ]
  },
  theme_config: {
    border_radius: "24px",
    button_style: "pill",
    glassmorphism: true
  },
  stats_config: {
    label_1: "Clients satisfaits", value_1: "2,400+",
    label_2: "Véhicules premium", value_2: "80+",
    label_3: "Années d'expérience", value_3: "15",
    label_4: "Support disponible", value_4: "24/7"
  }
};

export function useAgency() {
  const { data } = useQuery({
    queryKey: ["agency-config"],
    queryFn: async () => {
      const { data } = await api.get(`/config?t=${Date.now()}`);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const config = useMemo(() => ({ 
    ...DEFAULT_CONFIG, 
    ...data 
  }), [data]);

  useEffect(() => {
    if (config.primary_color) {
      document.documentElement.style.setProperty("--primary", hexToHsl(config.primary_color));
    }
    if (config.theme_config?.border_radius) {
      document.documentElement.style.setProperty("--radius", config.theme_config.border_radius);
    }
  }, [config.primary_color, config.theme_config?.border_radius]);

  return config;
}
