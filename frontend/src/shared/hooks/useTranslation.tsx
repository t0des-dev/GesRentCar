"use client";

import { useState, createContext, useContext, useEffect, useCallback } from "react";

type Language = "fr" | "en";

const translations = {
  fr: {
    nav_home: "Accueil",
    nav_fleet: "Notre Flotte",
    nav_locations: "Agences",
    nav_offers: "Offres",
    nav_about: "À Propos",
    nav_faq: "FAQ",
    nav_login: "Connexion",
    nav_dashboard: "Compte VIP",
    nav_logout: "Déconnexion",
    nav_book: "Réserver",
    nav_contact: "Contact",
    footer_cookies: "Paramètres de cookies",
    footer_privacy: "Confidentialité",
    footer_accessibility: "Accessibilité",
    footer_dsa: "Législation sur les services numériques",
    footer_terms: "Conditions générales",
    hero_title: "L'excellence de la location avec",
    hero_subtitle: "Découvrez une flotte de véhicules premium, des tarifs transparents et un service client disponible 24/7.",
    btn_catalog: "Voir le catalogue",
    btn_agency: "Notre agence",
    search_placeholder: "Rechercher un véhicule...",
    featured_vehicles: "Véhicules Vedettes",
    why_us: "Pourquoi choisir",
    quick_booking: "Réservation Rapide",
    safety: "Sécurité Totale",
    assistance: "Assistance 24/7",
    rent_now: "Réserver maintenant",
    price_per_day: "par jour",
    start_date: "Date de début",
    end_date: "Date de fin",
    confirm_booking: "Confirmer la réservation",
    success_booking: "Réservation réussie !",
    available: "Disponible",
    maintenance: "Maintenance",
    rented: "Loué",
    features_title: "L'Expérience Premium",
    features_subtitle: "Découvrez pourquoi nos clients nous choisissent pour leurs déplacements professionnels et personnels.",
    feat_support_title: "Support 24/7",
    feat_support_desc: "Une équipe dédiée à votre service à tout moment, où que vous soyez au Maroc.",
    feat_chauffeur_title: "Service Chauffeur VIP",
    feat_chauffeur_desc: "Profitez de votre trajet en toute sérénité avec nos chauffeurs professionnels qualifiés.",
    feat_fleet_title: "Flotte Prestige",
    feat_fleet_desc: "Des véhicules récents, parfaitement entretenus, pour un confort et une sécurité absolue.",
    how_it_works: "Comment ça marche ?",
    step_1_title: "Choisissez",
    step_1_desc: "Parcourez notre collection et sélectionnez le véhicule idéal.",
    step_2_title: "Réservez",
    step_2_desc: "Indiquez vos dates et confirmez en quelques clics.",
    step_3_title: "Roulez",
    step_3_desc: "Récupérez vos clés et profitez de la route.",
    stat_clients: "Clients satisfaits",
    stat_fleet: "Véhicules premium",
    stat_exp: "Années d'expérience",
    stat_support: "Support disponible",
    
    // Filters & Specs
    filter_title: "FILTRES",
    filter_clear: "EFFACER",
    filter_category: "CATÉGORIE",
    filter_transmission: "TRANSMISSION",
    filter_capacity: "CAPACITÉ",
    filter_price_max: "PRIX MAX",
    spec_seats: "Capacité",
    spec_fuel: "Moteur",
    spec_gearbox: "Boîte",
    spec_pers: "pers",
    currency_day: "DH / JOUR",
    vision_360: "Vision 360°",
    compare: "Comparer",
    all: "Tout",
    
    // Fleet Page
    fleet_title_1: "L'ART DE LA",
    fleet_title_2: "PERFORMANCE",
    fleet_subtitle: "Découvrez une collection de véhicules d'exception, alliant ingénierie de pointe et design intemporel.",
    fleet_count: "véhicules disponibles",
    fleet_sync: "Synchronisation...",
    fleet_empty_title: "Aucun véhicule trouvé",
    fleet_empty_desc: "Ajustez vos critères pour découvrir d'autres véhicules de notre collection.",
    fleet_filters: "Filtres",
    fleet_apply_filters: "Appliquer les filtres",
    fleet_search_brand: "Rechercher marque/modèle...",
    fleet_sort: "Trier:",
    fleet_clear_filters: "Réinitialiser les filtres",
    fleet_destination: "Destination",
    fleet_search_btn: "Chercher",
    fleet_hour: "Heure",
    filter_your_vibe: "Votre Vibe",
    sort_price_asc: "Prix: Croissant",
    sort_price_desc: "Prix: Décroissant",
    sort_year_desc: "Plus Récents",
    sort_brand_asc: "Marque (A-Z)",
    load_more: "Afficher plus",
    
    // Quick View
    qv_rent: "Louer maintenant",
    qv_continue: "Continuer mes recherches",
    qv_security: "Sécurité",
    qv_fuel: "Carburant",
    qv_transmission: "Transmission",
    qv_seats: "Places",
    
    // Badges & Labels
    badge_special: "OFFRE SPÉCIALE",
    badge_internal: "INTERNE",
    fleet_tag: "Flotte de Luxe 2026",
    
    // Membership Banner
    member_title: "Membre Privilège ?",
    member_desc: "Bénéficiez de -15% sur toute la collection Sport.",
    member_btn: "S'inscrire",

    // Categories
    cat_all: "Tout",
    cat_sedan: "Berline",
    cat_suv: "SUV",
    cat_sport: "Sport",
    cat_compact: "Compacte",
    cat_luxury: "Luxe",
    cat_internal: "Interne",
    cat_collaborator: "Collaborateur",
    cat_economy: "Économique",
    cat_utility: "Utilitaire",
    cat_standard: "Standard",
    trans_automatic: "Automatique",
    trans_automatique: "Automatique",
    trans_manual: "Manuelle",
    trans_manuelle: "Manuelle",

    // Contact Page
    contact_title: "Contactez-nous",
    contact_subtitle: "Une question ? Notre équipe est à votre écoute pour vous accompagner.",
    contact_name: "Nom complet",
    contact_email: "Adresse Email",
    contact_subject: "Sujet",
    contact_message: "Votre message",
    contact_send: "Envoyer le message",
    contact_success: "Message envoyé avec succès !",
    contact_info_title: "Nos Coordonnées",
    contact_info_desc: "Retrouvez-nous dans nos agences ou contactez-nous directement.",

    // FAQ Section
    faq_title: "Questions Fréquentes",
    faq_subtitle: "Tout ce que vous devez savoir sur la location de prestige chez Vectoria.",
    faq_q1: "Quels documents sont nécessaires pour louer un véhicule ?",
    faq_a1: "Vous devez présenter un permis de conduire valide (depuis plus de 2 ans), une pièce d'identité (CNI ou Passeport) et une carte de crédit pour la caution.",
    faq_q2: "Le montant de la caution est-il bloqué sur ma carte ?",
    faq_a2: "Oui, une pré-autorisation est effectuée sur votre carte bancaire au moment de la prise du véhicule. Le montant dépend de la catégorie du véhicule choisi.",
    faq_q3: "L'assurance est-elle incluse dans le tarif ?",
    faq_a3: "Oui, tous nos tarifs incluent une assurance tous risques avec franchise. Vous pouvez également souscrire à des options de rachat de franchise pour plus de sérénité.",
    faq_q4: "Est-il possible de livrer le véhicule à l'aéroport ?",
    faq_a4: "Absolument. Nous proposons un service de livraison et de récupération gratuit dans les principaux aéroports du Maroc (Casablanca, Marrakech, Agadir, etc.).",
    faq_q5: "Puis-je annuler ma réservation ?",
    faq_a5: "Oui, l'annulation est gratuite jusqu'à 48 heures avant le début de la location. Passé ce délai, des frais peuvent s'appliquer selon les conditions choisies.",

    // About Page
    about_hero_title: "L'Art de la Mobilité Prestige",
    about_hero_subtitle: "Vectoria Redéfinit les standards de la location de luxe au Maroc depuis 2024.",
    about_story_label: "Notre Histoire",
    about_story_title: "Une vision d'excellence",
    about_story_p1: "Née de la passion pour l'automobile d'exception et le service personnalisé, Vectoria s'est imposée comme la référence de la location premium.",
    about_mission_title: "Notre Mission",
    about_mission_desc: "Offrir bien plus qu'une simple location : une expérience mémorable où chaque détail compte, de la réservation à la restitution.",
    about_values_title: "Nos Valeurs",
    about_val_1: "Excellence",
    about_val_1_desc: "Une quête permanente de perfection dans nos services.",
    about_val_2: "Confiance",
    about_val_2_desc: "Une transparence totale sur nos tarifs et conditions.",
    about_val_3: "Innovation",
    about_val_3_desc: "Des outils technologiques au service de votre confort.",
    cta_title: "Prêt pour la route ?",
    cta_desc: "Réservez votre véhicule de rêve en quelques minutes et profitez de l'excellence.",

    // Footer
    footer_hours: "Horaires",
    footer_hours_open: "Lun - Sam: 9h00 - 19h00",
    footer_hours_closed: "Dim: Fermé",
    footer_contact: "Contact",
    footer_newsletter: "Newsletter",
    newsletter_title: "Restez connecté avec l'excellence",
    newsletter_desc: "Recevez nos meilleures offres de location et nouveautés en avant-première.",
    footer_newsletter_desc: "Offres exclusives et nouvelles arrivées.",
    footer_newsletter_thanks: "✓ Merci de votre inscription !",
    footer_rights: "Tous droits réservés.",
    footer_secure_payment: "Paiement sécurisé",

    // Errors
    errors_title: "Erreur",
    errors_admin: "Une erreur est survenue dans l'administration.",
    errors_dashboard: "Une erreur est survenue dans votre tableau de bord.",
    errors_generic: "Une erreur est survenue.",
    errors_retry: "Réessayer",
  },
  en: {
    nav_home: "Home",
    nav_fleet: "Our Fleet",
    nav_locations: "Locations",
    nav_offers: "Special Offers",
    nav_about: "About Us",
    nav_faq: "FAQ",
    nav_login: "Sign In",
    nav_dashboard: "Account",
    nav_logout: "Logout",
    nav_book: "Book Now",
    nav_contact: "Contact",
    footer_cookies: "Cookie Settings",
    footer_privacy: "Privacy Policy",
    footer_accessibility: "Accessibility",
    footer_dsa: "Digital Services Act",
    footer_terms: "Terms & Conditions",
    hero_title: "Rental excellence with",
    hero_subtitle: "Discover a fleet of premium vehicles, transparent rates, and 24/7 customer service.",
    btn_catalog: "View Catalog",
    btn_agency: "Our Agency",
    search_placeholder: "Search for a vehicle...",
    featured_vehicles: "Featured Vehicles",
    why_us: "Why choose",
    quick_booking: "Quick Booking",
    safety: "Total Safety",
    assistance: "24/7 Assistance",
    rent_now: "Rent Now",
    price_per_day: "per day",
    start_date: "Start Date",
    end_date: "End Date",
    confirm_booking: "Confirm Booking",
    success_booking: "Booking Successful!",
    available: "Available",
    maintenance: "Maintenance",
    rented: "Rented",
    features_title: "The Premium Experience",
    features_subtitle: "Discover why our clients choose us for their professional and personal travels.",
    feat_support_title: "24/7 Support",
    feat_support_desc: "A dedicated team at your service anytime, anywhere in Morocco.",
    feat_chauffeur_title: "VIP Chauffeur Service",
    feat_chauffeur_desc: "Enjoy your ride with complete peace of mind with our qualified professional drivers.",
    feat_fleet_title: "Prestige Fleet",
    feat_fleet_desc: "Recent vehicles, perfectly maintained, for absolute comfort and safety.",
    how_it_works: "How it works?",
    step_1_title: "Choose",
    step_1_desc: "Browse our collection and select the ideal vehicle.",
    step_2_title: "Book",
    step_2_desc: "Enter your dates and confirm in a few clicks.",
    step_3_title: "Drive",
    step_3_desc: "Pick up your keys and enjoy the road.",
    stat_clients: "Happy Clients",
    stat_fleet: "Premium Fleet",
    stat_exp: "Years Experience",
    stat_support: "24/7 Support",

    // Filters & Specs
    filter_title: "FILTERS",
    filter_clear: "CLEAR",
    filter_category: "CATEGORY",
    filter_transmission: "TRANSMISSION",
    filter_capacity: "CAPACITY",
    filter_price_max: "MAX PRICE",
    spec_seats: "Capacity",
    spec_fuel: "Engine",
    spec_gearbox: "Gearbox",
    spec_pers: "pers",
    currency_day: "DH / DAY",
    vision_360: "360° Vision",
    compare: "Compare",
    all: "All",

    // Fleet Page
    fleet_title_1: "THE ART OF",
    fleet_title_2: "PERFORMANCE",
    fleet_subtitle: "Discover a collection of exceptional vehicles, combining cutting-edge engineering and timeless design.",
    fleet_count: "vehicles available",
    fleet_sync: "Syncing...",
    fleet_empty_title: "No vehicles found",
    fleet_empty_desc: "Adjust your criteria to discover other vehicles from our collection.",
    fleet_filters: "Filters",
    fleet_apply_filters: "Apply filters",
    fleet_search_brand: "Search brand/model...",
    fleet_sort: "Sort:",
    fleet_clear_filters: "Clear all filters",
    fleet_destination: "Destination",
    fleet_search_btn: "Search",
    fleet_hour: "Time",
    filter_your_vibe: "Your Vibe",
    sort_price_asc: "Price: Low to High",
    sort_price_desc: "Price: High to Low",
    sort_year_desc: "Newest First",
    sort_brand_asc: "Brand (A-Z)",
    load_more: "Load more",

    // Quick View
    qv_rent: "Rent now",
    qv_continue: "Continue searching",
    qv_security: "Security",
    qv_fuel: "Fuel",
    qv_transmission: "Transmission",
    qv_seats: "Seats",

    // Badges & Labels
    badge_special: "SPECIAL OFFER",
    badge_internal: "INTERNAL",
    fleet_tag: "Luxury Fleet 2026",

    // Membership Banner
    member_title: "Privilege Member?",
    member_desc: "Get -15% off the entire Sport collection.",
    member_btn: "Join Now",

    // Categories
    cat_all: "All",
    cat_sedan: "Sedan",
    cat_suv: "SUV",
    cat_sport: "Sport",
    cat_compact: "Compact",
    cat_luxury: "Luxury",
    cat_internal: "Internal",
    cat_collaborator: "Collaborator",
    cat_economy: "Economy",
    cat_utility: "Utility",
    cat_standard: "Standard",
    trans_automatic: "Automatic",
    trans_automatique: "Automatic",
    trans_manual: "Manual",
    trans_manuelle: "Manual",

    // Contact Page
    contact_title: "Contact Us",
    contact_subtitle: "Have a question? Our team is here to help you.",
    contact_name: "Full Name",
    contact_email: "Email Address",
    contact_subject: "Subject",
    contact_message: "Your Message",
    contact_send: "Send Message",
    contact_success: "Message sent successfully!",
    contact_info_title: "Contact Info",
    contact_info_desc: "Find us in our offices or contact us directly.",

    // FAQ Section
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Everything you need to know about prestige rental at Vectoria.",
    faq_q1: "What documents are required to rent a vehicle?",
    faq_a1: "You must present a valid driver's license (held for more than 2 years), an ID (ID card or Passport), and a credit card for the deposit.",
    faq_q2: "Is the deposit amount blocked on my card?",
    faq_a2: "Yes, a pre-authorization is made on your credit card at the time of pick-up. The amount depends on the category of the vehicle chosen.",
    faq_q3: "Is insurance included in the price?",
    faq_a3: "Yes, all our rates include comprehensive insurance with a deductible. You can also subscribe to deductible waiver options for more peace of mind.",
    faq_q4: "Is it possible to deliver the vehicle to the airport?",
    faq_a4: "Absolutely. We offer free delivery and pick-up service at major airports in Morocco (Casablanca, Marrakech, Agadir, etc.).",
    faq_q5: "Can I cancel my reservation?",
    faq_a5: "Yes, cancellation is free up to 48 hours before the start of the rental. After this period, fees may apply depending on the chosen conditions.",

    // About Page
    about_hero_title: "The Art of Prestige Mobility",
    about_hero_subtitle: "Vectoria has been redefining luxury rental standards in Morocco since 2024.",
    about_story_label: "Our Story",
    about_story_title: "A Vision of Excellence",
    about_story_p1: "Born from a passion for exceptional automobiles and personalized service, Vectoria has established itself as the premium rental benchmark.",
    about_mission_title: "Our Mission",
    about_mission_desc: "Offering much more than a simple rental: a memorable experience where every detail matters, from booking to return.",
    about_values_title: "Our Values",
    about_val_1: "Excellence",
    about_val_1_desc: "A permanent quest for perfection in our services.",
    about_val_2: "Trust",
    about_val_2_desc: "Total transparency on our rates and conditions.",
    about_val_3: "Innovation",
    about_val_3_desc: "Technological tools at the service of your comfort.",
    cta_title: "Ready for the road?",
    cta_desc: "Book your dream vehicle in minutes and experience excellence.",

    // Footer
    footer_hours: "Opening Hours",
    footer_hours_open: "Mon - Sat: 9AM - 7PM",
    footer_hours_closed: "Sun: Closed",
    footer_contact: "Contact",
    footer_newsletter: "Newsletter",
    newsletter_title: "Stay Connected with Excellence",
    newsletter_desc: "Get exclusive rental offers and new arrivals directly in your inbox.",
    footer_newsletter_desc: "Exclusive offers and new arrivals.",
    footer_newsletter_thanks: "✓ Thank you for subscribing!",
    footer_rights: "All rights reserved.",
    footer_secure_payment: "Secure payment",

    // Errors
    errors_title: "Error",
    errors_admin: "An error occurred in the administration.",
    errors_dashboard: "An error occurred in your dashboard.",
    errors_generic: "An error occurred.",
    errors_retry: "Retry",
  }
};

interface LanguageContextValue {
  lang: Language;
  switchLang: (newLang: Language) => void;
  t: (key: string) => string;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === "undefined") return "fr";
    const saved = localStorage.getItem("vectoria_lang") as Language;
    if (saved && ["fr", "en"].includes(saved)) return saved;
    const browserLang = navigator.language.split("-")[0];
    if (["fr", "en"].includes(browserLang)) return browserLang as Language;
    return "fr";
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = lang;
    setIsReady(true);
  }, [lang]);

  const switchLang = (newLang: Language) => {
    if (newLang === lang) return;
    
    // Smooth transition logic could be added here (e.g. fade out content)
    setLang(newLang);
    localStorage.setItem("vectoria_lang", newLang);
    document.documentElement.dir = "ltr";
    document.documentElement.lang = newLang;
    
    // Optionally trigger a subtle sound or vibration
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const t = useCallback((key: string) => {
    return translations[lang][key as keyof typeof translations["fr"]] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
}
