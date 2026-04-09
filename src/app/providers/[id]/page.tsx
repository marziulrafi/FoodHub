"use client";

import Link from "next/link";
import { useProvider } from "@/hooks/useApi";
import { EmptyState, Skeleton } from "@/components/ui";
import { MealCard } from "@/components/features/meals/MealCard";
import { use } from "react";

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: provider, isLoading, error } = useProvider(id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Skeleton className="h-[180px]" />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <EmptyState
          icon="🏪"
          title="Provider not found"
          description="This restaurant doesn’t exist (or is currently suspended)."
          action={
            <Link href="/providers" className="btn-primary">
              Back to providers
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {provider.restaurantName}
            </h1>
            <p className="text-gray-500 mt-1">
              {provider.description?.slice(0, 200) || "Fresh & delicious"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {provider.isVerified ? "Verified restaurant" : "Unverified restaurant"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Rating</div>
            <div className="text-lg font-bold text-gray-900">
              ★ {provider.rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Total meals: {(provider.meals?.length || 0).toString()}
            </div>
          </div>
        </div>
      </div>

      {provider.meals && provider.meals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {provider.meals.map((meal: any) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🍽️"
          title="No meals available"
          description="This restaurant doesn’t have any available meals right now."
        />
      )}
    </div>
  );
}

