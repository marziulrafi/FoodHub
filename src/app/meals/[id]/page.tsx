"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { useCartStore } from "@/stores/cart.store";
import { useMeal } from "@/hooks/useApi";
import { ErrorState } from "@/components/ui/ErrorState";
import { Badge, EmptyState, Skeleton, StarRating } from "@/components/ui";
import { Leaf, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

export default function MealDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const { data: meal, isLoading, error, refetch } = useMeal(id);
  const addItem = useCartStore((s) => s.addItem);
  const { data: session } = useSession();

  const role = (session?.user as { role?: string })?.role;

  const [adding, setAdding] = useState(false);

  const badges = useMemo(() => {
    const out: { text: string; kind: "vegan" | "vegetarian" }[] = [];
    if (meal?.isVegan) out.push({ text: "Vegan", kind: "vegan" });
    else if (meal?.isVegetarian) out.push({ text: "Veg", kind: "vegetarian" });
    return out;
  }, [meal?.isVegan, meal?.isVegetarian]);

  const handleAdd = async () => {
    if (adding) return;
    if (!session) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (role !== "CUSTOMER") {
      toast.error("Only customers can add items to cart");
      return;
    }
    if (!meal) return;
    setAdding(true);
    try {
      if (!meal.isAvailable) {
        toast.error("This meal is currently unavailable");
        return;
      }
      addItem(meal);
      toast.success(`${meal.title} added to cart!`);
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Skeleton className="w-full h-[320px] lg:h-[480px]" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-20 w-full md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="page-container py-8">
        <ErrorState error={error} retry={() => void refetch()} />
      </div>
    );

  if (!meal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <EmptyState
          icon="🍽️"
          title="Meal not found"
          description="The meal you are looking for doesn’t exist (or is unavailable)."
          action={
            <Link href="/meals" className="btn-primary">
              Back to meals
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container py-10">
      <Link
        href="/meals"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-primary-700"
      >
        ← Back to the menu
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div>
          {meal.image ? (
            <img
              src={meal.image}
              alt={meal.title}
              className="w-full h-[320px] lg:h-[480px] object-cover rounded-2xl bg-gray-50"
            />
          ) : (
            <div className="w-full h-[320px] lg:h-[480px] rounded-2xl bg-gray-100 flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}
          {badges.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    b.kind === "vegan"
                      ? "bg-green-500 text-white"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  <Leaf size={14} className="inline mr-1" /> {b.text}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{meal.title}</h1>
              {meal.provider?.restaurantName && (
                <p className="text-gray-500 mt-2 text-sm">
                  From{" "}
                  <Link
                    href={`/providers/${meal.providerId}`}
                    className="font-semibold text-primary-700 hover:underline"
                  >
                    {meal.provider.restaurantName}
                  </Link>
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-primary-600 font-bold text-3xl">
                ৳{meal.price.toFixed(0)}
              </div>
              {meal.category?.name && (
                <span className="mt-2 inline-block text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {meal.category.name}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-700 mt-5 leading-relaxed">
            {meal.description}
          </p>

          <div className="mt-6 card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Availability</span>
              <Badge
                label={meal.isAvailable ? "Available to order" : "Unavailable"}
                variant={meal.isAvailable ? "ACTIVE" : "SUSPENDED"}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!meal.isAvailable || adding}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              {adding
                ? "Adding..."
                : meal.isAvailable
                  ? "Add to Cart"
                  : "Unavailable"}
            </button>

            <div className="text-xs text-gray-500 mt-3">
              Add to cart to checkout when ready.
            </div>
          </div>
        </div>
      </div>
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="section-title mb-5">From the table</h2>
        {meal.reviews?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {meal.reviews.map((review) => (
              <article key={review.id} className="card p-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-semibold">
                    {review.customer?.name || "Customer"}
                  </h3>
                  <StarRating rating={review.rating} readonly />
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {review.comment}
                  </p>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No reviews yet. Customers can leave a review after their order is
            delivered.
          </p>
        )}
      </section>
    </div>
  );
}
