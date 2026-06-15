"use client";

import { motion } from "framer-motion";
import { Award, Shield, Heart, Users, Sparkles, Crown, Zap, Globe } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import { cn } from "@/shared/utils";

export default function AboutPage() {
  const { t } = useTranslation();
  const agency = useAgency();

  const values = [
    { icon: Crown, title: t("about_val_1"), desc: t("about_val_1_desc"), color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: Shield, title: t("about_val_2"), desc: t("about_val_2_desc"), color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Zap, title: t("about_val_3"), desc: t("about_val_3_desc"), color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] flex items-center overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-50" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full mb-8">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">L'Excellence Vectoria</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter mb-8 leading-[0.9]">
              {t("about_hero_title")}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">
              {t("about_hero_subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STORY SECTION ────────────────────────────────────────────────── */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[60px] overflow-hidden shadow-sm border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200" 
                  alt="Prestige Fleet"
                  className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Stat Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-10 -right-10 bg-primary text-white p-10 rounded-[40px] shadow-sm z-20 hidden md:block"
              >
                <p className="text-5xl font-semibold mb-1">5.0</p>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Sparkles key={i} size={12} className="fill-white" />)}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">Note Client Moyenne</p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <p className="text-primary font-semibold text-xs uppercase tracking-[0.3em] mb-4">{t("about_story_label")}</p>
                <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tighter mb-8">
                  {t("about_story_title")}
                </h2>
                <div className="space-y-6 text-lg text-slate-500 font-medium leading-relaxed">
                  <p>{t("about_story_p1")}</p>
                  <p>
                    {agency.about_text_fr || "Nous croyons que chaque trajet mérite d'être extraordinaire. C'est pourquoi nous sélectionnons rigoureusement chaque véhicule de notre flotte pour garantir des performances optimales et un luxe sans compromis."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 group hover:border-primary/20 transition-all">
                  <h3 className="text-3xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">24/7</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("stat_support")}</p>
                </div>
                <div className="p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 group hover:border-primary/20 transition-all">
                  <h3 className="text-3xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">100%</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Satisfaction</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES SECTION ───────────────────────────────────────────────── */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6">{t("about_values_title")}</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[48px] hover:bg-white/10 transition-all group"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", val.bg, val.color)}>
                  <val.icon size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">{val.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION SECTION ──────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[64px] p-12 md:p-24 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
            <div className="flex-1">
              <h2 className="text-4xl md:text-6xl font-semibold text-slate-900 tracking-tighter mb-8">
                {t("about_mission_title")}
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
                {t("about_mission_desc")}
              </p>
              <div className="flex flex-wrap gap-4">
                {["Luxe", "Sûreté", "Prestige", "Innovation"].map(tag => (
                  <span key={tag} className="px-6 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-[0.2em]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[450px] aspect-square bg-slate-50 rounded-[48px] flex items-center justify-center relative group">
              <Crown size={120} className="text-primary/20 group-hover:text-primary/40 transition-colors duration-500" />
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl text-center">
                 <p className="font-semibold text-slate-900 uppercase tracking-tighter italic">L'Expérience Vectoria</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
