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
        "group flex flex-col bg-card border border-border/60 rounded-[40px] overflow-hidden relative",
        "shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-4 hover:border-primary/20 transition-all duration-700",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity",
        className
      )}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Dynamic Pricing Badge */}
      {dynamicReason && (
        <div className="absolute top-14 left-6 z-10 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black px-4 py-2 rounded-xl shadow-xl border border-primary/10 animate-pulse">
          {t(`badge_${dynamicReason.toLowerCase().replace(' ', '_')}`) !== `badge_${dynamicReason.toLowerCase().replace(' ', '_')}` 
            ? t(`badge_${dynamicReason.toLowerCase().replace(' ', '_')}`).toUpperCase() 
            : dynamicReason.toUpperCase()}
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl.startsWith('/storage') ? `http://localhost:8000${imageUrl}` : imageUrl}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={64} className="text-muted-foreground/20" />
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
          <button 
            onClick={(e) => { e.preventDefault(); onQuickView?.(); }}
            className="bg-white text-slate-900 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:bg-primary hover:text-white hover:scale-105"
          >
            <Eye size={18} /> {t("vision_360")}
          </button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
            {t(`badge_${type.toLowerCase()}`)}
          </span>
        </div>

        {/* Top Right: Rating */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-md text-slate-900 text-xs px-3 py-1.5 rounded-2xl border border-slate-100 shadow-lg">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-black">{rating}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-8 p-10 flex-1 bg-white relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{brand}</p>
            <h3 className="text-4xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors duration-500 leading-none">{model}</h3>
          </div>
          {year && (
             <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-lg text-slate-500 border border-slate-200">
                {year}
             </span>
          )}
        </div>

        {/* High-End Specs Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, value: `${seats} ${t("spec_pers")}`, label: t("spec_seats") },
            { icon: Fuel, value: fuel, label: t("spec_fuel") },
            { icon: Gauge, value: t(`trans_${transmission.toLowerCase()}`), label: t("spec_gearbox") }
          ].map((spec, i) => (
            <div key={i} className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4 group/spec hover:border-primary transition-colors">
              <spec.icon size={16} className="text-slate-400 group-hover/spec:text-primary transition-colors" />
              <span className="text-xs font-black text-foreground">{spec.value}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{spec.label}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Price & CTA Section */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-foreground tracking-tighter">{displayPrice.toLocaleString()}</span>
              {isPriceChanged && (
                <span className="text-sm text-muted-foreground line-through opacity-40">{price}</span>
              )}
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t("currency_day")}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                isSelected ? removeFromCompare(id) : addToCompare(id);
              }}
              className={cn(
                "w-12 h-12 rounded-2xl border transition-all flex items-center justify-center",
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                  : "bg-slate-50 text-slate-400 border-slate-100 hover:border-primary hover:text-primary"
              )}
              title={t("compare")}
            >
              <ArrowRight
                size={20}
                className={cn(
                  "transition-transform",
                  isSelected ? "rotate-[-45deg]" : "rotate-0"
                )}
              />
            </button>
            <Link
              href={`/booking?vehicle=${id}`}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest
                         hover:bg-primary hover:shadow-2xl hover:shadow-primary/40
                         transition-all group/btn flex items-center gap-2"
            >
              {t("rent_now")}
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
