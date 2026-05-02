"use client";

import { useState, useEffect } from "react";
import { hexToHsl } from "@/lib/utils";
import api from "@/lib/api/client";

export interface NavLink {
  label: string;
  url: string;
}

export interface AgencyConfig {
  agency_name: string;
  agency_slogan: string;
  primary_color: string;
  hero_image_url?: string;
  about_text_fr?: string;
  about_text_en?: string;
  about_text_ar?: string;
  sections_config?: {
    featured?: boolean;
    stats?: boolean;
    why_us?: boolean;
    testimonials?: boolean;
    map?: boolean;
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

export function useAgency() {
  const [config, setConfig] = useState<AgencyConfig>({
    agency_name: "Vectoria Rent Car",
    agency_slogan: "Premium Car Rental Experience",
    primary_color: "#6366f1",
    sections_config: {
      featured: true,
      stats: true,
      why_us: true,
      testimonials: true,
      map: true
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
    }
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get("/config");
        if (data) {
          // Merge defaults with fetched data
          setConfig(prev => ({ ...prev, ...data }));
          
          if (data.primary_color) {
            document.documentElement.style.setProperty("--primary", hexToHsl(data.primary_color));
          }
          if (data.theme_config?.border_radius) {
            document.documentElement.style.setProperty("--radius", data.theme_config.border_radius);
          }
        }
      } catch (err) {
        console.error("Failed to fetch agency config:", err);
      }
    };
    
    fetchConfig();
  }, []);

  return config;
}
