"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-container py-12">
      <ErrorState error={error} retry={reset} />
    </div>
  );
}
