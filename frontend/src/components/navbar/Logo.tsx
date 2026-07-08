"use client";

import Link from "next/link";
import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import { useAgency } from "@/hooks/useAgency";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return match ? { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) } : null;
}

function parseColor(color: string, opacity: number): string {
  if (opacity >= 1) return color;
  if (color.startsWith("hsl")) {
    return color.replace(")", `, ${opacity})`).replace("hsl(", "hsla(");
  }
  if (color.startsWith("#")) {
    const rgb = hexToRgb(color);
    if (rgb) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }
  if (color.startsWith("rgb") && !color.startsWith("rgba")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }
  return color;
}

export default function Logo({ className }: { className?: string }) {
  const agency = useAgency();
  const logoUrl = getImageUrl(agency.logo_url);
  const name = agency.agency_name || "Vectoria";
  const cfg = agency.logo_config || {};

  const w = cfg.width || "36px";
  const h = cfg.height || "36px";
  const bgRaw = cfg.background || "hsl(var(--primary))";
  const bgOpacity = cfg.background_opacity ?? 1;
  const bg = parseColor(bgRaw, bgOpacity);
  const radius = cfg.radius || "8px";
  const showName = cfg.show_name !== false;

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      {logoUrl ? (
        <div
          className="relative overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-sm shrink-0"
          style={{ width: w, height: h, borderRadius: radius, background: bg }}
        >
          <img
            src={logoUrl}
            alt={name}
            className="w-full h-full object-contain p-0.5"
          />
        </div>
      ) : (
        <div
          className="relative overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shrink-0"
          style={{ width: w, height: h, borderRadius: radius, background: bg }}
        >
          <span className="text-white text-sm font-black tracking-tight">V</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>
      )}
      {showName && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          {name}
        </span>
      )}
    </Link>
  );
}
