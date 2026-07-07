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
            "relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group flex flex-col items-center",
            "text-slate-700 hover:text-gold"
          )}
        >
          {link.label}
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-3/5" />
        </Link>
      ))}
    </nav>
  );
}
