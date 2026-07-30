"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils";

export default function NavLinks({ links, className, isScrolled }: { links: any[]; className?: string; isScrolled?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn("hidden md:flex items-center gap-1", className)}>
      {links.map((link, i) => {
        const isActive = pathname === link.url || pathname.startsWith(link.url + "/");
        return (
          <Link
            key={i}
            href={link.url}
            className={cn(
              "relative px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all duration-300 group flex flex-col items-center",
              isActive
                ? "text-amber-400"
                : isScrolled
                ? "text-white/80 hover:text-amber-300"
                : "text-white/90 hover:text-amber-300"
            )}
          >
            {link.label}
            <span className={cn(
              "absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-400 transition-all duration-300 rounded-full",
              isActive ? "w-3/5" : "w-0 group-hover:w-3/5"
            )} />
          </Link>
        );
      })}
    </nav>
  );
}
