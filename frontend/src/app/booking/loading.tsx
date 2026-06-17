export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 lg:px-8 py-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="h-8 w-48 bg-surface-2 rounded animate-pulse" />
          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <div className="h-5 w-40 bg-surface-2 rounded animate-pulse" />
                  <div className="h-4 w-full bg-surface-2 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-surface-2 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="w-1/3">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 sticky top-32">
                <div className="h-24 bg-surface-2 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-surface-2 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-surface-2 rounded animate-pulse" />
                </div>
                <div className="h-12 w-full bg-surface-2 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
