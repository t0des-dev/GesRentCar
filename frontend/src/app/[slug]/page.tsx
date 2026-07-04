"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pageService } from "@/lib/api/pages";
import ContentBlockRenderer from "@/modules/storefront/components/ContentBlockRenderer";
import type { Page } from "@/types/page";
import { Loader2 } from "lucide-react";

const RESERVED_SLUGS = new Set([
  "about", "accessibility", "admin", "agent", "auth", "booking", "c",
  "contact", "contracts", "cookies", "dashboard", "dsa", "fleet",
  "login", "locations", "offers", "privacy", "register", "scan", "terms",
]);

export default function DynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug || RESERVED_SLUGS.has(slug)) {
      setError(true);
      setLoading(false);
      return;
    }
    pageService
      .getPage(slug)
      .then(setPage)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-ink-3" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-semibold text-ink-1">404</h1>
        <p className="text-ink-3">Page non trouvée</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24">
      {page.template !== "landing" && (
        <section className="py-16 md:py-24 bg-surface-1">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-ink-1">
              {page.title}
            </h1>
          </div>
        </section>
      )}

      {page.content?.map((block, i) => (
        <ContentBlockRenderer key={block.id || i} block={block} />
      ))}
    </main>
  );
}
