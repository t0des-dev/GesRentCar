"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";

export default function BookingError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-destructive mb-4">{t("error_badge")}</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-4">{t("booking_error_title")}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          {t("booking_error_description")}
        </p>
        <button onClick={reset} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all">
          {t("error_retry_button")}
        </button>
      </div>
    </div>
  );
}
