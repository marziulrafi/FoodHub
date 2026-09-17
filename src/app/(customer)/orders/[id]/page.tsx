"use client";
import { confirmAction } from "@/lib/confirm";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ErrorState } from "@/components/ui/ErrorState";
import { useOrder, useCancelOrder, useLeaveReview } from "@/hooks/useApi";
import { LoadingScreen, Badge, StarRating, EmptyState } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { OrderTimeline } from "@/components/features/orders/OrderTimeline";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error, refetch } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const leaveReview = useLeaveReview();
  const [reviewMealId, setReviewMealId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) return <LoadingScreen />;
  if (error)
    return (
      <div className="page-container">
        <ErrorState error={error} retry={() => void refetch()} />
      </div>
    );
  if (!order)
    return (
      <div className="page-container py-10">
        <EmptyState
          title="Order not found"
          description="This order is unavailable. Return to your orders to find your latest meal."
          action={
            <Link href="/orders" className="btn-primary">
              My orders
            </Link>
          }
        />
      </div>
    );

  const handleCancel = async () => {
    if (
      !(await confirmAction(
        "Cancel this order?",
        "This will cancel the order before preparation starts.",
        "Cancel order",
      ))
    )
      return;
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
        err instanceof Error ? err.message : "Failed to submit review",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={18} /> My Orders
      </Link>

      <div className="flex flex-wrap gap-3 justify-between items-start mb-6">
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

      <OrderTimeline status={order.status} />

      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3">Items</h2>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  🍽️
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.meal?.title ?? item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ×{item.quantity} · ৳{item.price} each
                  </p>
                </div>
              </div>
              <span className="font-medium text-gray-900">
                ৳{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>৳{order.totalAmount.toFixed(0)}</span>
        </div>
      </div>

      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-1">Delivery Address</h2>
        <p className="text-gray-600 text-sm">{order.address}</p>
        {order.note && (
          <p className="text-xs text-gray-400 mt-1">Note: {order.note}</p>
        )}
      </div>

      {order.status === "PLACED" && (
        <button
          onClick={handleCancel}
          disabled={cancelOrder.isPending}
          className="btn-danger w-full mb-4"
        >
          Cancel Order
        </button>
      )}

      {order.status === "DELIVERED" && order.items && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Leave a Review</h2>
          {order.items.map((item) => (
            <div key={item.id} className="mb-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {item.meal?.title ?? item.name}
                </span>
                <button
                  onClick={() =>
                    setReviewMealId(
                      reviewMealId === item.mealId ? null : item.mealId,
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
                    aria-label="Your meal review"
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
