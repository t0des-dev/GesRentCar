import { cn } from "@/lib/utils";
import Link from "next/link";
import { Fuel, Users, Gauge, Star, ArrowRight, Eye } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCompare } from "@/hooks/useCompare";

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
  horsepower?: string;
  mileage?: number;
  rating?: number;
  imageUrl?: string;
  className?: string;
  dynamicPrice?: number;
  dynamicReason?: string | null;
  onQuickView?: () => void;
}

export default function VehicleCard({
  id,
  brand,
  model,
  type,
  price,
  seats,
  fuel,
  transmission,
  year,
  horsepower,
  rating = 4.8,
  imageUrl,
  className,
  dynamicPrice,
  dynamicReason,
  onQuickView,
}: VehicleCardProps) {
  const { t } = useTranslation();
  const { selectedIds, addToCompare, removeFromCompare } = useCompare();
  const isSelected = selectedIds.includes(id);

  const displayPrice = dynamicPrice || price;
  const isPriceChanged = dynamicPrice && dynamicPrice !== price;

  return (
    <div
      className={cn(
        "group flex flex-col bg-card border border-border/60 rounded-3xl overflow-hidden relative",
        "shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-primary/40 transition-all duration-300",
        className
      )}
    >
      {/* Dynamic Pricing Badge */}
      {dynamicReason && (
        <div className="absolute top-14 left-3 z-10 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black px-2 py-1 rounded-lg shadow-sm border border-primary/10 animate-pulse">
          {dynamicReason.toUpperCase()}
        </div>
      )}
      {/* Image */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl.startsWith('/storage') ? `http://localhost:8000${imageUrl}` : imageUrl}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-20 h-20 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth={1}>
              <path d="M19 17H5a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2z" />
              <path d="M7 17v2m10-2v2M3 13h18M9 7l1-3h4l1 3" />
            </svg>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => { e.preventDefault(); onQuickView?.(); }}
            className="bg-white text-slate-900 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white"
          >
            <Eye size={16} /> Aperçu Rapide
          </button>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {type}
        </span>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        <div>
          <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">{brand}</p>
          <h3 className="text-xl font-extrabold text-foreground">{model}</h3>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-primary" />
            {seats}
          </span>
          <span className="flex items-center gap-1.5" title={`${horsepower || ''} CV`}>
            <Fuel size={14} className="text-primary" />
            {fuel}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge size={14} className="text-primary" />
            {transmission}
          </span>
          {year && (
            <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500">
               {year}
            </span>
          )}
        </div>

        {/* Rarity Counter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className={cn(
              id % 2 === 0 ? "text-orange-500" : "text-slate-400"
            )}>
              {id % 2 === 0 ? "⚠️ Disponibilité Limitée" : "Disponible"}
            </span>
            <span className="text-slate-900">{id % 2 === 0 ? "2" : "5"}+ véhicules</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                id % 2 === 0 ? "bg-orange-500 w-[30%]" : "bg-green-500 w-[80%]"
              )} 
            />
          </div>
        </div>

        <div className="h-px bg-border mt-auto" />

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-foreground">{displayPrice}</span>
              {isPriceChanged && (
                <span className="text-sm text-muted-foreground line-through opacity-50">{price}</span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{t("price_per_day")}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                isSelected ? removeFromCompare(id) : addToCompare(id);
              }}
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                isSelected
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-inner"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              )}
              title="Comparer"
            >
              <ArrowRight
                size={16}
                className={cn(
                  "transition-transform rotate-[-45deg]",
                  isSelected && "text-primary"
                )}
              />
            </button>
            <Link
              href={`/booking?vehicle=${id}`}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl
                         text-sm font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30
                         transition-all group/btn"
            >
              {t("rent_now")}
              <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
