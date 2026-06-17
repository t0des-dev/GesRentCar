export default function FleetLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 lg:px-8 py-32">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-surface-2 rounded animate-pulse" />
            <div className="h-8 w-64 bg-surface-2 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="h-48 bg-surface-2 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-surface-2 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-surface-2 rounded animate-pulse" />
                  <div className="h-8 w-1/3 bg-surface-2 rounded animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
