"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils";

interface NavLink {
  label: string;
  url: string;
}

export default function NavLinks({ links, className, isScrolled }: { links: NavLink[]; className?: string; isScrolled?: boolean }) {
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
              "relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 group flex flex-col items-center",
              isActive ? "text-gold" : "text-ink-2 hover:text-gold"
            )}
          >
            {link.label}
            <span className={cn(
              "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gold transition-all duration-300",
              isActive ? "w-3/5" : "w-0 group-hover:w-3/5"
            )} />
          </Link>
        );
      })}
    </nav>
  );
}
