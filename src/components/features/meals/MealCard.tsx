"use client";

import Link from "next/link";
import { ShoppingCart, Leaf } from "lucide-react";
import type { Meal } from "@/types";
import { useCartStore } from "@/stores/cart.store";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export function MealCard({ meal }: { meal: Meal }) {
  const addItem = useCartStore((s) => s.addItem);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (role !== "customer") {
      toast.error("Only customers can add to cart");
      return;
    }
    addItem(meal);
    toast.success(`${meal.name} added to cart!`);
  };

  return (
    <Link href={`/meals/${meal.id}`}>
      <div className="card overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {meal.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}
          {!meal.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Unavailable</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            {meal.isVegan && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Leaf size={10} /> Vegan
              </span>
            )}
            {meal.isVegetarian && !meal.isVegan && (
              <span className="bg-green-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Leaf size={10} /> Veg
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {meal.name}
              </h3>
              {meal.provider && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {meal.provider.restaurantName}
                </p>
              )}
              {meal.category && (
                <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {meal.category.name}
                </span>
              )}
            </div>
            <span className="text-primary-600 font-bold text-lg ml-2">
              ৳{parseFloat(meal.price).toFixed(0)}
            </span>
          </div>
          {meal.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {meal.description}
            </p>
          )}
          <button
            onClick={handleAddToCart}
            disabled={!meal.isAvailable}
            className="mt-3 w-full btn-primary flex items-center justify-center gap-2 text-sm py-2"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
