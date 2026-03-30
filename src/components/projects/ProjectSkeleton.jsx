export default function ProjectSkeleton() {
  return (
    <div className="flex flex-col h-52 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 gap-4 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-[var(--surface)] animate-pulse" />
        <div className="h-4 w-2/5 rounded-lg bg-[var(--surface)] animate-pulse" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full rounded-lg bg-[var(--surface)] animate-pulse" />
        <div className="h-3 w-3/4 rounded-lg bg-[var(--surface)] animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-lg bg-[var(--surface)] animate-pulse" />
        <div className="h-6 w-14 rounded-lg bg-[var(--surface)] animate-pulse" />
        <div className="h-6 w-12 rounded-lg bg-[var(--surface)] animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]/50 mt-auto">
        <div className="flex gap-3">
          <div className="h-3 w-10 rounded-lg bg-[var(--surface)] animate-pulse" />
          <div className="h-3 w-10 rounded-lg bg-[var(--surface)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
