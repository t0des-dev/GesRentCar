"use client";

import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Clock, Briefcase, Heart } from "lucide-react";
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
  year, imageUrl, className, dynamicPrice, onReserve,
  isPopular = false, layoutView = "grid",
}: VehicleCardProps) {
  const { convert } = useCurrency();

  const displayPrice = dynamicPrice || price;
  const catLabel = (category || type || "Economy").toUpperCase();

  const badgeLabel = isPopular
    ? "POPULAR"
    : year && year >= 2024
    ? "NEW"
    : catLabel.includes("LUXURY")
    ? "LUXURY"
    : catLabel.includes("SUV")
    ? "4X4"
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
        "group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full",
        layoutView === "list" ? "md:flex-row md:h-[280px]" : "",
        className
      )}
    >
      {/* Image */}
      <div className={cn("relative bg-[#f8f7f4] overflow-hidden shrink-0", layoutView === "list" ? "h-48 md:h-full md:w-[40%]" : "aspect-[4/3] w-full")}>
        {imageUrl ? (
          <Image
            src={getImageUrl(imageUrl) || "/placeholder-car.jpg"}
            alt={`${brand} ${model}`}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
            <span className="text-4xl font-bold tracking-tighter text-gray-200">
              {brand?.[0]}{model?.[0]}
            </span>
          </div>
        )}

        {/* Badge */}
        {badgeLabel && (
          <div className="absolute top-3 left-3 z-10 bg-[#d4a843] text-white text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md">
            {badgeLabel}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border-none"
        >
          <Heart size={14} strokeWidth={2} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          {/* Category */}
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[var(--gold)] mb-1.5">
            {catLabel}
          </p>

          {/* Title */}
          <Link href={`/fleet/${id}`}>
            <h3 className="text-[16px] font-bold text-gray-900 leading-snug mb-4 font-[var(--font-instrument-serif)]">
              {displayName}
            </h3>
          </Link>

          {/* Specs Row */}
          <div className="flex items-center gap-4 pb-4 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1.5">
              <Users size={13} strokeWidth={1.8} className="text-gray-400" />
              <span className="text-[11px] text-gray-500 font-medium">{seats} seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} strokeWidth={1.8} className="text-gray-400" />
              <span className="text-[11px] text-gray-500 font-medium">
                {transmission.toLowerCase().includes("auto") ? "Automatic" : "Manual"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel size={13} strokeWidth={1.8} className="text-gray-400" />
              <span className="text-[11px] text-gray-500 font-medium capitalize">
                {fuel.toLowerCase().includes("ess") || fuel.toLowerCase().includes("petrol") ? "Petrol" : "Diesel"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase size={13} strokeWidth={1.8} className="text-gray-400" />
              <span className="text-[11px] text-gray-500 font-medium">{getBagsCount()}</span>
            </div>
          </div>
        </div>

        {/* Price & Reserve */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-extrabold text-gray-900">
              {convert(displayPrice)}
            </span>
            <span className="text-[11px] text-gray-400 font-normal">/ day</span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onReserve) { onReserve(id); return; }
              window.location.href = `/booking?vehicle=${id}`;
            }}
            className="bg-[var(--navy)] hover:bg-[#1a2747] text-white text-[12px] font-semibold px-6 py-2.5 rounded-full transition-all cursor-pointer"
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
