import { Skeleton } from "./skeleton";

export function MealCardSkeleton() {
  return (
    <div
      className="card overflow-hidden"
      role="status"
      aria-label="Loading meal"
    >
      <Skeleton className="h-52 rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function ProviderCardSkeleton() {
  return (
    <div
      className="card space-y-5 p-5"
      role="status"
      aria-label="Loading restaurant"
    >
      <Skeleton className="h-36 w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-14 w-14 shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
