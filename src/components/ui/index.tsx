import { type ReactNode } from "react";
import clsx from "clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-4 border-gray-200 border-t-primary-500",
        className || "h-8 w-8"
      )}
    />
  );
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner className="h-12 w-12" />
    </div>
  );
}

const badgeVariants: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  customer: "bg-blue-100 text-blue-700",
  provider: "bg-purple-100 text-purple-700",
  admin: "bg-orange-100 text-orange-700",
};

export function Badge({ label, variant }: { label: string; variant: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        badgeVariants[variant] || "bg-gray-100 text-gray-700"
      )}
    >
      {label}
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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
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
          onClick={() => onRate?.(star)}
          className={clsx(
            "text-xl",
            star <= rating ? "text-yellow-400" : "text-gray-300",
            !readonly && "hover:text-yellow-400 cursor-pointer"
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
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
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
