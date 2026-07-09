"use client";

import { cn } from "@/shared/utils";

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-surface-2", className)} />;
}

export function FleetCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-border overflow-hidden bg-white">
      <div className="aspect-[4/3] bg-surface-1 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <SkeletonLine className="h-3 w-16" />
            <SkeletonLine className="h-5 w-32" />
          </div>
          <SkeletonLine className="h-6 w-12" />
        </div>
        <div className="flex gap-4">
          <SkeletonLine className="h-4 w-12" />
          <SkeletonLine className="h-4 w-16" />
          <SkeletonLine className="h-4 w-14" />
        </div>
        <SkeletonLine className="h-px w-full" />
        <SkeletonLine className="h-8 w-24" />
        <SkeletonLine className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function FleetGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <FleetCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BookingStepSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <SkeletonLine className="h-8 w-48" />
      <SkeletonLine className="h-4 w-96" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLine key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <SkeletonLine className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <SkeletonLine className="h-10 flex-1 rounded-xl" />
        <SkeletonLine className="h-10 w-24 rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonLine key={c} className={cn("h-12 rounded-lg", c === 0 ? "w-20" : "flex-1")} />
          ))}
        </div>
      ))}
    </div>
  );
}
