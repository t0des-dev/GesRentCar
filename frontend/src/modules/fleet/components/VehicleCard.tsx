import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Gauge, Star, ArrowRight, Eye } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { Button } from "@/shared/ui/button";

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
  layoutView?: "grid" | "list";
}

export default function VehicleCard({
  id, brand, model, type, category, price, seats, fuel, transmission,
  year, rating = 4.8, imageUrl, className, dynamicPrice,
  dynamicReason, onQuickView, onReserve, isPopular = false, layoutView = "grid",
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
        "group flex overflow-hidden relative card-premium",
        layoutView === "list" ? "flex-col md:flex-row md:h-[280px]" : "flex-col",
        className
      )}
    >

      {/* Image Container */}
      <div className={cn("relative bg-surface-1 overflow-hidden shrink-0", layoutView === "list" ? "h-48 md:h-full md:w-[40%]" : "aspect-[4/3] w-full")}>
        {imageUrl ? (
          <Image
            src={getImageUrl(imageUrl) || "/placeholder-car.jpg"}
            alt={`${brand} ${model}`}
            fill
            unoptimized
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

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* FOMO Badge - Top Left */}
        {isPopular && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-red-500/90 backdrop-blur-md rounded-full shadow-lg border border-red-400/50">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] font-black tracking-widest uppercase text-white">Très demandé</span>
          </div>
        )}

        {/* Promotion Ribbon — Offre spéciale only */}
        {isPromo && (
          <div className="absolute top-0 right-0 z-10 flex flex-col items-end">
            <div className="relative bg-gradient-to-b from-rose-600 via-amber-500 to-amber-400 text-white px-4 pt-3 pb-2 pr-5 shadow-lg shadow-rose-500/20">
              <div className="absolute -bottom-[6px] right-0 w-0 h-0 border-l-[10px] border-l-rose-700 border-b-[6px] border-b-transparent" />
              <div className="flex flex-col items-end gap-0.5">
                <span className="flex items-center gap-1 text-[7px] font-black uppercase tracking-[0.18em] text-white/60">
                  <span aria-hidden="true">✦</span> Offre spéciale
                </span>
                {isPriceChanged && price > 0 && (
                  <span className="inline-flex items-center gap-0.5 mt-0.5 text-[10px] font-black bg-white/20 px-2 py-0.5">
                    −{discountPercent}%
                  </span>
                )}
              </div>
            </div>
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[7px] border-t-amber-400" />
          </div>
        )}

        {/* Dynamic Reason Badge — pricing context only */}
        {dynamicReason && !isPromo && (
          <div className="absolute top-3 right-3 z-10 bg-primary/10 backdrop-blur-sm text-primary text-[9px] font-bold px-2.5 py-1 rounded-lg border border-primary/20">
            {dynamicReason}
          </div>
        )}

        {/* Star Rating — Top Right (if no dynamic reason) */}
        {!dynamicReason && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur rounded-lg text-xs shadow-md border border-white/20">
            <Star size={12} className="fill-gold text-gold" />
            <span className="font-bold text-ink-1">{rating}</span>
          </div>
        )}

        {/* Quick View Overlay — Slide Up */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView?.();
          }}
          className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer bg-gradient-to-t from-black/60 via-transparent to-transparent translate-y-4 group-hover:translate-y-0"
        >
          <div className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-2 text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all shadow-xl">
            <Eye size={16} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Aperçu rapide</span>
          </div>
        </div>

        {/* Category Badge — Bottom Left (Gold Glow) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block px-3 py-1 bg-gold/10 backdrop-blur-md text-gold text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-gold/30">
            {category ? (t(`cat_${category.toLowerCase()}`) || category) : (t(`cat_${type.toLowerCase()}`) || type)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={cn("flex flex-col flex-1 p-5 gap-4", layoutView === "list" ? "justify-center" : "")}>
        
        {/* Brand & Model Header */}
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

        {/* Specs — Icons + Text */}
        <div className="flex items-center gap-4 text-xs text-ink-3">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-gold" />
            <span className="font-medium">{seats}x</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel size={14} className="text-gold" />
            <span className="font-medium">{fuel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge size={14} className="text-gold" />
            <span className="font-medium">{t(`trans_${transmission.toLowerCase()}`) || transmission}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-1" />

        {/* Price Section */}
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

        {/* Actions — Reserve */}
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
