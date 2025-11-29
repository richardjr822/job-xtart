export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <div className="h-16 bg-[var(--nav-bg)] border-b border-[var(--border-color)]" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-10 w-64 bg-[var(--border-color)] rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-[var(--border-color)] rounded animate-pulse" />
        </div>

        <div className="mb-8 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-[var(--border-color)] rounded-full animate-pulse" />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-[var(--border-color)] rounded w-3/4 mb-4" />
              <div className="h-4 bg-[var(--border-color)] rounded w-full mb-2" />
              <div className="h-4 bg-[var(--border-color)] rounded w-2/3 mb-4" />
              <div className="flex justify-between">
                <div className="h-4 bg-[var(--border-color)] rounded w-1/4" />
                <div className="h-4 bg-[var(--border-color)] rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
