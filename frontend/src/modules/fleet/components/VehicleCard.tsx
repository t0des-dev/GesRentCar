"use client";

import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Clock, Briefcase, Eye, Heart } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCurrency } from "@/shared/hooks/useCurrency";

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

  const catLabel = (category || type || "Economy").toUpperCase();
  
  const badgeLabel = isPopular
    ? "POPULAR"
    : year && year >= 2024
    ? "NEW"
    : catLabel.includes("LUXURY")
    ? "LUXURY"
    : null;

  const getBagsCount = () => {
    const c = catLabel.toLowerCase();
    if (c.includes("suv") || seats >= 7) return "4 bags";
    if (c.includes("compact") || c.includes("luxury")) return "3 bags";
    return "2 bags";
  };

  const displayName = model.toLowerCase().includes("class") || model.toLowerCase().includes("similar")
    ? model
    : `${model} Class or similar`;

  return (
    <div
      className={cn(
        "group flex flex-col justify-between bg-white rounded-[24px] overflow-hidden border border-gray-100/90 shadow-[0_2px_14px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] transition-all duration-300 h-full",
        layoutView === "list" ? "md:flex-row md:h-[280px]" : "",
        className
      )}
    >
      {/* Top Image Box */}
      <div className={cn("relative bg-[#f6f5f2] overflow-hidden shrink-0", layoutView === "list" ? "h-48 md:h-full md:w-[40%]" : "aspect-[4/3] w-full")}>
        {imageUrl ? (
          <Image
            src={getImageUrl(imageUrl) || "/placeholder-car.jpg"}
            alt={`${brand} ${model}`}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-amber-50">
            <span className="text-4xl font-bold tracking-tighter text-slate-300">
              {brand?.[0]}{model?.[0]}
            </span>
          </div>
        )}

        {/* Top-Left Badge */}
        {badgeLabel && (
          <div className="absolute top-3.5 left-3.5 z-10 bg-[#d7b268] text-[#111827] text-[10px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-md shadow-sm">
            {badgeLabel}
          </div>
        )}

        {/* Top-Right Favorite / Wishlist Button */}
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-slate-600 hover:scale-110 transition-transform cursor-pointer"
        >
          <Heart size={15} strokeWidth={1.8} className="text-slate-700" />
        </div>

        {/* Quick View Overlay */}
        {onQuickView && (
          <div
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-[2px] cursor-pointer"
          >
            <div className="px-5 py-2 rounded-full bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform">
              <Eye size={14} />
              <span>Aperçu rapide</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-6 justify-between">
        <div>
          {/* Category Eyebrow */}
          <p className="text-[11px] font-extrabold tracking-widest uppercase text-[#c39a4d] mb-1">
            {catLabel}
          </p>

          {/* Vehicle Title */}
          <Link href={`/fleet/${id}`}>
            <h3 className="text-[18px] font-bold text-slate-900 leading-snug group-hover:text-[#c39a4d] transition-colors duration-300 mb-5">
              {displayName}
            </h3>
          </Link>

          {/* Specification Icons Grid */}
          <div className="grid grid-cols-4 gap-1 py-3 text-center border-t border-gray-100/90">
            <div className="flex flex-col items-center">
              <Users size={16} strokeWidth={1.5} className="text-gray-400 mb-1" />
              <span className="text-[11px] font-medium text-gray-500">{seats} seats</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock size={16} strokeWidth={1.5} className="text-gray-400 mb-1" />
              <span className="text-[11px] font-medium text-gray-500 capitalize">
                {transmission.toLowerCase().includes("auto") ? "Automatic" : "Manual"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Fuel size={16} strokeWidth={1.5} className="text-gray-400 mb-1" />
              <span className="text-[11px] font-medium text-gray-500 capitalize">
                {fuel.toLowerCase().includes("ess") || fuel.toLowerCase().includes("petrol") ? "Petrol" : "Diesel"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Briefcase size={16} strokeWidth={1.5} className="text-gray-400 mb-1" />
              <span className="text-[11px] font-medium text-gray-500">{getBagsCount()}</span>
            </div>
          </div>
        </div>

        {/* Card Footer: Price & Action */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100/90">
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-extrabold text-slate-900">
              {convert(displayPrice)}
            </span>
            <span className="text-xs text-gray-400 font-normal">
              / day
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onReserve) { onReserve(id); return; }
              window.location.href = `/booking?vehicle=${id}`;
            }}
            className="rounded-full bg-[#182232] hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}

