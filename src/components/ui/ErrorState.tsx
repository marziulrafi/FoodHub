"use client";
import { AlertCircle, RefreshCw } from "lucide-react";
export function ErrorState({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="card my-6 flex flex-col items-start gap-3 border-red-200 bg-red-50/50 p-6 sm:flex-row sm:items-center"
    >
      <AlertCircle size={24} className="shrink-0 text-red-700" />
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-gray-900">
          We couldn’t load this information
        </h2>
        <p className="mt-1 break-words text-sm text-gray-600">
          {error instanceof Error
            ? error.message
            : "Please try again in a moment."}
        </p>
      </div>
      {retry && (
        <button type="button" className="btn-secondary" onClick={retry}>
          <RefreshCw size={15} />
          Try again
        </button>
      )}
    </div>
  );
}
