"use client";

import { useSession } from "@/lib/auth-client";
import { EmptyState } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/stores/cart.store";
import { usePlaceOrder } from "@/hooks/useApi";
import { MapPin, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/types";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { data: session } = useSession();
  const placeOrder = usePlaceOrder();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Your next meal starts here"
          description="Add a dish to your cart before checking out."
          action={
            <Link href="/meals" className="btn-primary">
              Browse meals
            </Link>
          }
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    try {
      const order = await placeOrder.mutateAsync({
        address,
        note,
        items: items.map((i) => ({ mealId: i.meal.id, quantity: i.quantity })),
      });
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${(order as Order).id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={18} /> Back to cart
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)] items-start">
        <div className="card p-6 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-28">
          <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.meal.id}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {item.meal.title} × {item.quantity}
                </span>
                <span>৳{(item.meal.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>৳{total().toFixed(0)}</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card p-6 sm:p-8 space-y-5 lg:col-start-1 lg:row-start-1"
        >
          {placeOrder.error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {placeOrder.error.message}
            </p>
          )}
          <h2 className="text-xl font-bold text-gray-900">
            Where should we deliver?
          </h2>
          {session && (
            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p className="font-semibold">{session.user.name}</p>
              <p className="mt-1 break-all text-gray-500">
                {session.user.email}
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="field-1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <MapPin size={14} className="inline mr-1" />
              Delivery Address *
            </label>
            <textarea
              id="field-1"
              required
              rows={3}
              className="input resize-none"
              placeholder="House #, Road #, Area, City..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="field-2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes (optional)
            </label>
            <input
              id="field-2"
              type="text"
              className="input"
              placeholder="Special instructions..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="bg-primary-50 border border-primary-100 text-primary-800 text-sm p-3 rounded-xl">
            💵 <strong>Cash on Delivery</strong> — Pay when your order arrives
          </div>

          <button
            type="submit"
            disabled={placeOrder.isPending}
            className="btn-primary w-full py-3 text-base"
          >
            {placeOrder.isPending
              ? "Placing Order..."
              : `Place Order · ৳${total().toFixed(0)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
