import {
  Check,
  Clock,
  CookingPot,
  PackageCheck,
  CheckCheck,
  XCircle,
} from "lucide-react";
import type { OrderStatus } from "@/types";
const steps = [
  { status: "PLACED", label: "Placed", icon: Clock },
  { status: "PREPARING", label: "Preparing", icon: CookingPot },
  { status: "READY", label: "Ready", icon: PackageCheck },
  { status: "DELIVERED", label: "Delivered", icon: CheckCheck },
] as const;
export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED")
    return (
      <div
        role="status"
        className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
      >
        <XCircle size={22} />
        <div>
          <p className="font-semibold">Order cancelled</p>
          <p className="mt-1 text-sm">
            This order will not be prepared or delivered.
          </p>
        </div>
      </div>
    );
  const current = steps.findIndex((step) => step.status === status);
  return (
    <section
      aria-label="Order progress"
      aria-live="polite"
      className="card order-timeline mb-5 p-5 sm:p-7"
    >
      <h2 className="mb-6 font-bold">Your meal’s journey</h2>
      <ol className="grid grid-cols-4 gap-2">
        {steps.map(({ status: step, label, icon: Icon }, index) => (
          <li
            key={step}
            className="relative flex flex-col items-center text-center"
            aria-current={index === current ? "step" : undefined}
          >
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-5 h-0.5 w-[calc(100%_+_0.5rem)] overflow-hidden bg-gray-200"
              >
                <span
                  className="order-progress block h-full origin-left bg-primary-500"
                  style={{ transform: `scaleX(${index < current ? 1 : 0})` }}
                />
              </span>
            )}
            <span
              className={`order-step relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white ${index <= current ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"}`}
            >
              {index < current ? <Check size={17} /> : <Icon size={17} />}
            </span>
            <span
              className={`mt-3 text-[11px] sm:text-sm ${index === current ? "font-bold text-primary-700" : "text-gray-500"}`}
            >
              {label}
            </span>
            {index === current && (
              <span className="mt-1 text-[10px] text-gray-400">
                Current status
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
