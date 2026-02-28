"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useOrder, useCancelOrder, useLeaveReview } from "@/hooks/useApi";
import { LoadingScreen, Badge, StarRating } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { OrderStatus } from "@/types";

const statusSteps: OrderStatus[] = [
  "placed",
  "preparing",
  "ready",
  "delivered",
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const leaveReview = useLeaveReview();
  const [reviewMealId, setReviewMealId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) return <LoadingScreen />;
  if (!order)
    return (
      <div className="p-8 text-center text-gray-500">Order not found</div>
    );

  const currentStep =
    order.status === "cancelled"
      ? -1
      : statusSteps.indexOf(order.status as OrderStatus);

  const handleCancel = async () => {
    if (!confirm("Cancel this order?")) return;
    try {
      await cancelOrder.mutateAsync(order.id);
      toast.success("Order cancelled");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    }
  };

  const handleReview = async (mealId: string) => {
    try {
      await leaveReview.mutateAsync({
        mealId,
        orderId: order.id,
        rating,
        comment,
      });
      toast.success("Review submitted!");
      setReviewMealId(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={18} /> My Orders
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {order.provider?.restaurantName} ·{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge label={order.status} variant={order.status} />
      </div>

      {order.status !== "cancelled" && (
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
            <div
              className="absolute top-3 left-0 h-0.5 bg-primary-500 -z-0 transition-all"
              style={{
                width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
              }}
            />
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                    idx <= currentStep
                      ? "bg-primary-500 border-primary-500 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {idx <= currentStep ? "✓" : ""}
                </div>
                <span className="text-xs mt-1 capitalize text-gray-500">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3">Items</h2>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  🍽️
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.meal?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ×{item.quantity} · ৳{item.unitPrice} each
                  </p>
                </div>
              </div>
              <span className="font-medium text-gray-900">
                ৳{item.subtotal}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>৳{parseFloat(order.totalAmount).toFixed(0)}</span>
        </div>
      </div>

      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-1">Delivery Address</h2>
        <p className="text-gray-600 text-sm">{order.deliveryAddress}</p>
        {order.notes && (
          <p className="text-xs text-gray-400 mt-1">Note: {order.notes}</p>
        )}
      </div>

      {order.status === "placed" && (
        <button
          onClick={handleCancel}
          disabled={cancelOrder.isPending}
          className="btn-danger w-full mb-4"
        >
          Cancel Order
        </button>
      )}

      {order.status === "delivered" && order.items && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Leave a Review</h2>
          {order.items.map((item) => (
            <div key={item.id} className="mb-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{item.meal?.name}</span>
                <button
                  onClick={() =>
                    setReviewMealId(
                      reviewMealId === item.mealId ? null : item.mealId
                    )
                  }
                  className="text-xs text-primary-600 hover:underline"
                >
                  {reviewMealId === item.mealId ? "Cancel" : "Review"}
                </button>
              </div>
              {reviewMealId === item.mealId && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2">
                  <StarRating rating={rating} onRate={setRating} />
                  <textarea
                    className="input text-sm resize-none"
                    rows={2}
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    onClick={() => handleReview(item.mealId)}
                    disabled={leaveReview.isPending}
                    className="btn-primary text-sm py-1.5"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
