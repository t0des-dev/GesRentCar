"use client";

import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Gauge, Star, ArrowRight, Eye, Crown, Zap, BadgeCheck, Sparkles } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { Button } from "@/shared/ui/button";
import Tooltip from "@/components/Tooltip";

interface VehicleCardProps {
  id: number;
  brand: string;
  model: string;
  type: string;
  category?: string;
  price: number;
  seats: number;
  fuel: string;
  transmission: string;
  year?: number;
  horsepower?: string | number;
  mileage?: number;
  rating?: number;
  imageUrl?: string;
  className?: string;
  dynamicPrice?: number;
  dynamicReason?: string | null;
  onQuickView?: () => void;
  onReserve?: (id: number) => void;
  isPopular?: boolean;
  isBestDeal?: boolean;
  isNew?: boolean;
  isVip?: boolean;
  layoutView?: "grid" | "list";
  gps?: boolean;
  airConditioning?: boolean;
  bluetooth?: boolean;
  rearCamera?: boolean;
  carplay?: boolean;
  isofix?: boolean;
  cruiseControl?: boolean;
  sunroof?: boolean;
  leatherSeats?: boolean;
  electricWindows?: boolean;
}

export default function VehicleCard({
  id, brand, model, type, category, price, seats, fuel, transmission,
  year, rating = 4.8, imageUrl, className, dynamicPrice,
  dynamicReason, onQuickView, onReserve, isPopular = false,
  isBestDeal = false, isNew = false, isVip = false,
  layoutView = "grid", gps = false, airConditioning = false,
  bluetooth = false, rearCamera = false, carplay = false, isofix = false,
  cruiseControl = false, sunroof = false, leatherSeats = false, electricWindows = false,
}: VehicleCardProps) {
  const { t } = useTranslation();
  const { convert } = useCurrency();

  const displayPrice = dynamicPrice || price;
  const isPriceChanged = dynamicPrice && dynamicPrice !== price;
  const discountPercent = isPriceChanged && price > 0 ? Math.round((1 - displayPrice / price) * 100) : 0;
  const isPromo = dynamicReason === "Offre spéciale";

  return (
    <Link
      href={`/fleet/${id}`}
      className={cn(
        "group flex overflow-hidden relative card-ar7",
        layoutView === "list" ? "flex-col md:flex-row md:h-[280px]" : "flex-col",
        className
      )}
    >
      <div className={cn("relative bg-surface-1 overflow-hidden shrink-0", layoutView === "list" ? "h-48 md:h-full md:w-[40%]" : "aspect-[4/3] w-full")}>
        {imageUrl ? (
          <Image
            src={getImageUrl(imageUrl) || "/placeholder-car.jpg"}
            alt={`${brand} ${model}`}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-gold/5">
            <span className="text-5xl font-bold tracking-tighter text-primary/20">
              {brand?.[0]}{model?.[0]}
            </span>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* ─── LEFT BADGES (stacked) ─── */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {isPopular && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/90 backdrop-blur-md rounded-full shadow-lg border border-rose-400/40">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[9px] font-black tracking-widest uppercase text-white">🔥 Tendance</span>
            </div>
          )}
          {isBestDeal && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full shadow-lg border border-emerald-400/40">
              <Zap size={10} className="text-white" />
              <span className="text-[9px] font-black tracking-widest uppercase text-white">Meilleure affaire</span>
            </div>
          )}
          {isNew && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/90 backdrop-blur-md rounded-full shadow-lg border border-blue-400/40">
              <Sparkles size={10} className="text-white" />
              <span className="text-[9px] font-black tracking-widest uppercase text-white">Nouveau</span>
            </div>
          )}
          {isVip && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/90 backdrop-blur-md rounded-full shadow-lg border border-amber-400/40">
              <Crown size={10} className="text-white" />
              <span className="text-[9px] font-black tracking-widest uppercase text-white">VIP</span>
            </div>
          )}
        </div>

        {/* ─── RIGHT BADGES ─── */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
          {isPromo ? (
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-amber-200 shadow-sm">
              <BadgeCheck size={11} />
              <span className="uppercase tracking-wider">Offre spéciale</span>
              {isPriceChanged && price > 0 && (
                <span className="text-[8px] font-black text-white bg-amber-500 px-1.5 py-0.5 rounded-sm">
                  −{discountPercent}%
                </span>
              )}
            </div>
          ) : dynamicReason ? (
            <div className="bg-primary/10 backdrop-blur-sm text-primary text-[9px] font-bold px-2.5 py-1 rounded-lg border border-primary/20">
              {dynamicReason}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur rounded-lg text-xs shadow-md border border-white/20">
              <Star size={12} className="fill-gold text-gold" />
              <span className="font-bold text-ink-1">{rating}</span>
            </div>
          )}
        </div>

        {/* ─── HOVER SPECS OVERLAY (slide-up) ─── */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="w-full space-y-2 mb-10">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-2.5 py-1.5">
                <Users size={13} className="text-white/80" />
                <span className="text-[11px] font-bold text-white">{seats} places</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-2.5 py-1.5">
                <Fuel size={13} className="text-white/80" />
                <span className="text-[11px] font-bold text-white">{fuel}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-2.5 py-1.5">
                <Gauge size={13} className="text-white/80" />
                <span className="text-[11px] font-bold text-white">{transmission}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{convert(displayPrice)}</span>
              <span className="text-white/70 text-xs font-semibold">/ jour</span>
            </div>
          </div>
        </div>

        {/* ─── QUICK VIEW BUTTON ─── */}
        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(); }}
          className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer translate-y-4 group-hover:translate-y-0 pointer-events-auto z-10"
        >
          <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-2 text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all shadow-xl">
            <Eye size={15} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Aperçu rapide</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </div>
        </div>

        {/* Category badge (bottom left) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block px-3 py-1 bg-gold/10 backdrop-blur-md text-gold text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-gold/30">
            {category ? (t(`cat_${category.toLowerCase()}`) || category) : (t(`cat_${type.toLowerCase()}`) || type)}
          </span>
        </div>
      </div>

      <div className={cn("flex flex-col flex-1 p-5 gap-4", layoutView === "list" ? "justify-center" : "")}>
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-0.5">{brand}</p>
            <h3 className={cn("font-sans font-black tracking-tight text-ink-1 group-hover:text-gold transition-colors duration-300", layoutView === "list" ? "text-2xl" : "text-xl")}>
              {model}
            </h3>
          </div>
          {year && (
            <span className="text-[10px] font-bold text-ink-3 bg-surface-1 px-2.5 py-1 rounded-lg border border-border whitespace-nowrap">
              {year}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-ink-3">
          <Tooltip content={`${seats} places`}>
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-gold" />
              <span className="font-medium">{seats}x</span>
            </div>
          </Tooltip>
          <Tooltip content={`Carburant: ${fuel}`}>
            <div className="flex items-center gap-1.5">
              <Fuel size={14} className="text-gold" />
              <span className="font-medium">{fuel}</span>
            </div>
          </Tooltip>
          <Tooltip content={`Transmission: ${t(`trans_${transmission.toLowerCase()}`) || transmission}`}>
            <div className="flex items-center gap-1.5">
              <Gauge size={14} className="text-gold" />
              <span className="font-medium">{t(`trans_${transmission.toLowerCase()}`) || transmission}</span>
            </div>
          </Tooltip>
          {gps && (
            <Tooltip content="GPS intégré">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                </svg>
              </div>
            </Tooltip>
          )}
          {airConditioning && (
            <Tooltip content="Climatiseur">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-500">
                  <path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z"/>
                  <path d="M6 10v2a6 6 0 0 0 12 0v-2"/>
                  <line x1="12" x2="12" y1="18" y2="22"/>
                </svg>
              </div>
            </Tooltip>
          )}
          {bluetooth && (
            <Tooltip content="Bluetooth">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                  <path d="M6.5 6.5l11 11"/><path d="M21 3l-3.5 3.5"/><path d="M17 7l-1.5 1.5"/><path d="M3 21l3.5-3.5"/><path d="M7 17l1.5-1.5"/><path d="M14.5 6.5L8 13v4l6.5-6.5"/>
                </svg>
              </div>
            </Tooltip>
          )}
          {rearCamera && (
            <Tooltip content="Caméra de recul">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-500">
                  <path d="M2 10s3-3 5-3 5 3 5 3-3 3-5 3-5-3-5-3Z"/><circle cx="7" cy="10" r="1"/><path d="M16 10h4v4h-4z"/>
                </svg>
              </div>
            </Tooltip>
          )}
          {carplay && (
            <Tooltip content="CarPlay / Android Auto">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500">
                  <rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>
                </svg>
              </div>
            </Tooltip>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-1" />

        <div className={cn("flex", layoutView === "list" ? "flex-row items-end justify-between mt-auto" : "flex-col")}>
          <p className="text-ink-4 text-[10px] font-bold uppercase tracking-wider mb-1">À partir de</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-ink-1">
              {convert(displayPrice)}
            </span>
            <span className="text-ink-3 text-xs font-semibold uppercase tracking-wider">
              / jour
            </span>
            {isPriceChanged && price > 0 && (
              <>
                <span className="text-xs text-ink-4 line-through ml-auto">{convert(price)}</span>
                <span className="inline-flex items-center text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-sm ml-1">
                  −{discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-auto pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onReserve) { onReserve(id); return; }
              window.location.href = `/booking?vehicle=${id}`;
            }}
            className="flex-1 h-10 px-5 rounded-xl text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border border-gold/30 text-gold hover:bg-gold/5 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-1.5">
              Réserver
              <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
