"use client";
import { ErrorState } from "@/components/ui/ErrorState";

import Link from "next/link";
import { useProvider } from "@/hooks/useApi";
import { EmptyState, Skeleton, StarRating } from "@/components/ui";
import { MealCard } from "@/components/features/meals/MealCard";
import { useParams } from "next/navigation";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: provider, isLoading, error, refetch } = useProvider(id);

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

  if (error)
    return (
      <div className="page-container py-8">
        <ErrorState error={error} retry={() => void refetch()} />
      </div>
    );
  if (!provider) {
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
      <div className="card overflow-hidden mb-8">
        {provider.banner && (
          <img
            src={provider.banner}
            alt=""
            className="h-48 sm:h-64 w-full object-cover"
          />
        )}
        <div className="p-6 sm:p-8">
          {provider.logo && (
            <img
              src={provider.logo}
              alt=""
              width={80}
              height={80}
              className="mb-5 h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-sm"
            />
          )}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {provider.restaurantName}
              </h1>
              <p className="text-gray-500 mt-1">
                {provider.cuisineTypes?.join(" · ") || "Fresh & delicious"}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {provider.isVerified
                  ? "Verified restaurant"
                  : "Unverified restaurant"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Rating</div>
              <div className="flex items-center justify-end gap-2">
                <StarRating rating={provider.rating} readonly />
                <span className="text-lg font-bold text-gray-900">
                  {provider.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {provider.rating > 0
                  ? `${provider.rating.toFixed(1)} average rating`
                  : "No reviews yet"}
                {provider.totalReviews
                  ? ` · ${provider.totalReviews} reviews`
                  : ""}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Total meals: {(provider.meals?.length || 0).toString()}
              </div>
            </div>
          </div>
          {provider.description && (
            <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-600">
              {provider.description}
            </p>
          )}
          {provider.address && (
            <p className="mt-3 text-sm text-gray-500">
              {provider.address}
              {provider.city ? `, ${provider.city}` : ""}
            </p>
          )}
        </div>
      </div>
      <h2 className="section-title mb-6">The menu</h2>
      {provider.meals && provider.meals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {provider.meals.map((meal) => (
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
