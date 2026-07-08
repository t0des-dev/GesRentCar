export interface MenuLink {
  label: string;
  url: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  whatsapp: string;
  tiktok?: string;
}

export interface HeaderConfig {
  sticky: boolean;
  transparent_hero: boolean;
  menu_links: MenuLink[];
}

export interface FooterConfig {
  address: string;
  phone: string;
  email: string;
  social_links: SocialLinks;
}

export interface ThemeConfig {
  border_radius: string;
  button_style: string;
  glassmorphism: boolean;
  font_family: string;
}

export interface SectionsConfig {
  featured: boolean;
  stats: boolean;
  why_us: boolean;
  testimonials: boolean;
  map: boolean;
  vibe_selector: boolean;
  lifestyle_gallery: boolean;
  faq: boolean;
  concierge_banner: boolean;
  experience: boolean;
  how_it_works: boolean;
  cta_banner: boolean;
  promotion_banner: boolean;
  comparator: boolean;
}

export interface SectionOrder {
  id: string;
  label: string;
  active: boolean;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

export interface CategoryPrices {
  eco: number;
  standard: number;
  suv: number;
  luxury: number;
  sport: number;
}

export interface SpecialOffer {
  category: string;
  discount: number;
  end_date: string;
  active: boolean;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface StatsConfig {
  columns?: string;
  theme?: string;
  height?: string;
  text_size?: string;
  text_color?: string;
  items: StatItem[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ConciergeConfig {
  title: string;
  text: string;
  badge?: string;
}

export interface SectionsContent {
  hero: { badge: string; title: string; subtitle: string; benefits?: { icon: string; text: string }[] };
  why_us: { title: string; subtitle: string; features?: { icon: string; image?: string; title: string; desc: string }[] };
  vibe: { title: string; subtitle: string; eyebrow?: string; columns?: string; items?: LifestyleItem[] };
  lifestyle: { title: string; subtitle: string; text: string; stats?: { value: string; label: string }[]; images?: LifestyleImage[] };
  faq: { title: string; subtitle: string; badge?: string; contact_text?: string; contact_link?: string };
  experience: {
    eyebrow: string;
    title_line1: string;
    title_line2: string;
    description: string;
    cta_text: string;
    cta_link: string;
    stats: { value: string; label: string }[];
    lifestyles: LifestyleItem[];
    right_label?: string;
  };
  how_it_works: {
    badge: string;
    steps: HowItWorksStep[];
  };
  cta_banner: {
    eyebrow: string;
    button_text: string;
    button_link: string;
  };
  promotion_banner: {
    badge: string;
    title_line1: string;
    title_line2: string;
    description: string;
    cta_text: string;
    cta_link: string;
    side_note: string;
    footer_items: string[];
  };
  testimonials: {
    badge: string;
    heading: string;
    description: string;
    items?: { name: string; role: string; content: string; image?: string }[];
  };
  map: {
    badge: string;
    slogan: string;
    locations: MapLocation[];
  };
  comparator: {
    badge: string;
    title: string;
    subtitle: string;
    vs_label: string;
    vehicles: ComparatorVehicle[];
  };
  sticky_booking: {
    placeholder: string;
    search_label: string;
  };
  featured_vehicles: {
    eyebrow: string;
    cta_text: string;
    cta_link: string;
    loading_text: string;
    empty_heading: string;
    empty_description: string;
  };
  search_form: {
    location_label: string;
    location_placeholder: string;
    start_label: string;
    end_label: string;
    search_button: string;
    fleet_link_text: string;
    fleet_link_href: string;
  };
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

export interface LifestyleItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  color_from: string;
  color_via: string;
  lifestyle: string;
  cta_text?: string;
  link?: string;
}

export interface LifestyleImage {
  url: string;
  speed: number;
  className: string;
}

export interface HowItWorksStep {
  num: string;
  title: string;
  desc: string;
}

export interface MapLocation {
  city: string;
  car: string;
  user: string;
  top: string;
  left: string;
}

export interface ComparatorVehicle {
  id: string;
  brand: string;
  model: string;
  image: string;
  specs: { name: string; value: number; label: string }[];
}

export interface StorefrontForm {
  name: string;
  slogan: string;
  primary_color: string;
  logo_url: string;
  logo_config?: {
    width?: string;
    height?: string;
    background?: string;
    radius?: string;
    show_name?: boolean;
  };
  hero_image_url: string;
  hero_video_url: string;
  about_text_fr: string;
  about_text_en: string;
  about_text_ar: string;
  sections_config: SectionsConfig;
  sections_order: SectionOrder[];
  testimonials: Testimonial[];
  seo_config: SEOConfig;
  category_prices: CategoryPrices;
  special_offers: SpecialOffer[];
  header_config: HeaderConfig;
  footer_config: FooterConfig;
  theme_config: ThemeConfig;
  stats_config: StatsConfig;
  faq_config: FAQItem[];
  features_config: FeatureItem[];
  concierge_config: ConciergeConfig;
  sections_content: SectionsContent;
}