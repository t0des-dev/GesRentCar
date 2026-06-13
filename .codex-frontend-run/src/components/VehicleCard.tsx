import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/image";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Gauge, Star, ArrowRight, Eye, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCompare } from "@/hooks/useCompare";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "./ui/button";

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
}

export default function VehicleCard({
  id, brand, model, type, price, seats, fuel, transmission,
  year, rating = 4.8, imageUrl, className, dynamicPrice,
  dynamicReason, onQuickView,
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
        "group flex flex-col bg-white rounded-xl overflow-hidden relative",
        "shadow-sm hover:shadow-2xl transition-all duration-500 card-premium",
        "border border-border hover:border-gold/30",
        className
      )}
    >
      {/* Image Container — 3/2 Aspect Ratio (Cinematic) */}
      <div className="relative aspect-[3/2] bg-surface-2 overflow-hidden">
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

        {/* Dynamic Reason Badge — Top Right */}
        {dynamicReason && (
          <div className="absolute top-3 right-3 z-10 bg-gold/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg border border-gold/50">
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

        {/* Quick View Overlay — Center Icon */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView?.();
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-gold/20 backdrop-blur flex items-center justify-center text-white border border-white/30 hover:bg-gold/40 transition-all">
            <Eye size={24} strokeWidth={1.5} />
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
      <div className="flex flex-col flex-1 p-5 gap-4">
        
        {/* Brand & Model Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1">{brand}</p>
            <h3 className="text-xl font-bold tracking-tight text-ink-1 group-hover:text-gold transition-colors duration-300">
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
        <div className="flex items-center gap-3 text-xs text-ink-3">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-gold" />
            <span className="font-medium">{seats}x</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel size={14} className="text-gold" />
            <span className="font-medium">{fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={14} className="text-gold" />
            <span className="font-medium">{t(`trans_${transmission.toLowerCase()}`) || transmission}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Price Section */}
        <div>
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
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isSelected ? removeFromCompare(id) : addToCompare(id);
            }}
            className={cn(
              "px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5",
              isSelected
                ? "bg-gold text-white border-gold shadow-md"
                : "bg-surface-1 text-ink-2 border-border hover:border-gold hover:text-gold hover:bg-gold/5"
            )}
          >
            {isSelected && <Check size={14} />}
            {t("compare") || "Compare"}
          </button>

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
