"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils";

interface LazyLoadProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
}

function SkeletonPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-surface-2 min-h-[120px]", className)} />
  );
}

export function LazyLoad({
  children,
  className,
  rootMargin = "200px",
  threshold = 0.1,
}: LazyLoadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : (
        <SkeletonPlaceholder />
      )}
    </div>
  );
}
