"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Shield,
  CreditCard,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/shared/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const },
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

const contactMethods = [
  { icon: Phone, label: "Phone", value: "+212 5 00 00 00 00", href: "tel:+212500000000", btnLabel: "Call Now", preferred: false },
  { icon: MessageCircle, label: "WhatsApp", value: "+212 5 00 00 00 00", href: "https://wa.me/212500000000", btnLabel: "Start Chat", preferred: true },
  { icon: Mail, label: "Email", value: "reservations@ar7victoriacar.ma", href: "mailto:reservations@ar7victoriacar.ma", btnLabel: "Send Email", preferred: false },
  { icon: MapPin, label: "Office", value: "Mohammed V Airport, Casablanca", href: "https://maps.google.com", btnLabel: "View Map", preferred: false },
];

const assistanceCards = [
  { icon: Shield, title: "Insurance Support", desc: "Claims and coverage questions" },
  { icon: CreditCard, title: "Billing Help", desc: "Invoices and payment queries" },
  { icon: Headphones, title: "24/7 Emergency", desc: "Roadside assistance hotline" },
  { icon: MessageCircle, title: "General Inquiry", desc: "Any other questions" },
];

const faqItems = [
  { q: "How do I modify my reservation?", a: "Contact our team by phone or WhatsApp and we'll update your dates, location or vehicle whenever possible." },
  { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, Apple Pay, Google Pay, and bank transfer for select reservations." },
  { q: "Can I cancel my reservation?", a: "Yes, free cancellation is available up to 48 hours before pickup, according to our cancellation policy." },
  { q: "Is airport delivery available?", a: "Yes, airport delivery is available at Casablanca, Marrakech, Tangier and Rabat airports, 24/7." },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.email.trim()) e.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.phone.trim()) e.phone = "Le téléphone est requis";
    else if (!/^[0-9+\s()-]{8,}$/.test(form.phone)) e.phone = "Téléphone invalide";
    if (!form.subject.trim()) e.subject = "Le sujet est requis";
    if (!form.message.trim()) e.message = "Le message est requis";
    else if (form.message.trim().length < 10) e.message = "Minimum 10 caractères";
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

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <main className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260709_083454_3e096e29-cb09-44a9-81a6-2f549e47c120.png"
            alt="AR7 Victoria Car office at dusk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg,rgba(15,20,38,0.85) 0%,rgba(15,20,38,0.6) 50%,rgba(15,20,38,0.35) 100%)" }} />
        </div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-10 pt-[60px]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[620px]">
            <div className="inline-flex items-center gap-[10px] text-gold text-[12px] font-semibold uppercase tracking-[0.16em] mb-[18px]">
              <span className="w-[22px] h-[1px] bg-gold" />
              Contact AR7 Victoria Car
            </div>
            <h1 className="font-sora text-[clamp(28px,3.8vw,42px)] font-bold text-white leading-[1.18] mb-4">
              We&apos;re Here to Help You Drive with Confidence
            </h1>
            <p className="text-[15.5px] text-white/80 max-w-[520px] mb-[30px]">
              Whether you need help choosing a vehicle, confirming a reservation or arranging airport delivery, our team is ready to assist you.
            </p>
            <div className="flex gap-[14px] flex-wrap">
              <a href="tel:+212500000000" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">
                Call Us
              </a>
              <a href="https://wa.me/212500000000" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT METHODS ──────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-8 relative z-20 -mt-[90px] mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {contactMethods.map((m, i) => (
            <motion.div
              key={m.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i}
              className={cn(
                "bg-white rounded-[18px] p-[30px_26px] shadow-[0_30px_60px_-24px_rgba(22,33,62,0.25)] text-left transition-all hover:-translate-y-1 relative",
                m.preferred && "border-[1.5px] border-gold"
              )}
            >
              {m.preferred && (
                <span className="absolute -top-[11px] right-5 bg-gold text-navy text-[10px] font-bold uppercase tracking-[0.04em] px-[11px] py-[5px] rounded-full">
                  Preferred
                </span>
              )}
              <div className="w-[46px] h-[46px] rounded-[13px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center mb-[18px]">
                <m.icon size={21} className="text-gold" />
              </div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8f98] mb-[6px]">{m.label}</h4>
              <span className="block text-[15.5px] font-bold text-navy font-sora mb-[18px]">{m.value}</span>
              <a href={m.href} className={cn(
                "inline-flex items-center justify-center gap-2 w-full px-[30px] py-[12px] rounded-full font-sora font-semibold text-[13px] transition-all",
                m.preferred ? "bg-gold text-navy hover:-translate-y-0.5" : "bg-transparent text-navy border border-[rgba(22,33,62,0.25)] hover:bg-[rgba(22,33,62,0.05)]"
              )}>
                {m.btnLabel}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── OPENING HOURS ────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-8 mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col md:flex-row gap-10 bg-white border border-[rgba(29,29,31,0.09)] rounded-[18px] p-[34px_32px] items-center"
        >
          <div className="flex-1 grid grid-cols-3 gap-6">
            <div>
              <label className="block text-[12px] font-semibold text-[#8a8f98] mb-[6px]">Lundi – Vendredi</label>
              <span className="text-[15px] font-bold text-navy font-sora">8h – 20h</span>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#8a8f98] mb-[6px]">Samedi</label>
              <span className="text-[15px] font-bold text-navy font-sora">9h – 18h</span>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#8a8f98] mb-[6px]">Dimanche</label>
              <span className="text-[15px] font-bold text-gold font-sora">10h – 16h</span>
            </div>
          </div>
          <div className="flex gap-2 items-start max-w-[260px] md:pl-8 md:border-l md:border-[rgba(29,29,31,0.09)]">
            <Clock size={16} className="text-gold shrink-0 mt-[1px]" />
            <p className="text-[12.5px] text-[#5b6472]">
              Airport counters are open 24/7. City offices follow the schedule above.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── CONTACT FORM + SIDEBAR ───────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* FORM */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="lg:col-span-3">
              <div className="bg-white rounded-[18px] p-8 md:p-10 border border-[rgba(29,29,31,0.09)] shadow-[0_1px_0_rgba(29,29,31,0.09)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-[46px] h-[46px] rounded-[13px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center">
                    <Send size={20} className="text-gold" />
                  </div>
                  <h2 className="font-sora text-[20px] font-bold text-navy">Envoyez-nous un message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8f98] mb-2">Nom complet</label>
                      <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={cn("w-full px-4 py-[15px] rounded-[12px] border bg-[#EEF2F6] text-[14.5px] text-[#1D1D1F] outline-none transition-all focus:border-gold focus:bg-white", errors.name ? "border-[#c1503f]" : "border-[rgba(29,29,31,0.09)]")} placeholder="Jean Dupont" />
                      {errors.name && <p className="text-[11.5px] text-[#c1503f] mt-[6px]">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8f98] mb-2">Email</label>
                      <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={cn("w-full px-4 py-[15px] rounded-[12px] border bg-[#EEF2F6] text-[14.5px] text-[#1D1D1F] outline-none transition-all focus:border-gold focus:bg-white", errors.email ? "border-[#c1503f]" : "border-[rgba(29,29,31,0.09)]")} placeholder="jean@example.com" />
                      {errors.email && <p className="text-[11.5px] text-[#c1503f] mt-[6px]">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8f98] mb-2">Téléphone</label>
                      <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={cn("w-full px-4 py-[15px] rounded-[12px] border bg-[#EEF2F6] text-[14.5px] text-[#1D1D1F] outline-none transition-all focus:border-gold focus:bg-white", errors.phone ? "border-[#c1503f]" : "border-[rgba(29,29,31,0.09)]")} placeholder="+212 6 00 00 00 00" />
                      {errors.phone && <p className="text-[11.5px] text-[#c1503f] mt-[6px]">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8f98] mb-2">Sujet</label>
                      <input type="text" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} className={cn("w-full px-4 py-[15px] rounded-[12px] border bg-[#EEF2F6] text-[14.5px] text-[#1D1D1F] outline-none transition-all focus:border-gold focus:bg-white", errors.subject ? "border-[#c1503f]" : "border-[rgba(29,29,31,0.09)]")} placeholder="Demande de devis" />
                      {errors.subject && <p className="text-[11.5px] text-[#c1503f] mt-[6px]">{errors.subject}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8f98] mb-2">Message</label>
                    <textarea rows={5} value={form.message} onChange={(e) => handleChange("message", e.target.value)} className={cn("w-full px-4 py-[15px] rounded-[12px] border bg-[#EEF2F6] text-[14.5px] text-[#1D1D1F] outline-none resize-none transition-all focus:border-gold focus:bg-white", errors.message ? "border-[#c1503f]" : "border-[rgba(29,29,31,0.09)]")} placeholder="Décrivez votre demande..." />
                    {errors.message && <p className="text-[11.5px] text-[#c1503f] mt-[6px]">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} className={cn("w-full flex items-center justify-center gap-3 px-8 py-[17px] bg-navy text-white rounded-full font-sora font-semibold text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(22,33,62,0.55)]", loading && "opacity-70 cursor-not-allowed")}>
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Envoyer <Send size={16} /></>}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* SIDEBAR */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="lg:col-span-2 flex flex-col gap-5">
              {/* Hours */}
              <div className="bg-[#16213E] text-white rounded-[18px] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Clock size={20} className="text-gold" />
                  <h3 className="text-[13px] font-bold uppercase tracking-wider">Horaires d&apos;ouverture</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: "Lundi – Vendredi", time: "8h – 20h" },
                    { day: "Samedi", time: "9h – 18h" },
                    { day: "Dimanche", time: "10h – 16h" },
                  ].map((h) => (
                    <div key={h.day} className="flex justify-between items-center text-[14px]">
                      <span className="text-white/60">{h.day}</span>
                      <span className="font-bold">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-[18px] p-6 border border-[rgba(29,29,31,0.09)]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] mb-4">Suivez-nous</p>
                <div className="flex gap-3">
                  {["Instagram", "Facebook", "LinkedIn"].map((s) => (
                    <a key={s} href="#" className="w-[42px] h-[42px] rounded-[12px] bg-[#EEF2F6] text-[#8a8f98] flex items-center justify-center hover:bg-gold hover:text-white transition-all hover:-translate-y-0.5">
                      <span className="text-[11px] font-bold">{s[0]}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a href="https://wa.me/212500000000?text=Bonjour%20AR7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-[rgba(47,158,94,0.08)] rounded-[18px] border border-[rgba(47,158,94,0.2)] hover:bg-[rgba(47,158,94,0.12)] transition-colors group">
                <div className="w-[46px] h-[46px] rounded-[13px] bg-[#2f9e5e] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-navy">WhatsApp</p>
                  <p className="text-[12px] text-[#8a8f98]">Réponse rapide garantie</p>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── QUICK ASSISTANCE ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-[48px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" />
              Quick Assistance
            </div>
            <h2 className="font-sora text-[clamp(26px,3.2vw,36px)] font-bold leading-[1.2] text-navy">How can we help you today?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {assistanceCards.map((c, i) => (
              <motion.div key={c.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="flex flex-col items-center text-center gap-[14px] p-[30px_20px] border border-[rgba(29,29,31,0.09)] rounded-[18px] bg-white transition-all hover:border-gold hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(22,33,62,0.18)]">
                <div className="w-[50px] h-[50px] rounded-[14px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center">
                  <c.icon size={23} className="text-gold" />
                </div>
                <div>
                  <b className="block font-sora text-[14px] text-navy">{c.title}</b>
                  <span className="text-[12px] text-[#8a8f98]">{c.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP + INFO ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[44px] items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-[18px] overflow-hidden aspect-[4/3] border border-[rgba(29,29,31,0.09)] shadow-[0_1px_0_rgba(29,29,31,0.09)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.50194467076!2d-7.686688849999999!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd38a512d325%3A0x3b29e50b1d7a4d3!2sCasablanca%2C%20Maroc!5e0!3m2!1sfr!2s!4v1700000000000!5m2!1sfr!2s"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" className="w-full h-full" title="AR7 Victoria Car – Casablanca"
              />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mb-[22px]" />
              <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px]">
                <span className="w-[22px] h-[1px] bg-gold" />
                Find Us
              </div>
              <h2 className="font-sora text-[clamp(24px,3vw,32px)] font-bold leading-[1.22] text-navy mb-5">
                Visit our office or reach us directly.
              </h2>
              <div className="flex flex-col gap-4 mb-7">
                {[
                  { icon: MapPin, text: "Mohammed V International Airport, Casablanca" },
                  { icon: Phone, text: "+212 5 00 00 00 00" },
                  { icon: Mail, text: "reservations@ar7victoriacar.ma" },
                  { icon: Clock, text: "Open 24/7 — Airport counters & city offices" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 text-[14.5px] text-[#3d4249]">
                    <item.icon size={18} className="text-gold shrink-0 mt-[1px]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 flex-wrap">
                <a href="tel:+212500000000" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-navy text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(22,33,62,0.5)]">
                  <Phone size={16} /> Call Us
                </a>
                <a href="https://wa.me/212500000000" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[780px] mx-auto px-8">
          <div className="text-center mb-[40px]">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" />
              FAQ
            </div>
            <h2 className="font-sora text-[clamp(24px,3vw,32px)] font-bold leading-[1.2] text-navy">Frequently asked questions</h2>
          </div>
          <div className="space-y-0">
            {faqItems.map((item) => (
              <details key={item.q} className="group border-b border-[rgba(29,29,31,0.09)]">
                <summary className="flex items-center justify-between py-6 cursor-pointer font-sora font-semibold text-[16px] text-navy list-none gap-5">
                  {item.q}
                  <span className="w-5 h-5 shrink-0 relative flex items-center justify-center">
                    <span className="absolute w-[14px] h-[1.5px] bg-navy rounded-full" />
                    <span className="absolute w-[1.5px] h-[14px] bg-navy rounded-full transition-transform group-open:rotate-90 group-open:scale-0" />
                  </span>
                </summary>
                <p className="pb-6 text-[14.5px] text-[#5b6472] max-w-[680px]">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-9">
            <Link href="/faq" className="inline-flex items-center gap-2 text-[14px] font-semibold text-gold hover:underline">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CONTACT ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-[48px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" />
              Why Contact Us
            </div>
            <h2 className="font-sora text-[clamp(26px,3.2vw,36px)] font-bold leading-[1.2] text-navy">We&apos;re here for every step of your journey.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {[
              { icon: CreditCard, title: "Billing & Invoices", desc: "Get your invoice, update payment details, or resolve billing questions." },
              { icon: Shield, title: "Insurance & Claims", desc: "Report an incident, ask about coverage, or start a claim." },
              { icon: Headphones, title: "Reservation Support", desc: "Modify dates, change vehicles, or get help with your booking." },
            ].map((c, i) => (
              <motion.div key={c.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-white rounded-[18px] p-[30px_26px] border border-[rgba(29,29,31,0.09)] transition-all hover:border-gold hover:-translate-y-[3px]">
                <div className="w-[46px] h-[46px] rounded-[13px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center mb-[18px]">
                  <c.icon size={21} className="text-gold" />
                </div>
                <h4 className="font-sora text-[15px] font-bold text-navy mb-2">{c.title}</h4>
                <p className="text-[13px] text-[#8a8f98]">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-[110px] bg-navy text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 w-[900px] h-[900px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />
        <div className="max-w-[620px] mx-auto relative z-10 px-8">
          <h2 className="font-sora text-[clamp(30px,4vw,44px)] font-bold text-white leading-[1.15] mb-[18px]">
            Ready to Get Started?
          </h2>
          <p className="text-white/68 text-[16.5px] mb-10">
            Browse our fleet, choose your vehicle, and experience premium car rental the way it should be.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">
              Reserve Your Vehicle
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────── */}
      <a
        href="https://wa.me/212500000000?text=Bonjour%20AR7"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#2f9e5e] text-white rounded-full flex items-center justify-center shadow-lg shadow-[rgba(47,158,94,0.6)] hover:bg-[#278a4f] hover:scale-110 transition-all"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
