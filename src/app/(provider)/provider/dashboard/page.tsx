"use client";

import { useProviderStats, useProviderOrders, useUpdateOrderStatus } from "@/hooks/useApi";
import { StatCard, Badge, Spinner } from "@/components/ui";
import { ShoppingBag, DollarSign, UtensilsCrossed, Activity, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Order, OrderStatus } from "@/types";

const nextStatus: Record<string, string> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};
const nextLabel: Record<string, string> = {
  PLACED: "Start Preparing",
  PREPARING: "Mark Ready",
  READY: "Mark Delivered",
};

export default function ProviderDashboard() {
  const { data: stats, isLoading: statsLoading } = useProviderStats();
  const { data: orders, isLoading: ordersLoading } = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();

  const activeOrders = orders?.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  );

  const statsObj = (stats as { stats?: Record<string, unknown>; profile?: Record<string, unknown> } | undefined);
  const profile = statsObj?.profile as Record<string, unknown> | undefined;
  const providerStatus = profile?.status as string | undefined;

  const statsData = statsObj?.stats as Record<string, unknown> | undefined;
  const totalOrders = (statsData?.totalOrders as number | undefined) ?? 0;
  const totalMeals = (statsData?.totalMeals as number | undefined) ?? 0;
  const totalRevenue = (statsData?.totalRevenue as number | undefined) ?? 0;
  const activeOrdersCount =
    ((statsData?.pendingOrders as number | undefined) ?? 0) +
    ((statsData?.preparingOrders as number | undefined) ?? 0) +
    ((statsData?.readyOrders as number | undefined) ?? 0);

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

      {!statsLoading && providerStatus && providerStatus !== "APPROVED" && (
        <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 border ${
          providerStatus === "PENDING"
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {providerStatus === "PENDING" ? (
            <Clock size={20} className="flex-shrink-0 mt-0.5 text-amber-600" />
          ) : (
            <XCircle size={20} className="flex-shrink-0 mt-0.5 text-red-600" />
          )}
          <div>
            <p className="font-semibold">
              {providerStatus === "PENDING"
                ? "⏳ Approval Pending"
                : "❌ Application Rejected"}
            </p>
            <p className="text-sm mt-1">
              {providerStatus === "PENDING"
                ? "Your restaurant is under review by our admin team. You can set up your menu now, but it won't be visible to customers until approved."
                : "Your provider application was rejected. Please contact support for more information."}
            </p>
          </div>
        </div>
      )}

      {providerStatus === "APPROVED" && (
        <div className="rounded-xl p-3 mb-6 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800">
          <CheckCircle size={18} className="text-green-600" />
          <p className="text-sm font-medium">Your restaurant is approved and visible to customers!</p>
        </div>
      )}

      {statsLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Orders" value={totalOrders} icon={<ShoppingBag />} color="blue" />
          <StatCard label="Active Orders" value={activeOrdersCount} icon={<Activity />} color="primary" />
          <StatCard label="Revenue (৳)" value={parseFloat(totalRevenue.toFixed(0))} icon={<DollarSign />} color="green" />
          <StatCard label="Menu Items" value={totalMeals} icon={<UtensilsCrossed />} color="purple" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/provider/menu" className="card p-4 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🍽️</div>
          <p className="font-semibold text-gray-900">Manage Menu</p>
          <p className="text-sm text-gray-500">Add, edit, or remove items</p>
        </Link>
        <Link href="/provider/orders" className="card p-4 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📦</div>
          <p className="font-semibold text-gray-900">All Orders</p>
          <p className="text-sm text-gray-500">View and manage orders</p>
        </Link>
        <Link href="/provider/profile" className="card p-4 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🏪</div>
          <p className="font-semibold text-gray-900">Restaurant Profile</p>
          <p className="text-sm text-gray-500">Update your info</p>
        </Link>
      </div>

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
                      {order.address}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {order.items?.map((item) => (
                        <span
                          key={item.id}
                          className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                        >
                          {item.meal?.title ?? item.name} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge label={order.status} variant={order.status as OrderStatus} />
                    <span className="font-bold text-gray-900">
                      ৳{order.totalAmount.toFixed(0)}
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
