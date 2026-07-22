"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/utils";
import {
  Clock, Car, Target, Shield, CreditCard, Zap,
  Users, Phone, Star, Award, MapPin, TrendingUp,
  Heart, Globe, Crown, CheckCircle, Headphones, Sparkles, ShieldCheck
} from "lucide-react";
import type { ComponentType } from "react";
import type { StatsConfig, StatItem } from "@/types/storefront";

const ICON_MAP: Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Clock, Car, Target, Shield, CreditCard, Zap,
  Users, Phone, Star, Award, MapPin, TrendingUp,
  Heart, Globe, Crown, CheckCircle, Headphones, Sparkles, ShieldCheck
};

const DEFAULT_ITEMS: StatItem[] = [
  { id: "s1", label: "24/7 Assistance", value: "", icon: "Clock" },
  { id: "s2", label: "Airport Delivery", value: "", icon: "Car" },
  { id: "s3", label: "Unlimited Mileage", value: "", icon: "Target" },
  { id: "s4", label: "Insurance Included", value: "", icon: "Shield" },
  { id: "s5", label: "Transparent Pricing", value: "", icon: "CreditCard" },
  { id: "s6", label: "Fast Booking", value: "", icon: "Zap" },
];

export default function TrustBar({ content }: { content?: Partial<StatsConfig> }) {
  const rawItems = content?.items;
  const items = (Array.isArray(rawItems) && rawItems.length > 0) ? rawItems : DEFAULT_ITEMS;

  return (
    <div className="bg-white border-y border-slate-200/80 shadow-sm relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row items-center justify-center">
          {items.map((item: StatItem, idx: number) => {
            const IconComp = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : CheckCircle;
            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "flex-1 flex flex-col items-center text-center gap-3 py-7 px-4",
                  "border-b sm:border-b-0 border-r border-slate-200/80",
                  "md:last:border-r-0"
                )}
              >
                <IconComp
                  size={24}
                  strokeWidth={1.5}
                  className="text-slate-800 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="flex flex-col items-center">
                  {item.value && (
                    <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">
                      {item.value}
                    </span>
                  )}
                  <span className="text-[12px] md:text-[13px] font-semibold text-slate-800 tracking-tight">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
