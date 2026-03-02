"use client";

import { useState } from "react";
import { useAdminOrders } from "@/hooks/useApi";
import { Spinner, Badge } from "@/components/ui";
import type { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();
  const [filter, setFilter] = useState("all");

  const filtered = orders?.filter(
    (o) => filter === "all" || o.status === filter
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          "all",
          "placed",
          "preparing",
          "ready",
          "delivered",
          "cancelled",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap ${
              filter === s
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Restaurant
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered?.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {(order.customer as { name?: string })?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(order.customer as { email?: string })?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.provider?.restaurantName}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ৳{parseFloat(order.totalAmount).toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={order.status} variant={order.status as OrderStatus} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!filtered || filtered.length === 0) && (
            <div className="py-12 text-center text-gray-500">No orders</div>
          )}
        </div>
      )}
    </div>
  );
}
