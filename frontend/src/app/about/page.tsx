"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/shared/utils";
import {
  Award,
  Shield,
  Lightbulb,
  Handshake,
  ArrowRight,
  Car,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "Chaque véhicule de notre flotte est sélectionné avec un souci du détail absolu. Nous n'acceptons que l'excellence, de l'entretien à la présentation.",
    color: "text-gold",
    bg: "bg-gold-light",
  },
  {
    icon: Shield,
    title: "Confiance",
    description:
      "La transparence est au cœur de chaque interaction. Pas de frais cachés, pas de mauvaises surprises — juste un service fiable et honnête.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "De la réservation en ligne au suivi GPS en temps réel, nous intégrons la technologie pour rendre votre expérience fluide et moderne.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Handshake,
    title: "Service",
    description:
      "Notre équipe est disponible 24h/24, 7j/7. Conciergerie personnelle, livraison à l'aéroport, assistance sur route — nous sommes toujours là.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const team = [
  {
    name: "Youssef El Mansouri",
    role: "Fondateur & CEO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Karim Benali",
    role: "Directeur des Opérations",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Sara Ait Brahim",
    role: "Responsable Clientèle",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600",
  },
];

const stats = [
  { value: "15+", label: "Ans d'Expérience", icon: TrendingUp },
  { value: "2400+", label: "Clients Satisfaits", icon: Users },
  { value: "80+", label: "Véhicules Premium", icon: Car },
  { value: "24/7", label: "Support Dédié", icon: Clock },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold-light))] via-[hsl(var(--surface-0))] to-[hsl(var(--gold-light))]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_30%_20%,hsl(var(--gold)),transparent_50%)]" />

        <div className="page-container px-6 relative z-10 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl"
          >
            <span className="overline-gold mb-6 inline-block">
              Notre Histoire
            </span>
            <h1 className="font-display text-ink-1 mb-8 leading-[0.95] tracking-tight text-5xl md:text-7xl lg:text-8xl">
              Vectoria
            </h1>
            <p className="text-ink-2 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium">
              La reference de la location vehicule premium au Maroc, au service
              de l&apos;excellence depuis 2010.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STORY SECTION ────────────────────────────────────────────────── */}
      <section className="section-gap-lg">
        <div className="page-container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-border">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"
                  alt="Fleet Vectoria"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={2}
                className="absolute -bottom-8 -right-4 md:-right-8 bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg z-10 hidden md:block"
              >
                <p className="font-display text-4xl mb-1">5.0</p>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Note Client
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="space-y-8"
            >
              <div>
                <span className="overline-gold mb-4 inline-block">
                  Notre Parcours
                </span>
                <h2 className="font-display text-ink-1 mb-6 text-3xl md:text-5xl leading-tight tracking-tight">
                  L&apos;Art du Mouvement
                </h2>
              </div>

              <div className="space-y-5 text-ink-2 body-text leading-relaxed">
                <p>
                  Depuis 2010, Vectoria redéfinit la location de véhicules
                  premium au Maroc. Fondée avec une vision claire — offrir une
                  expérience de conduite qui dépasse les attentes — notre
                  entreprise est devenue la référence pour ceux qui exigent
                  l&apos;excellence.
                </p>
                <p>
                  Nous croyons que chaque trajet mérite d&apos;être
                  extraordinaire. C&apos;est pourquoi nous sélectionnons
                  rigoureusement chaque véhicule de notre flotte pour garantir
                  des performances optimales et un luxe sans compromis.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="card-premium p-6 rounded-2xl border-2 border-border text-center">
                  <p className="font-display text-ink-1 text-3xl mb-1">24/7</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                    Disponible
                  </p>
                </div>
                <div className="card-premium p-6 rounded-2xl border-2 border-border text-center">
                  <p className="font-display text-ink-1 text-3xl mb-1">100%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                    Satisfaction
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES SECTION ───────────────────────────────────────────────── */}
      <section className="section-gap surface-1">
        <div className="page-container px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="overline-gold mb-4 inline-block">
              Nos Principes
            </span>
            <h2 className="font-display text-ink-1 text-3xl md:text-5xl tracking-tight">
              Ce Qui Nous Definit
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card-premium p-8 rounded-2xl border-2 border-border text-center group"
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110",
                    val.bg,
                    val.color
                  )}
                >
                  <val.icon size={28} />
                </div>
                <h3 className="text-ink-1 font-bold uppercase tracking-wider text-sm mb-3">
                  {val.title}
                </h3>
                <p className="text-ink-3 text-sm leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ─────────────────────────────────────────────────── */}
      <section className="section-gap">
        <div className="page-container px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="overline-gold mb-4 inline-block">
              L&apos;Equipe
            </span>
            <h2 className="font-display text-ink-1 text-3xl md:text-5xl tracking-tight">
              Les Visages de Vectoria
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card-premium rounded-2xl border-2 border-border overflow-hidden group"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold uppercase tracking-wider text-ink-1 text-sm mb-1">
                    {member.name}
                  </h3>
                  <p className="text-ink-3 text-xs uppercase tracking-wider font-semibold">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ────────────────────────────────────────────────── */}
      <section className="section-gap surface-1">
        <div className="page-container px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="stat-display"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-light flex items-center justify-center mx-auto mb-5">
                  <stat.icon size={24} className="text-gold-dark" />
                </div>
                <p className="number text-ink-1">{stat.value}</p>
                <p className="label text-ink-3">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────────────── */}
      <section className="section-gap-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold-light))] via-[hsl(var(--surface-0))] to-[hsl(var(--gold-light))]" />

        <div className="page-container px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="overline-gold mb-6 inline-block">
              Rejoignez-nous
            </span>
            <h2 className="font-display text-ink-1 text-3xl md:text-5xl lg:text-6xl tracking-tight mb-8">
              Rejoignez l&apos;aventure Vectoria
            </h2>
            <p className="text-ink-2 body-text mb-12">
              Decouvrez une experience de location sans equal. Reservez votre
              vehicule premium en quelques clics et laissez-vous porter par
              l&apos;excellence.
            </p>

            <Link
              href="/register"
              className="btn-gold inline-flex items-center gap-2 rounded-2xl px-10 py-4"
            >
              Creer Mon Compte
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
