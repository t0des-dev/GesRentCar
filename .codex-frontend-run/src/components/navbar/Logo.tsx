"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <div className="relative w-9 h-9 rounded-lg bg-primary flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
        <span className="text-white text-sm font-black tracking-tight">V</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      </div>
      <span className="text-lg font-bold tracking-tight text-foreground">
        Vectoria
      </span>
    </Link>
  );
}
