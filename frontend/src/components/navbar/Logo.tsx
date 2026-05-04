"use client";

import Link from "next/link";
import { CarFront } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  agencyName: string;
  textColor: string;
}

export default function Logo({ agencyName, textColor }: LogoProps) {
  const nameParts = agencyName?.split(' ') || ["Vectoria", "Rent"];
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-2.5 rounded-xl group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
        <CarFront size={22} className="group-hover:animate-pulse" />
      </div>
      <span className={cn("text-2xl font-black tracking-tight transition-colors", textColor)}>
        {nameParts[0]}<span className="text-gradient-gold">{nameParts[1] || "Rent"}</span>
      </span>
    </Link>
  );
}
