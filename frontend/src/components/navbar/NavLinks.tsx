"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  links: any[];
  textColor: string;
  hoverColor: string;
  className?: string;
}

export default function NavLinks({ links, textColor, hoverColor, className }: NavLinksProps) {
  return (
    <nav className={cn("hidden md:flex items-center gap-8 font-semibold", className)}>
      {links.map((link, i) => (
        <Link 
          key={i} 
          href={link.url} 
          className={cn("text-sm transition-all hover:-translate-y-0.5", textColor, hoverColor)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
