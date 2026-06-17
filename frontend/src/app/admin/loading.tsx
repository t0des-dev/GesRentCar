export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <div className="w-64 h-screen bg-white border-r border-border animate-pulse" />
        <div className="flex-1 p-8 space-y-6">
          <div className="h-8 w-48 bg-surface-2 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-border animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-white rounded-xl border border-border animate-pulse" />
        </div>
      </div>
    </div>
  );
}
