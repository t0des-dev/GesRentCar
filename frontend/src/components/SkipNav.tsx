"use client";

export default function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-2xl focus:text-sm focus:font-bold focus:outline-none focus:shadow-2xl"
    >
      Aller au contenu principal
    </a>
  );
}
