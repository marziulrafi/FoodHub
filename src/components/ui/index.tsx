import { type ReactNode } from "react";
import clsx from "clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx(
        "animate-spin rounded-full border-4 border-gray-200 border-t-primary-500",
        className || "h-8 w-8",
      )}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx("animate-pulse rounded-xl bg-gray-200/70", className)}
    />
  );
}

export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="page-container space-y-5 py-12"
    >
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

const badgeVariants: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-yellow-100 text-yellow-700",
  READY: "bg-green-100 text-green-700",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700",
  ACTIVE: "bg-green-100 text-green-700",
  SUSPENDED: "bg-red-100 text-red-700",
  CUSTOMER: "bg-blue-100 text-blue-700",
  PROVIDER: "bg-gray-100 text-gray-700",
  ADMIN: "bg-orange-100 text-orange-700",

  placed: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  customer: "bg-blue-100 text-blue-700",
  provider: "bg-gray-100 text-gray-700",
  admin: "bg-orange-100 text-orange-700",
};

export function Badge({ label, variant }: { label: string; variant: string }) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold capitalize border border-current/10",
        badgeVariants[variant] || "bg-gray-100 text-gray-700",
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      {label.toLowerCase()}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center card px-6 py-16 text-center">
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-4xl mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-gray-500 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StarRating({
  rating,
  onRate,
  readonly = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          aria-pressed={star <= rating}
          onClick={() => onRate?.(star)}
          className={clsx(
            "text-xl",
            star <= rating ? "text-yellow-400" : "text-gray-300",
            !readonly && "hover:text-yellow-400 cursor-pointer",
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  color = "primary",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: "primary" | "green" | "blue" | "purple";
}) {
  const colors = {
    primary: "text-primary-600 bg-primary-50",
    green: "text-green-600 bg-green-50",
    blue: "text-primary-700 bg-primary-50",
    purple: "text-gray-700 bg-gray-100",
  };

  return (
    <div className="card stat-card p-4 sm:p-6">
      <div className="flex flex-col items-start gap-4 xl:flex-row">
        {icon && (
          <div className={clsx("p-3 rounded-xl text-2xl", colors[color])}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
