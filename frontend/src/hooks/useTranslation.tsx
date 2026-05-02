"use client";

import { useState, createContext, useContext, useEffect, useCallback } from "react";

type Language = "fr" | "ar" | "en";

const translations = {
  fr: {
    nav_fleet: "Notre Flotte",
    nav_locations: "Agences",
    nav_offers: "Offres",
    nav_about: "À Propos",
    nav_login: "Connexion",
    nav_dashboard: "Compte VIP",
    nav_logout: "Déconnexion",
    nav_book: "Réserver",
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
    fleet_count: "CHEFS-D'ŒUVRE DISPONIBLES",
    fleet_empty_title: "AUCUN SYMBOLE TROUVÉ",
    fleet_empty_desc: "Ajustez vos critères pour découvrir d'autres chefs-d'œuvre de notre collection.",
    
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
    trans_automatic: "Automatique",
    trans_manual: "Manuelle",
  },
  en: {
    nav_fleet: "Our Fleet",
    nav_locations: "Locations",
    nav_offers: "Special Offers",
    nav_about: "About Us",
    nav_login: "Sign In",
    nav_dashboard: "Account",
    nav_logout: "Logout",
    nav_book: "Book Now",
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
    fleet_count: "MASTERPIECES AVAILABLE",
    fleet_empty_title: "NO SYMBOL FOUND",
    fleet_empty_desc: "Adjust your criteria to discover other masterpieces from our collection.",

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
    trans_automatic: "Automatic",
    trans_manual: "Manual",
  },
  ar: {
    nav_fleet: "أسطولنا",
    nav_locations: "وكالاتنا",
    nav_offers: "عروض خاصة",
    nav_about: "معلومات عنا",
    nav_login: "تسجيل الدخول",
    nav_dashboard: "حسابي",
    nav_logout: "تسجيل الخروج",
    nav_book: "احجز الآن",
    hero_title: "تميز التأجير مع",
    hero_subtitle: "اكتشف أسطولاً من السيارات الفاخرة، بأسعار شفافة وخدمة عملاء متاحة على مدار الساعة.",
    btn_catalog: "عرض الكتالوج",
    btn_agency: "وكالتنا",
    search_placeholder: "ابحث عن سيارة...",
    featured_vehicles: "سيارات مختارة",
    why_us: "لماذا تختار",
    quick_booking: "حجز سريع",
    safety: "أمان تام",
    assistance: "دعم 24/7",
    rent_now: "احجز الآن",
    price_per_day: "في اليوم",
    start_date: "تاريخ البدء",
    end_date: "تاريخ الانتهاء",
    confirm_booking: "تأكيد الحجز",
    success_booking: "تم الحجز بنجاح!",
    available: "متوفر",
    maintenance: "في الصيانة",
    rented: "مؤجر",
    features_title: "التجربة الفاخرة",
    features_subtitle: "اكتشف لماذا يختارنا عملاؤنا لرحلاتهم المهنية والشخصية.",
    feat_support_title: "دعم 24/7",
    feat_support_desc: "فريق مخصص في خدمتك في أي وقت وأي مكان في المغرب.",
    feat_chauffeur_title: "خدمة سائق VIP",
    feat_chauffeur_desc: "استمتع برحلتك براحة البال مع سائقينا المحترفين المؤهلين.",
    feat_fleet_title: "أسطول فاخر",
    feat_fleet_desc: "سيارات حديثة، مصانة بشكل مثالي، لراحة وأمان مطلقين.",
    how_it_works: "كيف يعمل؟",
    step_1_title: "اختر",
    step_1_desc: "تصفح مجموعتنا واختر السيارة المثالية.",
    step_2_title: "احجز",
    step_2_desc: "أدخل التواريخ الخاصة بك وقم بالتأكيد ببضع نقرات.",
    step_3_title: "انطلق",
    step_3_desc: "استلم مفاتيحك واستمتع بالطريق.",
    stat_clients: "عملاء راضون",
    stat_fleet: "أسطول فاخر",
    stat_exp: "سنوات الخبرة",
    stat_support: "دعم متاح",

    // Filters & Specs
    filter_title: "الفلاتر",
    filter_clear: "مسح",
    filter_category: "الفئة",
    filter_transmission: "ناقل الحركة",
    filter_capacity: "السعة",
    filter_price_max: "أقصى سعر",
    spec_seats: "السعة",
    spec_fuel: "المحرك",
    spec_gearbox: "الناقل",
    spec_pers: "أشخاص",
    currency_day: "درهم / يوم",
    vision_360: "رؤية 360°",
    compare: "مقارنة",
    all: "الكل",

    // Fleet Page
    fleet_title_1: "فن",
    fleet_title_2: "الأداء",
    fleet_subtitle: "اكتشف مجموعة من السيارات الاستثنائية، التي تجمع بين الهندسة المتطورة والتصميم الخالد.",
    fleet_count: "تحفة فنية متاحة",
    fleet_empty_title: "لم يتم العثور على أي رمز",
    fleet_empty_desc: "اضبط معاييرك لاكتشاف روائع أخرى من مجموعتنا.",

    // Quick View
    qv_rent: "احجز الآن",
    qv_continue: "متابعة البحث",
    qv_security: "الأمان",
    qv_fuel: "الوقود",
    qv_transmission: "ناقل الحركة",
    qv_seats: "المقاعد",

    // Badges & Labels
    badge_special: "عرض خاص",
    badge_internal: "داخلي",
    fleet_tag: "أسطول فاخر 2026",

    // Membership Banner
    member_title: "عضو متميز؟",
    member_desc: "استفد من خصم 15% على مجموعة السيارات الرياضية.",
    member_btn: "انضم الآن",

    // Categories
    cat_all: "الكل",
    cat_sedan: "سيدان",
    cat_suv: "دفع رباعي",
    cat_sport: "رياضية",
    cat_compact: "مدمجة",
    cat_luxury: "فاخرة",
    trans_automatic: "أوتوماتيك",
    trans_manual: "يدوي",
  }
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detect language
    const saved = localStorage.getItem("vectoria_lang") as Language;
    if (saved) {
      setLang(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    } else {
      // Browser detection
      const browserLang = navigator.language.split("-")[0];
      if (["fr", "en", "ar"].includes(browserLang)) {
        const bl = browserLang as Language;
        setLang(bl);
        document.documentElement.dir = bl === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = bl;
      }
    }
    setIsReady(true);
  }, []);

  const switchLang = (newLang: Language) => {
    if (newLang === lang) return;
    
    // Smooth transition logic could be added here (e.g. fade out content)
    setLang(newLang);
    localStorage.setItem("vectoria_lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
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
      <div className={isReady ? "opacity-100 transition-opacity duration-500" : "opacity-0"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
}
