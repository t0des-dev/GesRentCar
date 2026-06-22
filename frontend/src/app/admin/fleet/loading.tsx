export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center space-y-6">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Chargement
        </p>
      </div>
    </div>
  );
}
