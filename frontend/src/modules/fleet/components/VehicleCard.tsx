import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Gauge, Star, ArrowRight, Eye } from "lucide-react";
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
  layoutView?: "grid" | "list";
  gps?: boolean;
  airConditioning?: boolean;
  equipements?: string[];
}

export default function VehicleCard({
  id, brand, model, type, category, price, seats, fuel, transmission,
  year, rating = 4.8, imageUrl, className, dynamicPrice,
  dynamicReason, onQuickView, onReserve, isPopular = false, layoutView = "grid",
  gps = false, airConditioning = false, equipements = [],
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
        "group flex overflow-hidden relative bg-white border-t-2 border-t-transparent rounded-[18px] overflow-hidden flex-col h-full transition-all duration-400",
        "shadow-[0_1px_0_var(--line)] hover:-translate-y-[5px] hover:shadow-[var(--shadow-theme)] hover:border-t-[var(--gold)]",
        layoutView === "list" ? "flex-col md:flex-row md:h-[280px]" : "flex-col",
        className
      )}
      style={{ borderTopColor: undefined }}
    >
      <div className={cn("relative bg-[var(--light-gray)] overflow-hidden shrink-0", layoutView === "list" ? "h-48 md:h-full md:w-[40%]" : "aspect-[5/4] w-full")}>
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {isPopular && (
          <div className="absolute top-4 left-4 z-10 bg-[var(--gold)] text-[var(--navy)] text-[10.5px] font-bold tracking-[0.04em] uppercase px-3.5 py-1.5 rounded-full">
            Popular
          </div>
        )}

        {isPromo && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-amber-200 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/>
              <path d="M6 9.01V9"/>
              <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/>
            </svg>
            <span className="uppercase tracking-wider">Offre spéciale</span>
            {isPriceChanged && price > 0 && (
              <span className="text-[8px] font-black text-white bg-amber-500 px-1.5 py-0.5 rounded-sm">
                −{discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* Wishlist button */}
        <div className="absolute top-3.5 right-3.5 z-10 w-[30px] h-[30px] rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 opacity-0 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[13.5px] h-[13.5px] text-[var(--navy)]">
            <path d="M12 21s-7.5-4.6-10-9.2C.6 8.4 2.2 5 5.6 5c2 0 3.4 1.1 4.4 2.6C11 6.1 12.4 5 14.4 5c3.4 0 5 3.4 3.6 6.8C19.5 16.4 12 21 12 21z"/>
          </svg>
        </div>

        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(); }}
          className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer bg-gradient-to-t from-black/60 via-transparent to-transparent translate-y-4 group-hover:translate-y-0"
        >
          <div className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-2 text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all shadow-xl">
            <Eye size={16} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Aperçu rapide</span>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block px-3 py-1 bg-gold/10 backdrop-blur-md text-gold text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-gold/30">
            {category ? (t(`cat_${category.toLowerCase()}`) || category) : (t(`cat_${type.toLowerCase()}`) || type)}
          </span>
        </div>
      </div>

      <div className={cn("flex flex-col flex-1 p-7 gap-4", layoutView === "list" ? "justify-center" : "")}>
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--gold)] mb-2">{brand}</p>
            <h3 className={cn("font-[var(--font-sora)] text-[21px] font-bold text-[var(--navy)] tracking-[-0.01em] group-hover:text-[var(--gold)] transition-colors duration-300", layoutView === "list" ? "text-2xl" : "")}>
              {model}
            </h3>
          </div>
          {year && (
            <span className="text-[10px] font-bold text-ink-3 bg-surface-1 px-2.5 py-1 rounded-lg border border-border whitespace-nowrap">
              {year}
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs text-[#6b7280] pb-5 mb-5 border-b border-[var(--line)]">
          <Tooltip content={`${seats} places`}>
            <div className="flex flex-col items-center gap-2">
              <Users size={23} strokeWidth={1.4} className="text-[#9297a1]" />
              <span className="text-[11px] font-medium">{seats}x</span>
            </div>
          </Tooltip>
          <Tooltip content={`Carburant: ${fuel}`}>
            <div className="flex flex-col items-center gap-2">
              <Fuel size={23} strokeWidth={1.4} className="text-[#9297a1]" />
              <span className="text-[11px] font-medium">{fuel}</span>
            </div>
          </Tooltip>
          <Tooltip content={`Transmission: ${t(`trans_${transmission.toLowerCase()}`) || transmission}`}>
            <div className="flex flex-col items-center gap-2">
              <Gauge size={23} strokeWidth={1.4} className="text-[#9297a1]" />
              <span className="text-[11px] font-medium">{t(`trans_${transmission.toLowerCase()}`) || transmission}</span>
            </div>
          </Tooltip>
          {gps && (
            <Tooltip content="GPS intégré">
              <div className="flex flex-col items-center gap-2">
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-[#9297a1]">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                </svg>
              </div>
            </Tooltip>
          )}
          {!gps && airConditioning && (
            <Tooltip content="Climatiseur">
              <div className="flex flex-col items-center gap-2">
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-[#9297a1]">
                  <path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z"/>
                  <path d="M6 10v2a6 6 0 0 0 12 0v-2"/>
                  <line x1="12" x2="12" y1="18" y2="22"/>
                </svg>
              </div>
            </Tooltip>
          )}
          {equipements.filter((e: string) => e !== "GPS" && e !== "Climatiseur").slice(0, 2).map((eq: string) => (
            <Tooltip key={eq} content={eq}>
              <span className="inline-flex items-center px-2 py-0.5 bg-[var(--gold)]/[0.08] border border-[var(--gold)]/20 text-[var(--gold)] text-[10px] font-semibold rounded-md">
                {eq}
              </span>
            </Tooltip>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-1" />

        <div className={cn("flex", layoutView === "list" ? "flex-row items-end justify-between mt-auto" : "flex-col")}>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-[var(--font-sora)] text-[23px] font-bold text-[var(--navy)] tracking-[-0.01em] whitespace-nowrap">
              {convert(displayPrice)}
            </span>
            <span className="text-[12px] text-[#8a8f98] whitespace-nowrap">
              / jour
            </span>
            {isPriceChanged && price > 0 && (
              <>
                <span className="text-xs text-[#8a8f98] line-through ml-2">{convert(price)}</span>
                <span className="inline-flex items-center text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-sm ml-1">
                  −{discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-auto pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onReserve) { onReserve(id); return; }
              window.location.href = `/booking?vehicle=${id}`;
            }}
            className="flex-1 h-10 px-5 rounded-full text-[13.5px] font-semibold font-[var(--font-sora)] bg-[var(--navy)] text-white hover:bg-[var(--navy)]/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(22,33,62,0.5)]"
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
