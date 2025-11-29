export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--primary-light)] border-t-[var(--primary)] rounded-full animate-spin" />
        <p className="text-[var(--text-muted)] text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}
