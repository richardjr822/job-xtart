export default function JobDetailsLoading() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <div className="h-16 bg-[var(--nav-bg)] border-b border-[var(--border-color)]" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-6 w-32 bg-[var(--border-color)] rounded animate-pulse mb-6" />

        <div className="mb-8">
          <div className="h-10 w-3/4 bg-[var(--border-color)] rounded animate-pulse mb-4" />
          <div className="flex gap-4">
            <div className="h-5 w-32 bg-[var(--border-color)] rounded animate-pulse" />
            <div className="h-5 w-32 bg-[var(--border-color)] rounded animate-pulse" />
            <div className="h-5 w-24 bg-[var(--border-color)] rounded animate-pulse" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl p-6">
              <div className="h-6 w-48 bg-[var(--border-color)] rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-[var(--border-color)] rounded animate-pulse" />
                <div className="h-4 w-full bg-[var(--border-color)] rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-[var(--border-color)] rounded animate-pulse" />
                <div className="h-4 w-full bg-[var(--border-color)] rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-[var(--border-color)] rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl p-6">
              <div className="h-4 w-20 bg-[var(--border-color)] rounded animate-pulse mb-2" />
              <div className="h-10 w-32 bg-[var(--border-color)] rounded animate-pulse mb-6" />
              <div className="h-12 w-full bg-[var(--border-color)] rounded animate-pulse mb-3" />
              <div className="h-12 w-full bg-[var(--border-color)] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
