"use client";

import { X, Star, ShieldCheck, Gauge, Fuel, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

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
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white md:text-slate-900 p-2 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        {/* Left: Gallery */}
        <div className="flex-1 relative bg-slate-100 min-h-[400px]">
          <img 
            src={vehicle.imageUrl ? (vehicle.imageUrl.startsWith('/storage') ? `http://localhost:8000${vehicle.imageUrl}` : vehicle.imageUrl) : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"} 
            className="w-full h-full object-cover" 
            alt={vehicle.model}
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={cn("w-2 h-2 rounded-full transition-all", i === activeImage ? "w-8 bg-primary" : "bg-white/50")} />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-[450px] p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="space-y-8">
            <div>
              <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">{vehicle.brand}</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">{vehicle.model}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-600 px-3 py-1 rounded-full text-xs font-black">
                  <Star size={14} fill="currentColor" /> {vehicle.rating || 4.9}
                </div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t(`cat_${vehicle.type.toLowerCase()}`)}</span>
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
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                  <s.icon size={16} className="text-primary mb-2" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.label}</span>
                  <span className="text-sm font-bold text-slate-900">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-100" />

            <div>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-slate-900">{vehicle.price}</span>
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{t("currency_day")}</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Link 
                  href={`/booking?vehicle=${vehicle.id}`}
                  className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                >
                  {t("qv_rent")}
                  <ArrowRight size={18} />
                </Link>
                <button 
                  onClick={onClose}
                  className="w-full bg-slate-100 text-slate-500 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  {t("qv_continue")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
