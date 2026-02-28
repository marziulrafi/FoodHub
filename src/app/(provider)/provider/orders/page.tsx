"use client";

import { useState } from "react";
import { useProviderOrders, useUpdateOrderStatus } from "@/hooks/useApi";
import { Spinner, Badge } from "@/components/ui";
import toast from "react-hot-toast";
import type { Order, OrderStatus } from "@/types";

const ALL_STATUSES = [
  "all",
  "placed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
] as const;

const nextStatus: Record<string, string> = {
  placed: "preparing",
  preparing: "ready",
  ready: "delivered",
};

export default function ProviderOrdersPage() {
  const { data: orders, isLoading } = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState<string>("all");

  const filtered = orders?.filter(
    (o) => filter === "all" || o.status === filter
  );

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === s
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s}{" "}
            {s !== "all" &&
              orders &&
              `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          No orders in this category
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order: Order) => (
            <div key={order.id} className="card p-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <Badge label={order.status} variant={order.status as OrderStatus} />
                  </div>
                  <p className="text-sm text-gray-600">
                    👤 {(order.customer as { name?: string })?.name}
                    {(order.customer as { phone?: string })?.phone &&
                      ` · 📞 ${(order.customer as { phone?: string }).phone}`}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    📍 {order.deliveryAddress}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {order.items?.map((item) => (
                      <span
                        key={item.id}
                        className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                      >
                        {item.meal?.name} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                  {order.notes && (
                    <p className="text-xs text-amber-600 mt-1">
                      📝 {order.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">
                    ৳{parseFloat(order.totalAmount).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {nextStatus[order.status] && (
                    <button
                      onClick={() =>
                        handleStatus(order.id, nextStatus[order.status])
                      }
                      disabled={updateStatus.isPending}
                      className="mt-2 btn-primary text-xs py-1.5 px-3"
                    >
                      →{" "}
                      {nextStatus[order.status].charAt(0).toUpperCase() +
                        nextStatus[order.status].slice(1)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
