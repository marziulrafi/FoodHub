"use client";

import { useProviderStats, useProviderOrders, useUpdateOrderStatus } from "@/hooks/useApi";
import { StatCard, Badge, Spinner } from "@/components/ui";
import { ShoppingBag, DollarSign, UtensilsCrossed, Activity } from "lucide-react";
import toast from "react-hot-toast";
import type { Order, OrderStatus } from "@/types";

const nextStatus: Record<string, string> = {
  placed: "preparing",
  preparing: "ready",
  ready: "delivered",
};
const nextLabel: Record<string, string> = {
  placed: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Delivered",
};

export default function ProviderDashboard() {
  const { data: stats, isLoading: statsLoading } = useProviderStats();
  const { data: orders, isLoading: ordersLoading } = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();

  const activeOrders = orders?.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  );

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success("Order status updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Provider Dashboard
      </h1>

      {statsLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Orders" value={(stats as Record<string, number>)?.totalOrders ?? 0} icon={<ShoppingBag />} color="blue" />
          <StatCard label="Active Orders" value={(stats as Record<string, number>)?.activeOrders ?? 0} icon={<Activity />} color="primary" />
          <StatCard label="Revenue (৳)" value={parseFloat((stats as Record<string, string>)?.revenue || "0").toFixed(0)} icon={<DollarSign />} color="green" />
          <StatCard label="Menu Items" value={(stats as Record<string, number>)?.totalMeals ?? 0} icon={<UtensilsCrossed />} color="purple" />
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Orders</h2>
        {ordersLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : !activeOrders || activeOrders.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            No active orders right now
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order: Order) => (
              <div key={order.id} className="card p-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(order.customer as { name?: string })?.name} ·{" "}
                      {order.deliveryAddress}
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
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge label={order.status} variant={order.status as OrderStatus} />
                    <span className="font-bold text-gray-900">
                      ৳{parseFloat(order.totalAmount).toFixed(0)}
                    </span>
                  </div>
                </div>
                {nextStatus[order.status] && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(order.id, nextStatus[order.status])
                    }
                    disabled={updateStatus.isPending}
                    className="mt-3 btn-primary text-sm py-1.5"
                  >
                    {nextLabel[order.status]}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
