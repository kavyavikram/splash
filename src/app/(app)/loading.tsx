export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-5">
      <span className="sr-only">Loading…</span>
      <div className="h-24 animate-pulse rounded-[22px] bg-sky motion-reduce:animate-none" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="card space-y-3" aria-hidden="true">
            <div className="h-5 w-1/3 animate-pulse rounded bg-line motion-reduce:animate-none" />
            <div className="h-4 w-full animate-pulse rounded bg-line-soft motion-reduce:animate-none" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-line-soft motion-reduce:animate-none" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-line-soft motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
