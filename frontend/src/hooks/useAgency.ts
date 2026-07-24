"use client";

import { useQuery } from "@tanstack/react-query";
import { hexToHsl, hexToHslLight, hexToHslDark } from "@/shared/utils";
import api from "@/shared/services/client";
import { useEffect, useMemo } from "react";
import type { SectionsContent } from "@/types/storefront";

export interface NavLink {
  label: string;
  url: string;
}

export interface AgencyConfig {
  agency_name: string;
  agency_slogan: string;
  primary_color: string;
  logo_url?: string;
  logo_config?: {
    width?: string;
    height?: string;
    background?: string;
    background_opacity?: number;
    radius?: string;
    show_name?: boolean;
    transparent_bg?: boolean;
  };
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
    experience?: boolean;
    how_it_works?: boolean;
    cta_banner?: boolean;
    promotion_banner?: boolean;
    comparator?: boolean;
  };
  sections_content?: Partial<SectionsContent>;
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
      tiktok?: string;
    };
  };
  theme_config?: {
    border_radius?: string;
    button_style?: string;
    glassmorphism?: boolean;
    font_family?: string;
  };
  stats_config?: {
    columns?: string;
    theme?: string;
    height?: string;
    text_size?: string;
    text_color?: string;
    items?: Array<{
      id: string;
      value: string;
      label: string;
      icon?: string;
      color?: string;
    }>;
  };
  category_prices?: import("@/types/storefront").CategoryPrices;
  special_offers?: import("@/types/storefront").SpecialOffer[];
  testimonials?: import("@/types/storefront").Testimonial[];
  sections_order?: import("@/types/storefront").SectionOrder[];
  seo_config?: {
    title?: string;
    description?: string;
    keywords?: string;
    og_image?: string;
  };
  faq_config?: { q: string; a: string }[];
  features_config?: { icon: string; title: string; desc: string }[];
  concierge_config?: { title?: string; text?: string; badge?: string };
}

