export default function CartLoading() {
  return (
    <div className="container-page animate-pulse py-12 lg:py-16" aria-label="Loading cart">
      <div className="h-4 w-24 rounded bg-[var(--surface-subtle)]" />
      <div className="mt-5 h-12 w-64 rounded bg-[var(--surface-subtle)]" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="h-32 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)]" />
          ))}
        </div>
        <div className="h-64 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)]" />
      </div>
    </div>
  );
}
