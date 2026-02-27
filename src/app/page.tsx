"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMeals, useCategories, useProviders } from "@/hooks/useApi";
import { MealCard } from "@/components/features/meals/MealCard";
import { Spinner } from "@/components/ui";
import { ArrowRight, Search } from "lucide-react";

export default function HomePage() {
  const { data: meals, isLoading: mealsLoading } = useMeals({ limit: "8" });
  const { data: categories } = useCategories();
  const { data: providers } = useProviders();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/meals?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover & Order <br />
            <span className="text-primary-200">Delicious Meals</span>
          </h1>
          <p className="text-primary-100 text-lg mb-8">
            Fresh food from the best restaurants, delivered to your door
          </p>
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-lg mx-auto"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for biryani, pizza, burgers..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <Search size={18} /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Browse by Category
            </h2>
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
          </div>
        </section>
      )}

      {/* Featured Meals */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Meals</h2>
            <Link
              href="/meals"
              className="text-primary-600 hover:underline flex items-center gap-1 text-sm"
            >
              See all <ArrowRight size={16} />
            </Link>
          </div>
          {mealsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {meals?.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Restaurants */}
      {providers && providers.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Restaurants
              </h2>
              <Link
                href="/providers"
                className="text-primary-600 hover:underline flex items-center gap-1 text-sm"
              >
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {providers.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/providers/${p.id}`}>
                  <div className="card p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {p.restaurantName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {p.description?.slice(0, 60) || "Fresh & delicious"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span
                        className={`text-xs font-medium ${p.isOpen ? "text-green-600" : "text-red-500"}`}
                      >
                        ● {p.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