const DEFAULT_SECTIONS_CONTENT: SectionsContent = {
  hero: {
    badge: "Location Premium",
    title: "Vectoria Premium Experience",
    subtitle: "L'excellence automobile au Maroc",
    benefits: [
      { icon: "Shield", text: "Assurance tout risque" },
      { icon: "Zap", text: "Livraison instantanée" },
      { icon: "Clock", text: "Support VIP 24/7" },
    ],
  },
  why_us: { 
    title: "Pourquoi nous choisir ?", 
    subtitle: "L'excellence à chaque étape",
    features: [
      { icon: "Crown", title: "Flotte d'Exception", desc: "Une sélection rigoureuse des modèles les plus prestigieux du marché." },
      { icon: "ShieldCheck", title: "Assurance Premium", desc: "Roulez en toute sérénité avec nos couvertures tous risques incluses." },
      { icon: "HeadphonesIcon", title: "Service Conciergerie", desc: "Une assistance personnalisée disponible 24h/7j pour tous vos besoins." }
    ]
  },
  vibe: { 
    title: "Quelle est votre vibe aujourd'hui ?", 
    subtitle: "Choisissez l'émotion qui guidera votre voyage", 
    eyebrow: "Expérience Sur Mesure",
    columns: "4",
    items: [
      { id: "business", title: "Business Elite", subtitle: "Prestige & Stratégie", icon: "ShieldCheck", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800", color_from: "primary", color_via: "primary", lifestyle: "business" },
      { id: "romance", title: "Grand Tourisme", subtitle: "Émotion & Liberté", icon: "Wind", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800", color_from: "rose-500", color_via: "orange-500", lifestyle: "romance" },
      { id: "aventure", title: "Wild Adventure", subtitle: "Puissance & Exploration", icon: "Mountain", image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53?auto=format&fit=crop&q=80&w=800", color_from: "emerald-600", color_via: "teal-600", lifestyle: "adventure" },
      { id: "family", title: "Family First", subtitle: "Confort & Partage", icon: "Zap", image: "https://images.unsplash.com/photo-1549113294-313d8bc63a4c?auto=format&fit=crop&q=80&w=800", color_from: "gold", color_via: "gold", lifestyle: "family" }
    ]
  },
  lifestyle: { 
    title: "Bien plus qu'un simple trajet", 
    subtitle: "L'Expérience", 
    text: "Nous redéfinissons la mobilité de luxe en intégrant chaque voyage dans un style de vie d'exception",
    stats: [
      { value: "98%", label: "Recommandation" },
      { value: "24h", label: "Service VIP" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
        speed: 0.1,
        className: "col-span-6 h-[450px] mt-20"
      },
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
        speed: 0.2,
        className: "col-span-6 h-[550px]"
      },
      {
        url: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53?auto=format&fit=crop&q=80&w=800",
        speed: 0.15,
        className: "col-span-4 h-[400px] -mt-10"
      },
      {
        url: "https://images.unsplash.com/photo-1525609002752-ad9d9b9b4125?auto=format&fit=crop&q=80&w=800",
        speed: 0.25,
        className: "col-span-8 h-[500px]"
      }
    ]
  },
  faq: { title: "Questions fréquentes", subtitle: "Tout ce que vous devez savoir", badge: "Support Client", contact_text: "Vous avez encore des questions ?", contact_link: "/contact" },
  experience: {
    eyebrow: "L'Expérience Premium",
    title_line1: "Bien plus qu'un",
    title_line2: "simple trajet.",
    description: "Nous redéfinissons la mobilité de luxe avec une flotte d'exception, un service conciergerie 24/7 et une attention portée à chaque détail.",
    cta_text: "Voir toute la collection",
    cta_link: "/fleet",
    stats: [
      { value: "98%", label: "Recommandation" },
      { value: "24/7", label: "Support VIP" },
    ],
    lifestyles: [
      { id: "business", title: "Business Elite", subtitle: "Ponctualité et prestige", icon: "Shield", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800", color_from: "from-blue-400/20", color_via: "via-blue-400/10", lifestyle: "business" },
      { id: "romance", title: "Grand Tourisme", subtitle: "L'élégance à ciel ouvert", icon: "Star", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800", color_from: "from-pink-400/20", color_via: "via-pink-400/10", lifestyle: "romance" },
      { id: "adventure", title: "Wild Adventure", subtitle: "Puissance et liberté", icon: "Compass", image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53?auto=format&fit=crop&q=80&w=800", color_from: "from-orange-400/20", color_via: "via-orange-400/10", lifestyle: "adventure" },
    ],
    right_label: "Explorer par style",
  },
  how_it_works: {
    badge: "Simple & Rapide",
    steps: [
      { num: "01", title: "Choisissez", desc: "Parcourez notre collection et sélectionnez le véhicule parfait" },
      { num: "02", title: "Réservez", desc: "Complétez votre réservation en quelques clics" },
      { num: "03", title: "Profitez", desc: "Prenez le volant et vivez une expérience inoubliable" },
    ],
  },
  cta_banner: {
    eyebrow: "Prêt à prendre le volant ?",
    button_text: "Découvrir la flotte",
    button_link: "/fleet",
  },
  promotion_banner: {
    badge: "Programme Privilège",
    title_line1: "L'exclusivité au",
    title_line2: "bout des doigts.",
    description: "Accédez à des tarifs préférentiels, un service de livraison sur-mesure et des avantages réservés à notre cercle d'initiés.",
    cta_text: "Rejoindre le cercle",
    cta_link: "/register",
    side_note: "Inscription gratuite",
    footer_items: ["Paiement sécurisé", "Conciergerie 24/7"],
  },
  testimonials: {
    badge: "Avis Clients",
    heading: "Ce que disent nos clients",
    description: "Découvrez les expériences de ceux qui nous ont fait confiance.",
  },
  map: {
    badge: "Présence Nationale",
    slogan: "Une sélection de prestige pour ceux qui ne font aucun compromis sur l'excellence.",
    locations: [
      { city: "Casablanca", car: "Premium Fleet", user: "Client VIP", top: "60%", left: "40%" },
      { city: "Marrakech", car: "Luxury SUV", user: "Client VIP", top: "72%", left: "38%" },
      { city: "Tanger", car: "Elite Sedan", user: "Client VIP", top: "40%", left: "48%" },
      { city: "Agadir", car: "Prestige Car", user: "Client VIP", top: "85%", left: "30%" },
    ],
  },
  comparator: {
    badge: "Le Garage Comparateur",
    title: "Confrontez l'Excellence.",
    subtitle: "Choisissez deux modèles pour comparer leur ADN",
    vs_label: "VS",
    vehicles: [
      { id: "1", brand: "Rolls-Royce", model: "Ghost", image: "https://images.unsplash.com/photo-1631214524020-5e1839762691?q=80&w=800&auto=format&fit=crop", specs: [{ name: "prestige", value: 100, label: "Luxe Absolu" }, { name: "comfort", value: 95, label: "Confort Royal" }, { name: "speed", value: 70, label: "Puissance" }] },
      { id: "2", brand: "Range Rover", model: "Autobiography", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=800&auto=format&fit=crop", specs: [{ name: "prestige", value: 90, label: "Status Icon" }, { name: "comfort", value: 92, label: "Luxembourg" }, { name: "speed", value: 75, label: "Performances" }] },
      { id: "3", brand: "Porsche", model: "911 Carrera", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop", specs: [{ name: "prestige", value: 88, label: "Icône Sport" }, { name: "comfort", value: 78, label: "Sport Confort" }, { name: "speed", value: 98, label: "Vitesse Pure" }] },
    ],
  },
  sticky_booking: {
    placeholder: "Destination",
    search_label: "Rechercher",
  },
  featured_vehicles: {
    eyebrow: "Showroom",
    cta_text: "Voir le catalogue",
    cta_link: "/fleet",
    loading_text: "Chargement...",
    empty_heading: "Aucun véhicule disponible",
    empty_description: "Les véhicules vont bientôt être disponibles",
  },
  search_form: {
    location_label: "Destination",
    location_placeholder: "Ville, aéroport...",
    start_label: "Départ",
    end_label: "Retour",
    search_button: "Chercher un véhicule",
    fleet_link_text: "Voir toute la flotte",
    fleet_link_href: "/fleet",
  },
  fleet: {
    hero_image: "",
    hero_badge: "Premium Fleet",
    hero_title: "Explore Our Vehicle Fleet",
    hero_subtitle: "Find the perfect vehicle for business trips, family vacations and luxury experiences across Morocco.",
    search_button_text: "Search",
    default_location: "Casablanca — Mohammed V Airport",
    results_text: "Vehicles Found",
    sort_label: "Sort by:",
    default_sort: "recommended",
    filters_layout: "vertical",
    page_size: 10,
    columns: 3,
    empty_title: "No vehicles found",
    empty_description: "Try adjusting your filters to see more results.",
    load_more_text: "Load More",
  },
};

const DEFAULT_CONFIG: AgencyConfig = {
  agency_name: "Vectoria Rent Car",
  agency_slogan: "Premium Car Rental Experience",
  primary_color: "#6366f1",
  logo_url: "",
  hero_video_url: "",
  about_text_fr: "",
  about_text_en: "",
  about_text_ar: "",
  special_offers: [],
  sections_config: {
    featured: true,
    stats: true,
    why_us: true,
    testimonials: true,
    map: true,
    vibe_selector: true,
    lifestyle_gallery: true,
    faq: true,
    concierge_banner: true,
    experience: true,
    how_it_works: true,
    cta_banner: true,
    promotion_banner: true,
    comparator: true,
  },
  sections_content: DEFAULT_SECTIONS_CONTENT,
  header_config: {
    sticky: true,
    transparent_hero: true,
    menu_links: [
      { label: "Accueil", url: "/" },
      { label: "Flotte", url: "/fleet" },
      { label: "Contact", url: "/contact" },
    ],
  },
  theme_config: {
    border_radius: "24px",
    button_style: "pill",
    glassmorphism: true,
  },
  stats_config: {
    columns: "4",
    theme: "dark",
    height: "normal",
    text_size: "normal",
    text_color: "",
    items: [
      { id: "s1", label: "Clients satisfaits", value: "2,400+", icon: "Users", color: "primary" },
      { id: "s2", label: "Véhicules premium", value: "80+", icon: "Car", color: "indigo" },
      { id: "s3", label: "Années d'expérience", value: "15", icon: "Clock", color: "emerald" },
      { id: "s4", label: "Support disponible", value: "24/7", icon: "Phone", color: "rose" }
    ]
  },
  faq_config: [
    { q: "Comment réserver un véhicule ?", a: "Sélectionnez votre véhicule, choisissez vos dates et complétez le paiement en ligne." },
    { q: "Quels sont les moyens de paiement acceptés ?", a: "Nous acceptons les cartes bancaires, virements et espèces avec caution." },
    { q: "Y a-t-il une limite de kilométrage ?", a: "Nos forfaits incluent un kilométrage illimité sur tous les véhicules." },
    { q: "Puis-je annuler ma réservation ?", a: "Oui, l'annulation est gratuite jusqu'à 48h avant le début de la location." },
    { q: "Proposez-vous la livraison ?", a: "Oui, nous livrons votre véhicule à l'adresse de votre choix (aéroport, hôtel, domicile)." },
  ],
  features_config: [
    { icon: "HeadphonesIcon", title: "Support Premium", desc: "Une équipe dédiée à votre écoute 24h/24 et 7j/7 pour une tranquillité d'esprit totale." },
    { icon: "ShieldCheck", title: "Assurance Complète", desc: "Une couverture tous risques incluse pour rouler l'esprit léger." },
    { icon: "Star", title: "Véhicules Certifiés", desc: "Chaque véhicule de notre flotte est inspecté et certifié avant chaque location." },
  ],
  concierge_config: {
    title: "Besoin d'aide pour choisir ?",
    text: "Laissez notre Concierge IA vous guider vers le véhicule parfait selon votre occasion et votre style.",
    badge: "Assistance Personnalisée",
  },
};

export function useAgency() {
  const { data } = useQuery({
    queryKey: ["agency-config"],
    queryFn: async () => {
      const { data } = await api.get(`/config?t=${Date.now()}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const config = useMemo(() => {
    const merged: AgencyConfig = { ...DEFAULT_CONFIG, ...data };
    if (data?.sections_content) {
      merged.sections_content = {
        ...DEFAULT_SECTIONS_CONTENT,
        ...data.sections_content,
      };
      
      // Ensure why_us is merged properly
      merged.sections_content!.why_us = {
        ...(DEFAULT_SECTIONS_CONTENT.why_us || {}),
        ...(data.sections_content.why_us || {})
      };

      // Ensure testimonials is merged properly
      merged.sections_content!.testimonials = {
        ...(DEFAULT_SECTIONS_CONTENT.testimonials || {}),
        ...(data.sections_content.testimonials || {})
      };

      // Recover legacy features_config into why_us if it doesn't exist yet
      if ((!data.sections_content.why_us?.features || data.sections_content.why_us.features.length === 0) && merged.features_config && merged.features_config.length > 0) {
        merged.sections_content!.why_us!.features = merged.features_config as import("@/types/storefront").FeatureItem[];
      }

      // Recover legacy testimonials into sections_content.testimonials.items
      if ((!data.sections_content.testimonials?.items || data.sections_content.testimonials.items.length === 0) && merged.testimonials && merged.testimonials.length > 0) {
        merged.sections_content!.testimonials!.items = merged.testimonials;
      }
    } else {
      if (merged.features_config && merged.features_config.length > 0 && merged.sections_content) {
        merged.sections_content.why_us = {
          ...(merged.sections_content.why_us || {}),
          features: merged.features_config as import("@/types/storefront").FeatureItem[]
        } as SectionsContent['why_us'];
      }
      if (merged.testimonials && merged.testimonials.length > 0 && merged.sections_content) {
        merged.sections_content.testimonials = {
          ...(merged.sections_content.testimonials || {}),
          items: merged.testimonials
        } as SectionsContent['testimonials'];
      }
    }
    return merged;
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;

    if (config.primary_color) {
      const hsl = hexToHsl(config.primary_color);
      root.style.setProperty("--primary", hsl);
      root.style.setProperty("--accent", hsl);
      root.style.setProperty("--ring", hsl);
      root.style.setProperty("--gold", hsl);
      root.style.setProperty("--gold-light", hexToHslLight(config.primary_color, 35));
      root.style.setProperty("--gold-dark", hexToHslDark(config.primary_color, 12));
    }
    if (config.theme_config?.border_radius) {
      root.style.setProperty("--radius", config.theme_config.border_radius);
    }

    // Font family from CMS
    if (config.theme_config?.font_family) {
      root.style.setProperty("--font-family", config.theme_config.font_family);
      document.body.style.fontFamily = `"${config.theme_config.font_family}", "Cairo", system-ui, sans-serif`;
    }

    // Button style from CMS (maps to border-radius)
    if (config.theme_config?.button_style) {
      const btnRadiusMap: Record<string, string> = {
        square: "0px",
        rounded: "12px",
        pill: "9999px",
      };
      const btnRadius = btnRadiusMap[config.theme_config.button_style] || "12px";
      root.style.setProperty("--btn-radius", btnRadius);
    }

    // Glassmorphism toggle
    if (config.theme_config?.glassmorphism === false) {
      root.classList.add("no-glass");
    } else {
      root.classList.remove("no-glass");
    }
  }, [config.primary_color, config.theme_config?.border_radius, config.theme_config?.font_family, config.theme_config?.button_style, config.theme_config?.glassmorphism]);

  return config;
}

export { DEFAULT_SECTIONS_CONTENT };
export type { SectionsContent };