"use client";

import { X, Star, ShieldCheck, Gauge, Fuel, Users, ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/shared/hooks/useTranslation";
import Image from "next/image";
import { getImageUrl } from "@/shared/utils/image";
import { Button } from "@/shared/ui/button";

interface QuickViewModalProps {
  vehicle: {
    id: number;
    brand: string;
    model: string;
    type: string;
    price: number;
    seats: number;
    fuel: string;
    transmission: string;
    imageUrl?: string;
    rating?: number;
  };
  onClose: () => void;
}

export default function QuickViewModal({ vehicle, onClose }: QuickViewModalProps) {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const images = vehicle.imageUrl ? [vehicle.imageUrl, vehicle.imageUrl, vehicle.imageUrl] : []; // Mocking gallery

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-ink-1/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-surface-0 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white md:text-ink-1 p-2 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        {/* Left: Gallery */}
        <div className="flex-1 relative bg-surface-2 min-h-[400px] group">
          <Image 
            src={getImageUrl(vehicle.imageUrl) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt={vehicle.model}
            width={1200}
            height={800}
          />
          
          {/* 360 View Dummy Button */}
          <button className="absolute top-8 left-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-ink-1 flex items-center gap-2 shadow-lg hover:bg-white transition-all hover:scale-105 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Vue 360° Intérieur
          </button>

          {/* Gallery Thumbnails (mock) */}
          <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <button 
                key={i} 
                className={cn(
                  "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0", 
                  i === 1 ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "border-white/20 opacity-60 hover:opacity-100"
                )}
              >
                <Image src={getImageUrl(vehicle.imageUrl) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"} width={64} height={48} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-[450px] p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="space-y-8">
            <div>
              <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">{vehicle.brand}</p>
              <h2 className="text-4xl font-black text-ink-1 tracking-tight mb-4">{vehicle.model}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-600 px-3 py-1 rounded-full text-xs font-black">
                  <Star size={14} fill="currentColor" /> {vehicle.rating || 4.9}
                </div>
                <span className="text-ink-3 text-xs font-bold uppercase tracking-widest">{t(`cat_${vehicle.type.toLowerCase()}`)}</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: t("qv_seats"), value: `${vehicle.seats} ${t("spec_pers")}` },
                { icon: Gauge, label: t("qv_transmission"), value: t(`trans_${vehicle.transmission.toLowerCase()}`) },
                { icon: Fuel, label: t("qv_fuel"), value: vehicle.fuel },
                { icon: ShieldCheck, label: t("qv_security"), value: "Premium" },
              ].map((s, i) => (
                <div key={i} className="bg-surface-1 p-4 rounded-2xl border border-surface-2 flex flex-col gap-1">
                  <s.icon size={16} className="text-primary mb-2" />
                  <span className="text-[10px] font-black uppercase text-ink-3 tracking-widest">{s.label}</span>
                  <span className="text-sm font-bold text-ink-1">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-surface-2" />

            <div>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-ink-1">{vehicle.price}</span>
                <span className="text-ink-3 font-bold uppercase text-xs tracking-widest">{t("currency_day")}</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button asChild variant="default" size="lg" className="w-full rounded-[24px] py-7 text-xs shadow-xl shadow-primary/20">
                  <Link href={`/booking?vehicle=${vehicle.id}`}>
                    {t("qv_rent")}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full rounded-[24px] py-6 text-[10px]">
                  <Link href={`/fleet/${vehicle.id}`}>
                    Plus de détails
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
