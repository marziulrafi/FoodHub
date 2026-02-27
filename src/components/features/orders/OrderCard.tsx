import Link from "next/link";
import type { Order } from "@/types";
import { Badge } from "@/components/ui";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/orders/${order.id}`}>
      <div className="card p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-900">
              {order.provider?.restaurantName || "Restaurant"}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {order.items?.length || 0} item(s) · ৳
              {parseFloat(order.totalAmount).toFixed(0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge label={order.status} variant={order.status} />
        </div>
        {order.items && order.items.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {order.items.slice(0, 3).map((item) => (
              <span
                key={item.id}
                className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg text-gray-600"
              >
                {item.meal?.name} ×{item.quantity}
              </span>
            ))}
            {order.items.length > 3 && (
              <span className="text-xs text-gray-400 py-1">
                +{order.items.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
