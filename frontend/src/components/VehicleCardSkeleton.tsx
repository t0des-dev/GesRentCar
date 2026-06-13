import { cn } from "@/lib/utils";

export default function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-border", className)}>
      {/* Image Skeleton */}
      <div className="relative aspect-[3/2] bg-slate-200 animate-pulse"></div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-6 w-2/3 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-5 w-12 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Specs Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-10 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-10 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
        </div>

        <div className="h-px bg-border my-2" />

        {/* Price Skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
          <div className="flex items-baseline gap-2">
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-10 flex-1 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
