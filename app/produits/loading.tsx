export default function LoadingProduits() {
  return (
    <div className="min-h-screen bg-ink px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-content">
        <div className="mb-3 h-10 w-2/3 max-w-lg animate-pulse rounded-lg bg-ink-raised md:w-1/3" />
        <div className="mb-10 h-5 w-56 animate-pulse rounded-lg bg-ink-raised" />
        <div className="mb-12 h-14 w-full animate-pulse rounded-full bg-ink-raised" />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] animate-pulse rounded-2xl bg-ink-raised" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-ink-raised" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-ink-raised" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
