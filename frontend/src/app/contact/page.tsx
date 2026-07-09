"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/shared/utils";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.email.trim()) {
      e.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Email invalide";
    }
    if (!form.phone.trim()) {
      e.phone = "Le téléphone est requis";
    } else if (!/^[0-9+\s()-]{8,}$/.test(form.phone)) {
      e.phone = "Téléphone invalide";
    }
    if (!form.subject.trim()) e.subject = "Le sujet est requis";
    if (!form.message.trim()) {
      e.message = "Le message est requis";
    } else if (form.message.trim().length < 10) {
      e.message = "Minimum 10 caractères";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message envoyé avec succès ! Nous vous répondrons rapidement.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
  };

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const agencyInfo = [
    {
      icon: MapPin,
      label: "Adresse",
      value: "Sidi Maârouf, Casablanca, Maroc",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+212 6 00 00 00 00",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@vectoria.com",
    },
  ];

  return (
    <main className="min-h-screen bg-surface-0">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/15 via-slate-950 to-slate-950" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full mb-8">
              <MessageCircle size={16} className="text-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
                Contactez-nous
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 leading-[0.9]">
              Parlons{" "}
              <span className="text-gold">Ensemble</span>
            </h1>

            <p className="text-xl text-slate-300 font-medium max-w-xl leading-relaxed">
              Une question, un devis personnalisé ou simplement envie d&apos;échanger ?
              Notre équipe est à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* ── FORM ────────────────────────────────────────────── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="lg:col-span-3"
            >
              <div className="bg-surface-1 rounded-2xl border-2 border-border p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                    <Send size={22} />
                  </div>
                  <h2 className="text-2xl font-bold text-ink-1 tracking-tight">
                    Envoyez-nous un message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={cn(
                          "w-full px-4 py-3.5 rounded-xl border-2 bg-surface-0 text-ink-1 placeholder:text-ink-4 transition-all outline-none focus:border-gold focus:ring-2 focus:ring-gold/10",
                          errors.name ? "border-red-400" : "border-border"
                        )}
                        placeholder="Jean Dupont"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={cn(
                          "w-full px-4 py-3.5 rounded-xl border-2 bg-surface-0 text-ink-1 placeholder:text-ink-4 transition-all outline-none focus:border-gold focus:ring-2 focus:ring-gold/10",
                          errors.email ? "border-red-400" : "border-border"
                        )}
                        placeholder="jean@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={cn(
                          "w-full px-4 py-3.5 rounded-xl border-2 bg-surface-0 text-ink-1 placeholder:text-ink-4 transition-all outline-none focus:border-gold focus:ring-2 focus:ring-gold/10",
                          errors.phone ? "border-red-400" : "border-border"
                        )}
                        placeholder="+212 6 00 00 00 00"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Sujet
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        className={cn(
                          "w-full px-4 py-3.5 rounded-xl border-2 bg-surface-0 text-ink-1 placeholder:text-ink-4 transition-all outline-none focus:border-gold focus:ring-2 focus:ring-gold/10",
                          errors.subject ? "border-red-400" : "border-border"
                        )}
                        placeholder="Demande de devis"
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-3">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      className={cn(
                        "w-full px-4 py-3.5 rounded-xl border-2 bg-surface-0 text-ink-1 placeholder:text-ink-4 transition-all outline-none resize-none focus:border-gold focus:ring-2 focus:ring-gold/10",
                        errors.message ? "border-red-400" : "border-border"
                      )}
                      placeholder="Décrivez votre demande..."
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 px-8 py-4 bg-gold text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/25 active:scale-[0.98]",
                      loading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Envoyer
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* ── SIDEBAR ─────────────────────────────────────────── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-2 space-y-6"
            >
              {/* Agency Info Cards */}
              {agencyInfo.map((info, i) => (
                <motion.div
                  key={info.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i + 1}
                  className="flex items-center gap-5 p-6 bg-surface-1 rounded-2xl border-2 border-border hover:border-gold/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <info.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">
                      {info.label}
                    </p>
                    <p className="text-sm font-semibold text-ink-1">{info.value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Hours */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={4}
                className="bg-slate-950 text-white rounded-2xl border-2 border-border p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Clock size={20} className="text-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Horaires
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Lundi – Samedi</span>
                    <span className="font-bold">9h – 19h</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Dimanche</span>
                    <span className="font-bold text-gold">Fermé</span>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={5}
                className="bg-surface-1 rounded-2xl border-2 border-border p-6"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-4">
                  Suivez-nous
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-surface-2 text-ink-3 flex items-center justify-center hover:bg-gold hover:text-white transition-all hover:-translate-y-0.5"
                  >
                    <FacebookIcon size={18} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-surface-2 text-ink-3 flex items-center justify-center hover:bg-gold hover:text-white transition-all hover:-translate-y-0.5"
                  >
                    <InstagramIcon size={18} />
                  </a>
                </div>
              </motion.div>

              {/* WhatsApp CTA */}
              <motion.a
                href="https://wa.me/212600000000?text=Bonjour%20Vectoria"
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={6}
                className="flex items-center gap-4 p-6 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500/20 hover:bg-emerald-500/15 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-1">WhatsApp</p>
                  <p className="text-xs text-ink-3">
                    Réponse rapide garantie
                  </p>
                </div>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-border overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.50194467076!2d-7.686688849999999!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd38a512d325%3A0x3b29e50b1d7a4d3!2sCasablanca%2C%20Maroc!5e0!3m2!1sfr!2s!4v1700000000000!5m2!1sfr!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="Vectoria Rent Car – Casablanca"
            />
          </motion.div>
        </div>
      </section>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────── */}
      <a
        href="https://wa.me/212600000000?text=Bonjour%20Vectoria"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-110 transition-all animate-float-subtle"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
