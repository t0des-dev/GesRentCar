"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseSessionTimeoutOptions {
  timeoutMs?: number;
  onTimeout: () => void;
}

export function useSessionTimeout({ timeoutMs = 30 * 60 * 1000, onTimeout }: UseSessionTimeoutOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(onTimeout, timeoutMs);
  }, [timeoutMs, onTimeout]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach(e => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);
}
