"use client";

import { createContext, useContext, useEffect, useCallback, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AnalyticsEvent {
  event: string;
  data?: Record<string, unknown>;
  path: string;
  timestamp: number;
}

interface PageViewRecord {
  path: string;
  count: number;
  lastVisit: number;
}

interface AnalyticsContextValue {
  track: (event: string, data?: Record<string, unknown>) => void;
  getPageViews: () => PageViewRecord[];
  getStats: () => {
    totalViews: number;
    sessionCount: number;
    uniquePaths: number;
    topPages: PageViewRecord[];
  };
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

const STORAGE_KEY = "vectoria_analytics";
const SESSION_KEY = "vectoria_session_count";

function isDoNotTrackEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" || (window as any).doNotTrack === "1";
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function loadPageViews(): Record<string, PageViewRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed.pageViews && typeof parsed.pageViews === "object") {
      return parsed.pageViews;
    }
    return {};
  } catch {
    return {};
  }
}

function savePageViews(pageViews: Record<string, PageViewRecord>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        pageViews,
        lastUpdated: Date.now(),
      })
    );
  } catch {
    // Storage full or unavailable — silently fail
  }
}

function getOrCreateSessionCount(): number {
  if (typeof window === "undefined") return 1;
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return parseInt(existing, 10) || 1;

    const storageRaw = localStorage.getItem(SESSION_KEY);
    const count = storageRaw ? parseInt(storageRaw, 10) + 1 : 1;
    sessionStorage.setItem(SESSION_KEY, String(count));
    localStorage.setItem(SESSION_KEY, String(count));
    return count;
  } catch {
    return 1;
  }
}

function sendToEndpoint(event: AnalyticsEvent) {
  if (!isProduction() || isDoNotTrackEnabled()) return;

  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget — silently ignore failures
    });
  } catch {
    // Network error — silently ignore
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sessionCount = useRef(getOrCreateSessionCount());

  const recordPageView = useCallback((path: string) => {
    if (isDoNotTrackEnabled()) return;

    const pageViews = loadPageViews();
    const existing = pageViews[path];

    pageViews[path] = {
      path,
      count: (existing?.count ?? 0) + 1,
      lastVisit: Date.now(),
    };

    savePageViews(pageViews);

    sendToEndpoint({
      event: "page_view",
      data: { path },
      path,
      timestamp: Date.now(),
    });
  }, []);

  useEffect(() => {
    if (!pathname || !isProduction()) return;
    recordPageView(pathname);
  }, [pathname, recordPageView]);

  const track = useCallback(
    (event: string, data?: Record<string, unknown>) => {
      if (isDoNotTrackEnabled()) return;

      const pageViews = loadPageViews();
      const currentPath = pathname ?? "/";

      const pageRecord = pageViews[currentPath];
      const eventRecord: AnalyticsEvent = {
        event,
        data: {
          ...data,
          pageViewCount: pageRecord?.count ?? 0,
          sessionCount: sessionCount.current,
        },
        path: currentPath,
        timestamp: Date.now(),
      };

      sendToEndpoint(eventRecord);
    },
    [pathname]
  );

  const getPageViews = useCallback((): PageViewRecord[] => {
    const pageViews = loadPageViews();
    return Object.values(pageViews).sort((a, b) => b.count - a.count);
  }, []);

  const getStats = useCallback(() => {
    const records = getPageViews();
    const totalViews = records.reduce((sum, r) => sum + r.count, 0);
    return {
      totalViews,
      sessionCount: sessionCount.current,
      uniquePaths: records.length,
      topPages: records.slice(0, 10),
    };
  }, [getPageViews]);

  return (
    <AnalyticsContext.Provider value={{ track, getPageViews, getStats }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return ctx;
}

export default function Analytics() {
  return null;
}
