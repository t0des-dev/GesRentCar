"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

const LABELS: Record<string, string> = {
  fleet: "breadcrumbs_fleet",
  booking: "breadcrumbs_booking",
  admin: "breadcrumbs_admin",
  dashboard: "breadcrumbs_dashboard",
  about: "breadcrumbs_about",
  contact: "breadcrumbs_contact",
  faq: "breadcrumbs_faq",
  login: "breadcrumbs_login",
  register: "breadcrumbs_register",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (!pathname || pathname === "/") return null;
  if (pathname.startsWith("/admin")) return null;

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const items = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const labelKey = LABELS[segment];
    const label = labelKey ? t(labelKey) : decodeURIComponent(segment);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label={t("breadcrumbs_aria_label")}
      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
    >
      <Link
        href="/"
        className="text-ink-3 hover:text-gold transition-colors flex items-center gap-1"
      >
        <Home className="h-3 w-3" />
        <span className="sr-only">{t("breadcrumbs_home")}</span>
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
