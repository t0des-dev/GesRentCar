"use client";

import Link from "next/link";
import { cn } from "@/shared/utils";

export default function NavLinks({ links, className, isScrolled }: { links: any[]; className?: string; isScrolled?: boolean }) {
  return (
    <nav className={cn("hidden md:flex items-center gap-1", className)}>
      {links.map((link, i) => (
        <Link
          key={i}
          href={link.url}
          className={cn(
            "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
            isScrolled
              ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
