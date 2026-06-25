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
    cat_internal: "Interne",
    trans_automatic: "Automatique",
    trans_manual: "Manuelle",

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
    cat_internal: "Internal",
    trans_automatic: "Automatic",
    trans_manual: "Manual",

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
    nav_contact: "اتصل بنا",
    footer_cookies: "إعدادات الكوكيز",
    footer_privacy: "سياسة الخصوصية",
    footer_accessibility: "سهولة الوصول",
    footer_dsa: "قانون الخدمات الرقمية",
    footer_terms: "الشروط العامة",
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
    cat_internal: "داخلي",
    trans_automatic: "أوتوماتيك",
    trans_manual: "يدوي",

    // Contact Page
    contact_title: "اتصل بنا",
    contact_subtitle: "هل لديك سؤال؟ فريقنا هنا لمساعدتك.",
    contact_name: "الاسم الكامل",
    contact_email: "البريد الإلكتروني",
    contact_subject: "الموضوع",
    contact_message: "رسالتك",
    contact_send: "إرسال الرسالة",
    contact_success: "تم إرسال الرسالة بنجاح!",
    contact_info_title: "معلومات الاتصال",
    contact_info_desc: "تفضل بزيارتنا في وكالاتنا أو اتصل بنا مباشرة.",

    // FAQ Section
    faq_title: "الأسئلة الشائعة",
    faq_subtitle: "كل ما تحتاج لمعرفته حول الإيجار الفاخر في فيكتوريا.",
    faq_q1: "ما هي الوثائق المطلوبة لاستئجار سيارة؟",
    faq_a1: "يجب تقديم رخصة قيادة صالحة (لأكثر من سنتين)، وبطاقة هوية (بطاقة تعريف أو جواز سفر)، وبطاقة ائتمان للضمان.",
    faq_q2: "هل يتم حجز مبلغ الضمان على بطاقتي؟",
    faq_a2: "نعم، يتم إجراء تفويض مسبق على بطاقتك البنكية وقت استلام السيارة. يعتمد المبلغ على فئة السيارة المختارة.",
    faq_q3: "هل التأمين مشمول في السعر؟",
    faq_a3: "نعم، جميع أسعارنا تشمل تأميناً شاملاً مع إعفاء. يمكنك أيضاً الاشتراك في خيارات شراء الإعفاء لمزيد من راحة البال.",
    faq_q4: "هل من الممكن تسليم السيارة في المطار؟",
    faq_a4: "بالتأكيد. نحن نقدم خدمة توصيل واستلام مجانية في المطارات الرئيسية في المغرب (الدار البيضاء، مراكش، أكادير، إلخ).",
    faq_q5: "هل يمكنني إلغاء حجزي؟",
    faq_a5: "نعم، الإلغاء مجاني حتى 48 ساعة قبل بدء الإيجار. بعد هذه الفترة، قد يتم تطبيق رسوم وفقاً للشروط المختارة.",

    // About Page
    about_hero_title: "فن التنقل الفاخر",
    about_hero_subtitle: "فيكتوريا تعيد تعريف معايير التأجير الفاخر في المغرب منذ عام 2024.",
    about_story_label: "قصتنا",
    about_story_title: "رؤية للتميز",
    about_story_p1: "ولدت فيكتوريا من شغف بالسيارات الاستثنائية والخدمة الشخصية، وأثبتت نفسها كمرجع للتأجير المتميز.",
    about_mission_title: "مهمتنا",
    about_mission_desc: "تقديم أكثر من مجرد إيجار بسيط: تجربة لا تُنسى حيث كل تفصيل مهم، من الحجز إلى الإرجاع.",
    about_values_title: "قيمنا",
    about_val_1: "التميز",
    about_val_1_desc: "سعي دائم للكمال في خدماتنا.",
    about_val_2: "الثقة",
    about_val_2_desc: "شفافية تامة في أسعارنا وشروطنا.",
    about_val_3: "الابتكار",
    about_val_3_desc: "أدوات تكنولوجية في خدمة راحتكم.",
    cta_title: "هل أنت جاهز للانطلاق؟",
    cta_desc: "احجز سيارة أحلامك في دقائق واستمتع بالتميز المطلق.",
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
    if (saved && ["fr", "en", "ar"].includes(saved)) return saved;
    const browserLang = navigator.language.split("-")[0];
    if (["fr", "en", "ar"].includes(browserLang)) return browserLang as Language;
    return "fr";
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
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
