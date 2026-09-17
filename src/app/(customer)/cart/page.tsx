"use client";

import toast from "react-hot-toast";
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
          action={
            <Link href="/meals" className="btn-primary">
              Browse Meals
            </Link>
          }
        />
      </div>
    );
  }

  const providers = [...new Set(items.map((i) => i.meal.providerId))];
  const multiProvider = providers.length > 1;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {multiProvider && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-3 mb-4">
          ⚠️ Your cart contains items from multiple restaurants. Only items from
          one restaurant can be ordered at a time.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] items-start">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.meal.id}
              className="card reveal p-4 sm:p-5 grid grid-cols-[64px_minmax(0,1fr)_auto] gap-3 sm:gap-4 items-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.meal.image ? (
                  <img
                    src={item.meal.image}
                    alt={item.meal.title}
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
                  {item.meal.title}
                </h3>
                <p className="text-sm text-gray-500">
                  ৳{item.meal.price.toFixed(0)} each
                </p>
              </div>
              <div className="col-start-2 row-start-2 flex items-center gap-2">
                <button
                  aria-label={`Decrease quantity of ${item.meal.title}`}
                  onClick={() =>
                    updateQuantity(item.meal.id, item.quantity - 1)
                  }
                  className="quantity-button w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-50"
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span
                  aria-live="polite"
                  key={item.quantity}
                  className="quantity-feedback w-6 text-center font-medium"
                >
                  {item.quantity}
                </span>
                <button
                  aria-label={`Increase quantity of ${item.meal.title}`}
                  onClick={() =>
                    updateQuantity(item.meal.id, item.quantity + 1)
                  }
                  className="quantity-button w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-50"
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="col-start-3 row-start-1 row-span-2 text-right">
                <p className="font-semibold text-gray-900">
                  ৳{(item.meal.price * item.quantity).toFixed(0)}
                </p>
                <button
                  aria-label={`Remove ${item.meal.title}`}
                  onClick={() => {
                    removeItem(item.meal.id);
                    toast.success("Item removed from cart");
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-red-600 hover:bg-red-50 mt-1 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="mb-5 text-lg font-bold">Order summary</h2>
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
          <p className="mt-4 text-center text-xs text-gray-500">
            Cash on delivery · Pay when your food arrives
          </p>
        </aside>
      </div>
    </div>
  );
}
