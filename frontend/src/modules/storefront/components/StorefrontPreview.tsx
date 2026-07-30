"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getImageUrl } from "@/shared/utils/image";
import { 
  Shield, Star, MapPin, 
  Phone, Mail, Globe as FacebookIcon, Camera as InstagramIcon, 
  Menu, ChevronRight
} from "lucide-react";
import { cn } from "@/shared/utils";
import type { StorefrontForm } from "@/types/storefront";

interface StorefrontPreviewProps {
  form: StorefrontForm;
  device: "mobile" | "desktop";
  previewSectionId?: string | null;
}

export default function StorefrontPreview({ form, device, previewSectionId }: StorefrontPreviewProps) {
  const isMobile = device === "mobile";

  useEffect(() => {
    if (!previewSectionId) return;
    const el = document.getElementById(`preview-section-${previewSectionId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [previewSectionId]);

  return (
    <div className={cn(
      "bg-slate-100 rounded-2xl overflow-hidden border-4 border-slate-200 shadow-sm transition-all duration-500 mx-auto",
      isMobile ? "w-[320px] h-[580px]" : "w-full aspect-video h-full"
    )}>
      <div className="bg-white h-full overflow-y-auto no-scrollbar relative" style={{ fontFamily: form.theme_config?.font_family || 'Inter' }}>
        
        {/* Header */}
        <header className={cn(
          "px-5 py-3 flex items-center justify-between z-20 transition-all",
          form.header_config.sticky ? "sticky top-0" : "relative",
          form.header_config.transparent_hero ? "bg-white/80 backdrop-blur-sm border-b border-white/20" : "bg-white border-b border-slate-100"
        )}>
          <div className="flex items-center gap-2">
            {form.logo_url ? (
              <Image src={form.logo_url} width={28} height={28} className="h-7 w-7 object-contain" alt="Logo" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold italic text-xs">V</div>
            )}
            <span className={cn("font-bold tracking-tight text-sm", form.header_config.transparent_hero ? "text-white" : "text-slate-900")}>
              {form.name || "Vectoria"}
            </span>
          </div>
          {isMobile ? (
            <Menu size={18} className={form.header_config.transparent_hero ? "text-white" : "text-slate-900"} />
          ) : (
            <div className="flex items-center gap-5">
              {(form.header_config.menu_links ?? []).slice(0, 3).map((link: any, i: number) => (
                <span key={i} className={cn("text-xs font-semibold uppercase tracking-wider", form.header_config.transparent_hero ? "text-white" : "text-slate-500")}>
                  {link.label}
                </span>
              ))}
              <button className="bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">Réserver</button>
            </div>
          )}
        </header>

        {/* Dynamic Sections Based on Order */}
        <div className="flex flex-col">
          {(form.sections_order ?? []).map((section: any) => {
            if (!section.active) return null;

            switch (section.id) {
              case "hero":
                return (
                  <section id="preview-section-hero" key="hero" className="relative h-[350px] flex flex-col items-center justify-center text-center px-6 overflow-hidden -mt-14">
                    <Image 
                      src={getImageUrl(form.hero_image_url) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"} 
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Hero"
                      width={1000}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-slate-900/30" />
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative z-10 space-y-3"
                    >
                      <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
                        {form.sections_content?.hero?.title || form.slogan || "Location de Voitures Premium"}
                      </h1>
                      <p className="text-xs text-white/80 max-w-xs mx-auto">
                        {form.sections_content?.hero?.subtitle || form.about_text_fr || "Découvrez notre flotte exclusive pour vos voyages d'exception."}
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-3">
                        <button 
                          style={{ backgroundColor: form.primary_color, borderRadius: form.theme_config.border_radius }}
                          className="px-5 py-2.5 text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
                        >
                          Explorer la flotte
                        </button>
                      </div>
                    </motion.div>
                  </section>
                );

              case "stats":
                const items = form.stats_config?.items || [];
                const STATS_ICON_MAP: Record<string, React.ReactNode> = {
                  HeadphonesIcon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
                  Car: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5a2 2 0 0 1-2-2V9l2.5-5h13L21 9v6a2 2 0 0 1-2 2z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>,
                  Shield: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                  CreditCard: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                  Zap: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                  Star: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                };
                const fallbackIcon = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
                const defaultStatItems = [
                  { icon: "HeadphonesIcon", label: "24/7 Assistance" },
                  { icon: "Car", label: "Airport Delivery" },
                  { icon: "Star", label: "Unlimited Mileage" },
                  { icon: "Shield", label: "Insurance Included" },
                  { icon: "CreditCard", label: "Transparent Pricing" },
                  { icon: "Zap", label: "Fast Booking" },
                ];
                const displayItems = items.length > 0 ? items : defaultStatItems;
                return (
                  <section id="preview-section-stats" key="stats" className="py-5 px-4 bg-white border-t border-b border-slate-100">
                    <div className="flex items-center justify-around">
                      {displayItems.slice(0, 6).map((s: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 px-1">
                          <div className="text-slate-400">
                            {STATS_ICON_MAP[s.icon] || fallbackIcon}
                          </div>
                          <span className="text-[9px] font-medium text-slate-500 text-center leading-tight whitespace-nowrap">
                            {s.label || s.value || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "featured": {
                const fleetEyebrow = form.sections_content?.featured_vehicles?.eyebrow || "THE FLEET";
                const fleetTitle = (form.sections_content?.featured_vehicles as any)?.title || "A modern fleet, built for every kind of journey.";
                const fleetSubtitle = (form.sections_content?.featured_vehicles as any)?.subtitle || "Compare specifications at a glance and reserve the right vehicle in seconds — every car is inspected, insured, and ready.";
                const fleetCategories = ["All Vehicles", "Economy", "Compact", "SUV", "Luxury", "Utility"];
                const fleetVehicles = [
                  { badge: "POPULAR", badgeColor: "bg-amber-500", category: "ECONOMY", name: "Clio Class or similar", seats: 5, trans: "Manual", fuel: "Petrol", bags: 2, price: form.category_prices?.eco || 350, img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400" },
                  { badge: null, badgeColor: "", category: "COMPACT", name: "Elantra Class or similar", seats: 5, trans: "Automatic", fuel: "Petrol", bags: 3, price: form.category_prices?.standard || 420, img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=400" },
                  { badge: "NEW", badgeColor: "bg-emerald-500", category: "SUV", name: "Tucson Class or similar", seats: 5, trans: "Automatic", fuel: "Diesel", bags: 3, price: form.category_prices?.suv || 680, img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=400" },
                  { badge: "LUXURY", badgeColor: "bg-slate-800", category: "LUXURY", name: "7-Series Class or similar", seats: 5, trans: "Automatic", fuel: "Petrol", bags: 3, price: form.category_prices?.luxury || 1450, img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400" },
                ];
                return (
                  <section id="preview-section-featured" key="featured" className="py-8 px-4 bg-[#f7f6f3]">
                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="block w-4 h-[1.5px] bg-amber-500"></span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-600">{fleetEyebrow}</span>
                      </div>
                      <h3 className="text-[15px] font-extrabold text-slate-900 leading-tight mb-1.5">{fleetTitle}</h3>
                      <p className="text-[9px] text-slate-500 leading-relaxed">{fleetSubtitle}</p>
                    </div>
                    {/* Category pills */}
                    <div className="flex gap-1.5 flex-wrap mb-4 overflow-x-auto pb-1">
                      {fleetCategories.map((cat, i) => (
                        <span key={cat} className={`px-2.5 py-1 rounded-full text-[8px] font-semibold whitespace-nowrap cursor-pointer transition-all ${i === 0 ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"}`}>{cat}</span>
                      ))}
                    </div>
                    {/* Vehicle grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {fleetVehicles.map((v, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-slate-200/70 shadow-sm overflow-hidden">
                          {/* Image + badge */}
                          <div className="relative h-20 bg-slate-100 overflow-hidden">
                            <Image src={v.img} alt={v.name} width={300} height={160} className="w-full h-full object-cover" />
                            {v.badge && (
                              <span className={`absolute top-1.5 left-1.5 ${v.badgeColor} text-white text-[7px] font-bold px-1.5 py-0.5 rounded`}>{v.badge}</span>
                            )}
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center shadow">
                              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            </div>
                          </div>
                          {/* Card body */}
                          <div className="p-2">
                            <span className="text-[7px] font-bold uppercase tracking-wider text-amber-600">{v.category}</span>
                            <p className="text-[9px] font-bold text-slate-900 leading-tight mb-1.5">{v.name}</p>
                            {/* Specs row */}
                            <div className="flex items-center gap-1.5 mb-2">
                              {[
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, val: `${v.seats}` },
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, val: v.trans.slice(0,4) },
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V8l9-6 9 6v14"/></svg>, val: v.fuel.slice(0,3) },
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="16 3 12 7 8 3"/></svg>, val: `${v.bags}` },
                              ].map((spec, si) => (
                                <div key={si} className="flex flex-col items-center gap-0.5">
                                  <span className="text-slate-400">{spec.icon}</span>
                                  <span className="text-[6px] text-slate-400">{spec.val}</span>
                                </div>
                              ))}
                            </div>
                            {/* Price + Reserve */}
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[11px] font-extrabold text-slate-900">{v.price}</span>
                                <span className="text-[7px] text-slate-400 font-medium"> MAD</span>
                                <span className="text-[6px] text-slate-400"> /day</span>
                              </div>
                              <button className="bg-slate-900 text-white text-[7px] font-bold px-2 py-1 rounded-md hover:bg-slate-700 transition-colors">Reserve</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* View full fleet CTA */}
                    <div className="flex justify-center mt-4">
                      <button className="px-5 py-2 rounded-full border border-slate-300 text-[9px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">View full fleet</button>
                    </div>
                  </section>
                );
              }

              case "why_us":
                const features = form.sections_content?.why_us?.features?.length ? form.sections_content.why_us.features : [
                  { title: "Assurance Complète", desc: "Voyagez l'esprit tranquille avec nos protections premium." },
                  { title: "Réservation Flexible", desc: "Modifiez votre réservation gratuitement jusqu'à 24h." }
                ];
                return (
                  <section id="preview-section-why_us" key="why_us" className="py-10 px-5 bg-white space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight text-center">{form.sections_content?.why_us?.title || "Pourquoi nous choisir ?"}</h3>
                    <div className="grid grid-cols-1 gap-4">
                       {features.map((f: any, idx: number) => (
                         <div key={idx} className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                               {f.image ? (
                                   <Image src={f.image} alt={f.title} width={36} height={36} className="w-full h-full object-cover" />
                               ) : (
                                  <Shield size={16} />
                               )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                              <p className="text-xs text-slate-500">{f.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </section>
                );

              case "testimonials":
                return (
                  <section id="preview-section-testimonials" key="testimonials" className="py-10 px-5 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">{form.sections_content?.testimonials?.heading || "Avis Clients"}</h3>
                    <div className="space-y-3">
                      {(form.testimonials ?? []).length > 0 ? (
                        form.testimonials.slice(0, 2).map((t: any, i: number) => (
                          <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-1 text-amber-400 mb-2">
                              {[...Array(t.rating)].map((_, j) => <Star key={j} size={12} className="fill-amber-400" />)}
                            </div>
                            <p className="text-sm font-medium italic mb-3">"{t.content}"</p>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                {t.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-900">{t.name}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">{t.role}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic">Aucun témoignage disponible.</p>
                      )}
                    </div>
                  </section>
                );



              case "vibe_selector": {
                const vibeData = form.sections_content?.vibe;
                const vibeEyebrow = (vibeData as any)?.eyebrow || "LUXURY COLLECTION";
                const vibeTitle = (vibeData as any)?.title || "For the moments that call for more.";
                const vibeSubtitle = (vibeData as any)?.subtitle || "Flagship sedans and SUVs, reserved for clients who expect the best.";
                const vibeItems = (vibeData as any)?.items?.length ? (vibeData as any).items : [
                  { brand: "BMW", title: "7 Series", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400" },
                  { brand: "MERCEDES", title: "S-Class", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=400" },
                  { brand: "RANGE ROVER", title: "Vogue", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=400" },
                  { brand: "AUDI", title: "A8", img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=400" },
                ];
                return (
                  <section id="preview-section-vibe_selector" key="vibe_selector" className="py-10 px-5 bg-[#0f1e3c]">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <span className="block w-px h-5 bg-white/20 mb-3"></span>
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">{vibeEyebrow}</span>
                      <h3 className="text-[16px] font-extrabold text-white leading-snug max-w-[220px] mb-2">{vibeTitle}</h3>
                      <p className="text-[8.5px] text-white/40 leading-relaxed max-w-[200px]">{vibeSubtitle}</p>
                    </div>
                    {/* Cards row */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {vibeItems.slice(0, 4).map((v: any, idx: number) => (
                        <div key={idx} className="relative flex-shrink-0 w-[80px] h-[90px] rounded-xl overflow-hidden bg-[#1a2a4a] border border-white/5 cursor-pointer group">
                          <Image
                            src={v.img || v.image}
                            alt={v.title}
                            width={160}
                            height={180}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                          />
                          {/* Dark gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3c]/90 via-transparent to-transparent"></div>
                          {/* Labels */}
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-[5.5px] font-bold uppercase tracking-widest text-white/50 leading-none mb-0.5">
                              {v.brand || v.subtitle || ""}
                            </p>
                            <p className="text-[8px] font-bold text-white leading-tight flex items-center gap-0.5">
                              {v.title} <span className="text-white/50 text-[7px]">›</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              default:
                return null;
            }
          })}
        </div>

        {/* Footer */}
        <footer className="bg-slate-50 p-8 space-y-6 border-t border-slate-100">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                {form.logo_url ? (
                  <Image src={form.logo_url} width={24} height={24} className="h-6 w-6 object-contain" alt="Logo" />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white font-bold italic text-xs">V</div>
                )}
                <span className="font-bold tracking-tight text-sm text-slate-900">{form.name}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {form.about_text_fr?.slice(0, 80)}...
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Contact</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={12} /> {form.footer_config.phone ?? "—"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={12} /> {form.footer_config.email ?? "—"}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Social</h4>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-200/60 flex items-center justify-center"><FacebookIcon size={12} className="text-slate-500" /></div>
                  <div className="w-7 h-7 rounded-lg bg-slate-200/60 flex items-center justify-center"><InstagramIcon size={12} className="text-slate-500" /></div>
                </div>
              </div>
           </div>
           
           <div className="pt-4 text-center border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium">© 2026 {form.name}. Realisé avec Vectoria.</p>
           </div>
        </footer>

      </div>
    </div>
  );
}
