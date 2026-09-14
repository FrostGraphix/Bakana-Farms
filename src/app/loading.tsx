export default function Loading() {
  return (
    <div className="container-page animate-pulse py-12 lg:py-20" role="status" aria-label="Loading page">
      <div className="h-3 w-28 rounded-full bg-[var(--surface-subtle)]" />
      <div className="mt-5 h-14 max-w-xl rounded-[var(--radius-md)] bg-[var(--surface-subtle)]" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface-subtle)]" />)}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
