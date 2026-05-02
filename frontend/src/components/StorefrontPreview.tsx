"use client";

import { motion } from "framer-motion";
import { 
  Car, Calendar, Shield, Star, MapPin, 
  Phone, Mail, Globe as FacebookIcon, Camera as InstagramIcon, MessageCircle, 
  Menu, Search, User, ChevronRight, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StorefrontPreviewProps {
  form: any;
  device: "mobile" | "desktop";
}

export default function StorefrontPreview({ form, device }: StorefrontPreviewProps) {
  const isMobile = device === "mobile";

  return (
    <div className={cn(
      "bg-slate-100 rounded-[32px] overflow-hidden border-8 border-slate-900 shadow-2xl transition-all duration-500 mx-auto",
      isMobile ? "w-[320px] h-[580px]" : "w-full aspect-video h-full"
    )}>
      <div className="bg-white h-full overflow-y-auto no-scrollbar relative">
        
        {/* Header */}
        <header className={cn(
          "px-6 py-4 flex items-center justify-between z-20 transition-all",
          form.header_config.sticky ? "sticky top-0" : "relative",
          form.header_config.transparent_hero ? "bg-white/10 backdrop-blur-md border-b border-white/10" : "bg-white border-b border-slate-100"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black italic text-sm">V</div>
            <span className={cn("font-black tracking-tighter text-sm", form.header_config.transparent_hero ? "text-white" : "text-slate-900")}>
              {form.name || "Vectoria"}
            </span>
          </div>
          {isMobile ? (
            <Menu size={18} className={form.header_config.transparent_hero ? "text-white" : "text-slate-900"} />
          ) : (
            <div className="flex items-center gap-6">
              {form.header_config.menu_links.slice(0, 3).map((link: any, i: number) => (
                <span key={i} className={cn("text-[10px] font-black uppercase tracking-widest", form.header_config.transparent_hero ? "text-white" : "text-slate-500")}>
                  {link.label}
                </span>
              ))}
              <button className="bg-primary text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">Réserver</button>
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
                  <section key="hero" className="relative h-[400px] flex flex-col items-center justify-center text-center px-8 overflow-hidden -mt-16">
                    <img 
                      src={form.hero_image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"} 
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px]"
                      alt="Hero"
                    />
                    <div className="absolute inset-0 bg-slate-900/40" />
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative z-10 space-y-4"
                    >
                      <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
                        {form.slogan || "Location de Voitures Premium"}
                      </h1>
                      <p className="text-[10px] text-white/80 font-medium max-w-xs mx-auto">
                        {form.about_text_fr || "Découvrez notre flotte exclusive pour vos voyages d'exception."}
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-4">
                        <button 
                          style={{ backgroundColor: form.primary_color, borderRadius: form.theme_config.border_radius }}
                          className="px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest shadow-xl"
                        >
                          Explorer la flotte
                        </button>
                      </div>
                    </motion.div>
                  </section>
                );

              case "stats":
                return (
                  <section key="stats" className="py-12 px-6 bg-white grid grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="text-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-xl font-black text-slate-900">{(form.stats_config as any)[`value_${i}`]}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{(form.stats_config as any)[`label_${i}`]}</p>
                      </div>
                    ))}
                  </section>
                );

              case "featured":
                return (
                  <section key="featured" className="py-12 px-6 bg-slate-50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Notre Sélection</h3>
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary flex items-center gap-1">Voir tout <ChevronRight size={10} /></span>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white rounded-[24px] p-4 border border-slate-200/60 shadow-sm">
                          <div className="h-32 bg-slate-100 rounded-xl mb-4 overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex justify-between items-center">
                              <div>
                                <p className="font-black text-slate-900 text-sm">BMW M4 Competition</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sport • Automatique</p>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-primary text-sm">{form.category_prices.sport} DH</p>
                                <p className="text-[8px] text-slate-300 font-bold uppercase">Par jour</p>
                              </div>
                          </div>
                        </div>
                    </div>
                  </section>
                );

              case "why_us":
                return (
                  <section key="why_us" className="py-12 px-6 bg-white space-y-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight text-center">Pourquoi nous choisir ?</h3>
                    <div className="grid grid-cols-1 gap-4">
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Shield size={18} /></div>
                          <div>
                            <p className="text-sm font-black text-slate-900">Assurance Complète</p>
                            <p className="text-[10px] text-slate-500">Voyagez l'esprit tranquille avec nos protections premium.</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Calendar size={18} /></div>
                          <div>
                            <p className="text-sm font-black text-slate-900">Réservation Flexible</p>
                            <p className="text-[10px] text-slate-500">Modifiez votre réservation gratuitement jusqu'à 24h.</p>
                          </div>
                       </div>
                    </div>
                  </section>
                );

              case "testimonials":
                return (
                  <section key="testimonials" className="py-12 px-6 bg-slate-900 text-white overflow-hidden">
                    <h3 className="text-xl font-black tracking-tight mb-8">Avis Clients</h3>
                    <div className="space-y-4">
                      {form.testimonials.length > 0 ? (
                        form.testimonials.slice(0, 2).map((t: any, i: number) => (
                          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
                            <div className="flex items-center gap-1 text-amber-400 mb-3">
                              {[...Array(t.rating)].map((_, j) => <Star key={j} size={10} className="fill-amber-400" />)}
                            </div>
                            <p className="text-[11px] font-medium italic mb-4">"{t.content}"</p>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">
                                {t.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-[10px] font-black">{t.name}</p>
                                <p className="text-[8px] text-white/40 uppercase tracking-widest">{t.role}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-white/40 italic">Aucun témoignage disponible.</p>
                      )}
                    </div>
                  </section>
                );

              case "map":
                return (
                  <section key="map" className="py-12 px-6 bg-slate-50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Nous trouver</h3>
                    <div className="aspect-square bg-slate-200 rounded-[40px] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                       <MapPin size={32} className="text-primary animate-bounce" />
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary"><MapPin size={18} /></div>
                       <p className="text-[10px] font-bold text-slate-600">{form.footer_config.address || "Adresse de l'agence non renseignée"}</p>
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-white p-10 space-y-8">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white font-black italic text-xs">V</div>
                <span className="font-black tracking-tighter text-sm">{form.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                {form.about_text_fr?.slice(0, 80)}...
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[9px] text-slate-400">
                    <Phone size={10} /> {form.footer_config.phone}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-slate-400">
                    <Mail size={10} /> {form.footer_config.email}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Social</h4>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center"><FacebookIcon size={12} /></div>
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center"><InstagramIcon size={12} /></div>
                </div>
              </div>
           </div>
           
           <div className="pt-8 text-center border-t border-white/5">
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">© 2026 {form.name}. Realisé avec Vectoria.</p>
           </div>
        </footer>

      </div>
    </div>
  );
}
