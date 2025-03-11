export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card">
          <div className="relative aspect-square bg-muted animate-pulse" />
          <div className="p-4">
            <div className="mb-2 h-6 w-3/4 rounded-md bg-muted animate-pulse" />
            <div className="mb-4 h-6 w-1/4 rounded-md bg-muted animate-pulse" />
            <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

