"use client";
import { ErrorState } from "@/components/ui/ErrorState";
import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminOrders } from "@/hooks/useApi";
import { Badge, EmptyState } from "@/components/ui";
import type { Order, OrderStatus } from "@/types";

function AdminOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPage = Number(searchParams.get("page") || "1");
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const filter = searchParams.get("status") || "all";
  const { data, isLoading, error, refetch } = useAdminOrders({
    page,
    limit: 10,
    status: filter === "all" ? undefined : filter,
  });
  const orders = data?.orders;
  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const changePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/admin/orders?${params.toString()}`, { scroll: false });
  };
  const changeFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") params.delete("status");
    else params.set("status", status);
    params.delete("page");
    router.push(`/admin/orders?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    if (!meta || page <= Math.max(1, meta.totalPages)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(Math.max(1, meta.totalPages)));
    router.replace(`/admin/orders?${params.toString()}`, { scroll: false });
  }, [meta, page, router, searchParams]);
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => firstPage + i,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"].map(
          (s) => (
            <button
              key={s}
              onClick={() => changeFilter(s)}
              aria-pressed={filter === s}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap ${
                filter === s
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {s}
            </button>
          ),
        )}
      </div>

      {isLoading ? (
        <ContentSkeleton variant="table" />
      ) : error ? (
        <ErrorState error={error} retry={() => void refetch()} />
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
                {orders?.map((order: Order) => (
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
                      {Array.from(
                        new Set(
                          order.items
                            ?.map((item) => item.meal?.provider?.restaurantName)
                            .filter((name): name is string => Boolean(name)),
                        ),
                      ).join(", ") ||
                        order.provider?.restaurantName ||
                        "Restaurant unavailable"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ৳{order.totalAmount.toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={order.status}
                        variant={order.status as OrderStatus}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!orders || orders.length === 0) && (
            <EmptyState
              icon={<ShoppingBag size={28} />}
              title="No orders found"
              description="No orders match the selected status."
            />
          )}
          {meta && (
            <div className="flex flex-col gap-4 border-t border-gray-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600" role="status">
                Showing {orders?.length ? (meta.page - 1) * meta.limit + 1 : 0}–
                {orders?.length
                  ? (meta.page - 1) * meta.limit + orders.length
                  : 0}{" "}
                of {meta.total} orders
              </p>
              <nav
                aria-label="Order pagination"
                className="flex flex-wrap items-center gap-1"
              >
                <Button
                  variant="secondary"
                  className="px-3"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                {pageNumbers.map((number) => (
                  <Button
                    key={number}
                    variant={number === page ? "default" : "secondary"}
                    className="min-w-10 px-3"
                    aria-label={`Page ${number}`}
                    aria-current={number === page ? "page" : undefined}
                    onClick={() => changePage(number)}
                  >
                    {number}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  className="px-3"
                  disabled={page >= totalPages}
                  onClick={() => changePage(page + 1)}
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </Button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<ContentSkeleton variant="table" />}>
      <AdminOrdersContent />
    </Suspense>
  );
}
