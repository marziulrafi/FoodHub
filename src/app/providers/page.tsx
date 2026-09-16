"use client";

import { ProviderCard } from "@/components/features/ProviderCard";
import { ErrorState } from "@/components/ui/ErrorState";
import Link from "next/link";
import { useProviders } from "@/hooks/useApi";
import { ProviderCardSkeleton } from "@/components/ui/CollectionSkeleton";
import { EmptyState } from "@/components/ui";

export default function ProvidersPage() {
  const { data: providers, isLoading, error, refetch } = useProviders();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
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

  if (!providers || providers.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <EmptyState
          icon="🍽️"
          title="No providers found"
          description="Try again later."
          action={
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container py-10">
      <p className="eyebrow mb-3">Made nearby, enjoyed here</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Discover local kitchens
      </h1>
      <p className="mb-8 text-gray-500">
        Find a restaurant and explore what’s cooking.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
}
