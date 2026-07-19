const isDev = process.env.NODE_ENV === "development";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  url: string;
  component?: string;
  timestamp: string;
  userAgent: string;
  userId?: string;
  extra?: Record<string, unknown>;
}

export function reportError(
  error: Error,
  component?: string,
  extra?: Record<string, unknown>
): void {
  const report: ErrorReport = {
    id: generateId(),
    message: error.message,
    stack: error.stack,
    url: typeof window !== "undefined" ? window.location.href : "",
    component,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    extra,
  };

  if (isDev) {
    console.error(`[ErrorReport:${report.id}]`, report);
    return;
  }

  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("vectoria_token") : null;
    if (token) {
      report.userId = "authenticated";
    }

    navigator.sendBeacon(
      "/api/analytics/track",
      new Blob([JSON.stringify({ event: "client_error", data: report })], {
        type: "application/json",
      })
    );
  } catch {
    // Silently fail — never block the user
  }
}

export function setupGlobalErrorHandlers(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    reportError(
      new Error(event.message || "Uncaught error"),
      "window.onerror",
      { filename: event.filename, lineno: event.lineno, colno: event.colno }
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const error = reason instanceof Error ? reason : new Error(String(reason));
    reportError(error, "unhandledrejection");
  });
}
