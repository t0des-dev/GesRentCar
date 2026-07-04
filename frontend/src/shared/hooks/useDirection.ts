"use client";

import { useState, useEffect } from "react";

export function useDirection() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    setDir((document.documentElement.dir as "ltr" | "rtl") || "ltr");
    const observer = new MutationObserver(() => {
      setDir((document.documentElement.dir as "ltr" | "rtl") || "ltr");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => observer.disconnect();
  }, []);

  return dir;
}
