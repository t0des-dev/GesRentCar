"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Mountain, Wind, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const vibes = [
  {
    id: "business",
    title: "Business Elite",
    subtitle: "Prestige & Stratégie",
    icon: ShieldCheck,
    image: "/images/lifestyle/business.png",
    color: "from-slate-800 to-slate-950",
    lifestyle: "business"
  },
  {
    id: "romance",
    title: "Grand Tourisme",
    subtitle: "Émotion & Liberté",
    icon: Wind,
    image: "/images/lifestyle/romance.png",
    color: "from-rose-500 to-orange-600",
    lifestyle: "romance"
  },
  {
    id: "aventure",
    title: "Wild Adventure",
    subtitle: "Puissance & Exploration",
    icon: Mountain,
    image: "/images/lifestyle/adventure.png",
    color: "from-emerald-600 to-teal-900",
    lifestyle: "adventure"
  },
  {
    id: "family",
    title: "Family First",
    subtitle: "Confort & Partage",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1549113294-313d8bc63a4c?auto=format&fit=crop&q=80&w=800",
    color: "from-blue-500 to-indigo-600",
    lifestyle: "family"
  }
];

export default function VibeSelector({ config }: { config?: { title?: string, subtitle?: string } }) {
  const router = useRouter();

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-black text-xs uppercase tracking-[0.4em] mb-4"
          >
            Expérience Sur Mesure
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6"
          >
            {config?.title || <>Quelle est votre <span className="text-primary">vibe</span> aujourd'hui ?</>}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg font-medium max-w-2xl mx-auto"
          >
            {config?.subtitle || "Choisissez l'émotion qui guidera votre prochain voyage. Nous nous occupons du reste."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vibes.map((vibe, index) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              data-cursor="Explorer"
              onClick={() => router.push(`/fleet?lifestyle=${vibe.lifestyle}`)}
              className="group relative h-[500px] rounded-[40px] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <img
                src={vibe.image}
                alt={vibe.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-500" />
              <div className={cn("absolute inset-0 bg-gradient-to-t opacity-60 group-hover:opacity-80 transition-opacity duration-500", vibe.color)} />

              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <vibe.icon size={28} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-2">{vibe.title}</h3>
                <p className="text-white/80 font-bold text-sm mb-8">{vibe.subtitle}</p>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <span>Explorer la collection</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
