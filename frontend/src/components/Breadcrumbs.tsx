"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  fleet: "Flotte",
  booking: "Réservation",
  admin: "Administration",
  dashboard: "Mon Espace",
  about: "À propos",
  contact: "Contact",
  faq: "FAQ",
  login: "Connexion",
  register: "Inscription",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") return null;
  if (pathname.startsWith("/admin")) return null;

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const items = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = LABELS[segment] || decodeURIComponent(segment);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
    >
      <Link
        href="/"
        className="text-ink-3 hover:text-gold transition-colors flex items-center gap-1"
      >
        <Home className="h-3 w-3" />
        <span className="sr-only">Accueil</span>
      </Link>

      {items.map((item) => (
        <span key={item.href} className="flex items-center gap-2">
          <ChevronRight size={12} className="text-ink-3" />
          {item.isLast ? (
            <span className="text-ink-1">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-ink-3 hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
