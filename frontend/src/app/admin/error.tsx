"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <span className="text-3xl">!</span>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-2">{t("errors_title")}</h2>
        <p className="text-sm text-slate-500 max-w-md">{t("errors_admin")}</p>
      </div>
      <button onClick={reset} className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all">
        {t("errors_retry")}
      </button>
    </div>
  );
}
