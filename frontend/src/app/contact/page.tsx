"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Clock, CheckCircle2,
  Globe as FacebookIcon, Camera as InstagramIcon, Share2 as TwitterIcon, Globe
} from "lucide-react";
import { useAgency } from "@/hooks/useAgency";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { cn } from "@/shared/utils";

export default function ContactPage() {
  const agency = useAgency();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSent(true);
  };

  const contactInfo = [
    { 
      icon: Phone, 
      label: "Téléphone", 
      value: agency.footer_config?.phone || "+212 600 000 000",
      color: "bg-blue-500/10 text-blue-500"
    },
    { 
      icon: Mail, 
      label: "Email", 
      value: agency.footer_config?.email || "contact@vectoria.com",
      color: "bg-emerald-500/10 text-emerald-500"
    },
    { 
      icon: MapPin, 
      label: "Adresse", 
      value: agency.footer_config?.address || "Casablanca, Maroc",
      color: "bg-rose-500/10 text-rose-500"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1493238507154-203698ad0a1f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Contact Hero"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6">
              {t("contact_title")}
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              {t("contact_subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Form Column */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[48px] p-10 md:p-16 shadow-sm border border-slate-100"
              >
                {sent ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-semibold text-slate-900 mb-4">{t("contact_success")}</h2>
                    <p className="text-slate-500 mb-10">Nous reviendrons vers vous dans les plus brefs délais.</p>
                    <button 
                      onClick={() => setSent(false)}
                      className="text-primary font-semibold uppercase tracking-[0.2em] text-xs border-b-2 border-primary pb-1"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-12">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <MessageSquare size={24} />
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Envoyez-nous un message</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">{t("contact_name")}</label>
                          <input 
                            required
                            type="text" 
                            className="input-premium"
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">{t("contact_email")}</label>
                          <input 
                            required
                            type="email" 
                            className="input-premium"
                            placeholder="jean@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">{t("contact_subject")}</label>
                        <input 
                          required
                          type="text" 
                          className="input-premium"
                          placeholder="Demande d'information"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">{t("contact_message")}</label>
                        <textarea 
                          required
                          rows={6}
                          className="input-premium resize-none"
                          placeholder="Comment pouvons-nous vous aider ?"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            {t("contact_send")}
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-5 space-y-12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-3xl font-semibold text-slate-900 tracking-tight mb-4">{t("contact_info_title")}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{t("contact_info_desc")}</p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", info.color)}>
                        <info.icon size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">{info.label}</p>
                        <p className="text-lg font-semibold text-slate-900">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 rounded-[40px] p-10 text-white">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <Clock className="text-primary" size={24} />
                      <h4 className="text-xl font-semibold uppercase tracking-tighter">Horaires d'Ouverture</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Lundi - Vendredi</span>
                        <span className="font-bold">08:00 - 20:00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Samedi</span>
                        <span className="font-bold">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Dimanche</span>
                        <span className="text-primary font-bold">24/7 (Urgence)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mr-2">Suivez-nous</p>
                  {[InstagramIcon, FacebookIcon, TwitterIcon, Globe].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Mock */}
      <section className="container mx-auto px-6 pb-24">
         <div className="h-[500px] bg-slate-200 rounded-[64px] border-8 border-white shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                     <MapPin size={40} className="text-primary" />
                  </div>
                  <h4 className="text-2xl font-semibold text-slate-400 uppercase tracking-tighter">Interactive Map Placeholder</h4>
               </div>
            </div>
            <div className="absolute bottom-10 left-10 bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-sm max-w-xs">
               <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">Siège Social</p>
               <p className="font-semibold text-slate-900 mb-2">{agency.agency_name}</p>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">{agency.footer_config?.address || "Sidi Maârouf, Casablanca, Maroc"}</p>
            </div>
         </div>
      </section>
    </main>
  );
}
