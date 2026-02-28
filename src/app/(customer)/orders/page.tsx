"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useApi";
import { Spinner, EmptyState } from "@/components/ui";
import { OrderCard } from "@/components/features/orders/OrderCard";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Place your first order to see it here"
          action={
            <Link href="/meals" className="btn-primary">
              Browse Meals
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
