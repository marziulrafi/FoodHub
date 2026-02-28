"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/ui";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } =
    useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Browse our meals and add something delicious!"
          action={<Link href="/meals" className="btn-primary">Browse Meals</Link>}
        />
      </div>
    );
  }

  const providers = [...new Set(items.map((i) => i.meal.providerId))];
  const multiProvider = providers.length > 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {multiProvider && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-3 mb-4">
          ⚠️ Your cart contains items from multiple restaurants. Only items
          from one restaurant can be ordered at a time.
        </div>
      )}

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.meal.id} className="card p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              {item.meal.image ? (
                <img
                  src={item.meal.image}
                  alt={item.meal.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🍽️
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {item.meal.name}
              </h3>
              <p className="text-sm text-gray-500">
                ৳{parseFloat(item.meal.price).toFixed(0)} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.meal.id, item.quantity - 1)
                }
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.meal.id, item.quantity + 1)
                }
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                ৳
                {(parseFloat(item.meal.price) * item.quantity).toFixed(0)}
              </p>
              <button
                onClick={() => removeItem(item.meal.id)}
                className="text-red-400 hover:text-red-600 mt-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>৳{total().toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>Delivery</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
          <span>Total</span>
          <span>৳{total().toFixed(0)}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={clearCart} className="btn-secondary flex-1">
          Clear Cart
        </button>
        <button
          onClick={() => router.push("/checkout")}
          disabled={multiProvider}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} /> Checkout
        </button>
      </div>
    </div>
  );
}
