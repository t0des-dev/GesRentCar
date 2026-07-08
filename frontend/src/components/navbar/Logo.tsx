"use client";

import Link from "next/link";
import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import { useAgency } from "@/hooks/useAgency";

export default function Logo({ className }: { className?: string }) {
  const agency = useAgency();
  const logoUrl = getImageUrl(agency.logo_url);
  const name = agency.agency_name || "Vectoria";

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      {logoUrl ? (
        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-sm">
          <img
            src={logoUrl}
            alt={name}
            className="w-full h-full object-contain p-0.5"
          />
        </div>
      ) : (
        <div className="relative w-9 h-9 rounded-lg bg-primary flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
          <span className="text-white text-sm font-black tracking-tight">V</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>
      )}
      <span className="text-lg font-bold tracking-tight text-foreground">
        {name}
      </span>
    </Link>
  );
}
