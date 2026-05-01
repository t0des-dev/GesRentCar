"use client";

import { useState, createContext, useContext, useEffect } from "react";

type Language = "fr" | "ar" | "en";

const translations = {
  fr: {
    nav_fleet: "Notre Flotte",
    nav_locations: "Agences",
    nav_offers: "Offres",
    nav_about: "À Propos",
    nav_login: "Connexion",
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
  },
  en: {
    nav_fleet: "Our Fleet",
    nav_locations: "Locations",
    nav_offers: "Special Offers",
    nav_about: "About Us",
    nav_login: "Sign In",
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
  },
  ar: {
    nav_fleet: "أسطولنا",
    nav_locations: "وكالاتنا",
    nav_offers: "عروض خاصة",
    nav_about: "معلومات عنا",
    nav_login: "تسجيل الدخول",
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

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations["fr"]] || key;
  };

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
