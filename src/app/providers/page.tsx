"use client";

import Link from "next/link";
import { useProviders } from "@/hooks/useApi";
import { EmptyState, Skeleton } from "@/components/ui";

export default function ProvidersPage() {
  const { data: providers, isLoading, error } = useProviders();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-[170px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !providers || providers.length === 0) {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => (
          <Link key={p.id} href={`/providers/${p.id}`}>
            <div className="card p-5 hover:shadow-md transition-shadow h-full">
              <div className="flex items-center gap-3">
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={p.restaurantName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    🍽️
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {p.restaurantName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {p.description?.slice(0, 80) || "Fresh & delicious"}
                  </p>
                  {p.address && (
                    <p className="text-xs text-gray-400 mt-1">{p.address}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    p.isVerified ? "text-green-600" : "text-red-500"
                  }`}
                >
                  ● {p.isVerified ? "Verified" : "Unverified"}
                </span>
                <span className="text-xs text-gray-500">View Menu →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

