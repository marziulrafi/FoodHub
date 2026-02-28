"use client";

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
  const placeOrder = usePlaceOrder();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/meals" className="btn-primary mt-4 inline-block">
          Browse Meals
        </Link>
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
        deliveryAddress: address,
        notes,
        items: items.map((i) => ({ mealId: i.meal.id, quantity: i.quantity })),
      });
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${(order as Order).id}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to place order"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={18} /> Back to cart
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.meal.id}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {item.meal.name} × {item.quantity}
                </span>
                <span>
                  ৳
                  {(parseFloat(item.meal.price) * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>৳{total().toFixed(0)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Delivery Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin size={14} className="inline mr-1" />
              Delivery Address *
            </label>
            <textarea
              required
              rows={3}
              className="input resize-none"
              placeholder="House #, Road #, Area, City..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              className="input"
              placeholder="Special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 text-blue-700 text-sm p-3 rounded-xl">
            💵 <strong>Cash on Delivery</strong> — Pay when your order
            arrives
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
