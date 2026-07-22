"use client";

import { motion } from "framer-motion";
import { Briefcase, Plane, Heart, Calendar, Truck, User } from "lucide-react";
import ThemeSection from "./ThemeSection";

const SERVICES = [
  { icon: Briefcase, title: "Corporate Rentals", desc: "Dedicated fleet accounts, monthly invoicing, and priority support for teams and travel managers." },
  { icon: Plane, title: "Airport Delivery", desc: "Your vehicle is ready the moment you land, at every major airport across Morocco." },
  { icon: Heart, title: "VIP Service", desc: "Chauffeur-driven flagship vehicles for executives, delegations, and special occasions." },
  { icon: Calendar, title: "Long-Term Rental", desc: "Flexible monthly plans with maintenance included — ideal for expats and relocations." },
  { icon: Truck, title: "Business Fleet", desc: "Multi-vehicle contracts with a single point of contact and consolidated reporting." },
  { icon: User, title: "Luxury Chauffeur", desc: "Professional, discreet drivers for airport transfers, meetings, and city touring." },
];

interface ServicesSectionProps {
  content?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
}

export default function ServicesSection({ content }: ServicesSectionProps) {
  return (
    <ThemeSection
      eyebrow={content?.eyebrow || "Professional Services"}
      title={content?.title || "Built for business, not just vacations."}
      description={content?.description || "Fleet solutions for companies, hotels, and frequent travelers who need reliability at scale."}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {SERVICES.map((service, idx) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              className="group bg-white rounded-[18px] p-11 border border-[var(--line)] transition-all duration-400 hover:border-[var(--gold)] hover:-translate-y-1 hover:shadow-[var(--shadow-theme)]"
            >
              <div className="w-[60px] h-[60px] rounded-2xl bg-[var(--gold)]/[0.14] flex items-center justify-center mb-7">
                <Icon size={27} className="text-[var(--gold)]" strokeWidth={1.4} />
              </div>
              <h3 className="text-[18.5px] font-bold text-[var(--navy)] mb-3">{service.title}</h3>
              <p className="text-[14.5px] text-[#5b6472] leading-[1.7]">{service.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </ThemeSection>
  );
}
