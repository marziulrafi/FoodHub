"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMeals, useCategories } from "@/hooks/useApi";
import { MealCard } from "@/components/features/meals/MealCard";
import { EmptyState, Skeleton } from "@/components/ui";
import { ArrowRight, Search } from "lucide-react";

function MealsPageInner() {
  const searchParams = useSearchParams();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const filters = useMemo(() => {
    const next: Record<string, string> = { limit: "12" };
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (search) next.search = search;
    if (category) next.category = category;

    return next;
  }, [searchParams]);

  const { data: meals, isLoading, error } = useMeals(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Meals</h1>
          <p className="text-gray-500 mt-1">
            Discover something delicious from top restaurants
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-xl px-4 py-2">
          <Search size={16} />
          <span>
            {searchParams.get("search")
              ? `Search: ${searchParams.get("search")}`
              : "Use the search bar on Home to find meals"}
          </span>
        </div>
      </div>

      <div className="mb-6">
        {categoriesLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-28 h-11" />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/meals?category=${cat.id}`}
                className="flex-shrink-0 bg-white border border-gray-200 hover:border-primary-400 hover:bg-primary-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[320px]" />
          ))}
        </div>
      ) : error ? (
        <div className="card p-6 text-red-600 bg-red-50 border border-red-100">
          Failed to load meals.
        </div>
      ) : !meals || meals.length === 0 ? (
        <EmptyState
          icon="🍱"
          title="No meals found"
          description="Try adjusting your filters or search query."
          action={
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}

      <div className="mt-10 text-center text-sm text-gray-600">
        Want restaurant suggestions?{" "}
        <Link href="/providers" className="text-primary-600 hover:underline">
          Browse providers <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[320px]" />
            ))}
          </div>
        </div>
      }
    >
      <MealsPageInner />
    </Suspense>
  );
}

