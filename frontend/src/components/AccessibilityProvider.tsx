"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

interface AccessibilityContextValue {
  announce: (message: string, assertive?: boolean) => void;
  isReducedMotion: boolean;
  highContrast: boolean;
  toggleHighContrast: () => void;
  focusTrapRef: (el: HTMLElement | null) => void;
  releaseTrap: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefers;
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const announcerRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<HTMLElement | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const saved = localStorage.getItem("vectoria_high_contrast");
    if (saved === "true") {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem("vectoria_high_contrast", String(next));
      document.documentElement.classList.toggle("high-contrast", next);
      return next;
    });
  }, []);

  const announce = useCallback((message: string, assertive = false) => {
    const el = assertive ? assertiveRef.current : announcerRef.current;
    if (!el) return;
    el.textContent = "";
    requestAnimationFrame(() => {
      el.textContent = message;
    });
  }, []);

  const focusTrapRef = useCallback((el: HTMLElement | null) => {
    trapRef.current = el;
    if (el) {
      const focusable = el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !trapRef.current) return;

        const focusables = trapRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      el.addEventListener("keydown", handleKeydown);
      return () => el.removeEventListener("keydown", handleKeydown);
    }
  }, []);

  const releaseTrap = useCallback(() => {
    trapRef.current = null;
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        announce,
        isReducedMotion,
        highContrast,
        toggleHighContrast,
        focusTrapRef,
        releaseTrap,
      }}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Polite announcer */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Assertive announcer */}
      <div
        ref={assertiveRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}
