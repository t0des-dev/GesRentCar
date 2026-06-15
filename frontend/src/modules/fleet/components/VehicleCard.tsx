import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Gauge, Star, ArrowRight, Eye, Check } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCompare } from "@/hooks/useCompare";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { Button } from "@/shared/ui/button";

interface VehicleCardProps {
  id: number;
  brand: string;
  model: string;
  type: string;
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
  isPopular?: boolean;
  layoutView?: "grid" | "list";
}

export default function VehicleCard({
  id, brand, model, type, price, seats, fuel, transmission,
  year, rating = 4.8, imageUrl, className, dynamicPrice,
  dynamicReason, onQuickView, isPopular = false, layoutView = "grid",
}: VehicleCardProps) {
  const { t } = useTranslation();
  const { selectedIds, addToCompare, removeFromCompare } = useCompare();
  const { convert } = useCurrency();
  const isSelected = selectedIds.includes(id);

  const displayPrice = dynamicPrice || price;
  const isPriceChanged = dynamicPrice && dynamicPrice !== price;

  return (
    <Link
      href={`/fleet/${id}`}
      className={cn(
        "group flex bg-white rounded-[1.5rem] overflow-hidden relative",
        "shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-700",
        "border border-slate-200/60 hover:border-gold/40",
        layoutView === "list" ? "flex-col md:flex-row md:h-[280px]" : "flex-col",
        className
      )}
    >
      {/* Animated Glow Border on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[1.5rem] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)] z-20" />

      {/* Image Container */}
      <div className={cn("relative bg-slate-50 overflow-hidden shrink-0", layoutView === "list" ? "h-48 md:h-full md:w-[40%]" : "aspect-[4/3] w-full")}>
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

        {/* Dynamic Reason Badge — Top Right */}
        {dynamicReason && (
          <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-gold to-yellow-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(212,175,55,0.3)] border border-gold/40">
            {dynamicReason.toUpperCase()}
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

        {/* Type Badge — Bottom Left (Gold) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block px-3 py-1.5 bg-gold/15 backdrop-blur text-gold text-[11px] font-bold rounded-lg shadow-sm border border-gold/30">
            {t(`cat_${type.toLowerCase()}`) || type}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={cn("flex flex-col flex-1 p-5 gap-4", layoutView === "list" ? "justify-center" : "")}>
        
        {/* Brand & Model Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1">{brand}</p>
            <h3 className={cn("font-bold tracking-tight text-ink-1 group-hover:text-gold transition-colors duration-300", layoutView === "list" ? "text-2xl" : "text-xl")}>
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
        <div className="h-px bg-border my-1" />

        {/* Price Section */}
        <div className={cn("flex", layoutView === "list" ? "flex-row items-end justify-between mt-auto" : "flex-col")}>
          <p className="text-ink-4 text-[10px] font-semibold uppercase tracking-wider mb-1">À partir de</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink-1">
              {convert(displayPrice).split(' ')[0]}
            </span>
            <span className="text-ink-3 text-sm font-medium">
              / <span className="font-semibold text-ink-2">jour</span>
            </span>
            {isPriceChanged && (
              <span className="text-xs text-ink-4 line-through ml-auto">{convert(price).split(' ')[0]}</span>
            )}
          </div>
        </div>

        {/* Actions — Compare & Reserve */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isSelected ? removeFromCompare(id) : addToCompare(id);
            }}
            variant={isSelected ? "gold" : "outline"}
            size="sm"
            className={cn(
              "text-[10px] sm:text-xs font-bold uppercase tracking-wider",
              !isSelected && "bg-surface-1 text-ink-2 border-border hover:border-gold hover:text-gold hover:bg-gold/5"
            )}
          >
            {isSelected && <Check size={14} />}
            {t("compare") || "Compare"}
          </Button>

          <Button
            variant="gold"
            size="sm"
            className="flex-1 text-xs font-bold uppercase tracking-wider group-hover:shadow-lg transition-all"
            asChild
          >
            <span className="flex items-center gap-2">
              Réserver
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>

      </div>
    </Link>
  );
}
