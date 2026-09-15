import { Skeleton } from "@/components/ui";
export function ContentSkeleton({ cards = 3 }: { cards?: number }) {
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
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
