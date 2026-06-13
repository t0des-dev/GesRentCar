"use client";

import { motion } from "framer-motion";
import { 
  Car, Calendar, Shield, Star, MapPin, 
  Phone, Mail, Globe as FacebookIcon, Camera as InstagramIcon, MessageCircle, 
  Menu, Search, User, ChevronRight, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StorefrontForm } from "@/types/storefront";

interface StorefrontPreviewProps {
  form: StorefrontForm;
  device: "mobile" | "desktop";
}

export default function StorefrontPreview({ form, device }: StorefrontPreviewProps) {
  const isMobile = device === "mobile";

  return (
    <div className={cn(
      "bg-slate-100 rounded-2xl overflow-hidden border-4 border-slate-200 shadow-sm transition-all duration-500 mx-auto",
      isMobile ? "w-[320px] h-[580px]" : "w-full aspect-video h-full"
    )}>
      <div className="bg-white h-full overflow-y-auto no-scrollbar relative">
        
        {/* Header */}
        <header className={cn(
          "px-5 py-3 flex items-center justify-between z-20 transition-all",
          form.header_config.sticky ? "sticky top-0" : "relative",
          form.header_config.transparent_hero ? "bg-white/80 backdrop-blur-sm border-b border-white/20" : "bg-white border-b border-slate-100"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold italic text-xs">V</div>
            <span className={cn("font-bold tracking-tight text-sm", form.header_config.transparent_hero ? "text-white" : "text-slate-900")}>
              {form.name || "Vectoria"}
            </span>
          </div>
          {isMobile ? (
            <Menu size={18} className={form.header_config.transparent_hero ? "text-white" : "text-slate-900"} />
          ) : (
            <div className="flex items-center gap-5">
              {form.header_config.menu_links.slice(0, 3).map((link: any, i: number) => (
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
          {form.sections_order.map((section: any) => {
            if (!section.active) return null;

            switch (section.id) {
              case "hero":
                return (
                  <section key="hero" className="relative h-[350px] flex flex-col items-center justify-center text-center px-6 overflow-hidden -mt-14">
                    <img 
                      src={form.hero_image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"} 
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Hero"
                    />
                    <div className="absolute inset-0 bg-slate-900/30" />
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative z-10 space-y-3"
                    >
                      <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
                        {form.slogan || "Location de Voitures Premium"}
                      </h1>
                      <p className="text-xs text-white/80 max-w-xs mx-auto">
                        {form.about_text_fr || "Découvrez notre flotte exclusive pour vos voyages d'exception."}
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
                return (
                  <section key="stats" className="py-10 px-5 bg-white grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xl font-bold text-slate-900">{(form.stats_config as any)[`value_${i}`]}</p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{(form.stats_config as any)[`label_${i}`]}</p>
                      </div>
                    ))}
                  </section>
                );

              case "featured":
                return (
                  <section key="featured" className="py-10 px-5 bg-slate-50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Notre Sélection</h3>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1">Voir tout <ChevronRight size={12} /></span>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm">
                          <div className="h-28 bg-slate-100 rounded-xl mb-3 overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">BMW M4 Competition</p>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sport • Automatique</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary text-sm">{form.category_prices.sport} DH</p>
                                <p className="text-xs text-slate-300 font-medium uppercase">Par jour</p>
                              </div>
                          </div>
                        </div>
                    </div>
                  </section>
                );

              case "why_us":
                return (
                  <section key="why_us" className="py-10 px-5 bg-white space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight text-center">Pourquoi nous choisir ?</h3>
                    <div className="grid grid-cols-1 gap-4">
                       <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Shield size={16} /></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Assurance Complète</p>
                            <p className="text-xs text-slate-500">Voyagez l'esprit tranquille avec nos protections premium.</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Calendar size={16} /></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Réservation Flexible</p>
                            <p className="text-xs text-slate-500">Modifiez votre réservation gratuitement jusqu'à 24h.</p>
                          </div>
                       </div>
                    </div>
                  </section>
                );

              case "testimonials":
                return (
                  <section key="testimonials" className="py-10 px-5 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Avis Clients</h3>
                    <div className="space-y-3">
                      {form.testimonials.length > 0 ? (
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

              case "map":
                return (
                  <section key="map" className="py-10 px-5 bg-white">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Nous trouver</h3>
                    <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden">
                       <MapPin size={28} className="text-primary" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary"><MapPin size={14} /></div>
                       <p className="text-xs font-medium text-slate-600">{form.footer_config.address || "Adresse de l'agence non renseignée"}</p>
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Footer */}
        <footer className="bg-slate-50 p-8 space-y-6 border-t border-slate-100">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white font-bold italic text-xs">V</div>
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
