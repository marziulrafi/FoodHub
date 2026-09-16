import { Skeleton } from "@/components/ui";
export function ContentSkeleton({
  cards = 3,
  variant = "orders",
}: {
  cards?: number;
  variant?: "orders" | "stats" | "table";
}) {
  if (variant === "stats")
    return (
      <div
        role="status"
        aria-label="Loading dashboard"
        className="grid gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="card space-y-4 p-6">
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  if (variant === "table")
    return (
      <div
        role="status"
        aria-label="Loading table"
        className="card overflow-hidden"
      >
        <div className="grid grid-cols-3 gap-6 bg-gray-50 p-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-3 w-3/4" />
          ))}
        </div>
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center gap-6 border-t border-gray-100 p-5"
          >
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-7 w-full max-w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  return (
    <div
      role="status"
      aria-label="Loading content"
      className="w-full space-y-4 py-4"
    >
      <span className="sr-only">Loading content</span>
      <Skeleton className="h-6 w-40" />
      {Array.from({ length: cards }, (_, i) => (
        <div key={i} className="card flex gap-4 p-5">
          <Skeleton className="h-16 w-16 shrink-0" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
