"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMeals, useCategories, useProviders } from "@/hooks/useApi";
import { MealCard } from "@/components/features/meals/MealCard";
import { Spinner } from "@/components/ui";
import { ArrowRight, Search, Star, Clock, ShieldCheck, Bike } from "lucide-react";

export default function HomePage() {
  const { data: meals, isLoading: mealsLoading } = useMeals({ limit: "4" });
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
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
            <span>🔥</span>
            <span>Free delivery on your first order</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover &amp; Order <br />
            <span className="text-primary-200">Delicious Meals</span>
          </h1>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Fresh food from the best restaurants in your city — delivered fast to your door
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for biryani, pizza, burgers..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Search size={18} /> Search
            </button>
          </form>

          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-primary-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div>Meals Available</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div>Restaurants</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10k+</div>
              <div>Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
              <Link href="/meals" className="text-primary-600 hover:underline flex items-center gap-1 text-sm">
                All meals <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/meals?category=${cat.id}`}
                  className="flex-shrink-0 bg-white border border-gray-200 hover:border-primary-400 hover:bg-primary-50 rounded-xl px-5 py-3 text-sm font-medium text-gray-700 transition-all shadow-sm hover:shadow-md"
                >
                  {cat.image && <span className="mr-1">{cat.image}</span>}
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Meals</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked favorites from our top restaurants</p>
            </div>
            <Link href="/meals" className="text-primary-600 hover:underline flex items-center gap-1 text-sm">
              See all <ArrowRight size={16} />
            </Link>
          </div>
          {mealsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : meals && meals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🍽️</div>
              <p>No meals available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {providers && providers.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top Restaurants</h2>
                <p className="text-gray-500 text-sm mt-1">Approved and trusted by our community</p>
              </div>
              <Link href="/providers" className="text-primary-600 hover:underline flex items-center gap-1 text-sm">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {providers.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/providers/${p.id}`}>
                  <div className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                    <div className="flex items-center gap-3">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.restaurantName}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                          🍽️
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.restaurantName}</h3>
                        <p className="text-sm text-gray-500">
                          {p.cuisineTypes?.slice(0, 60)}
                        </p>
                        {p.city && (
                          <p className="text-xs text-gray-400 mt-0.5">📍 {p.city}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500 text-sm">
                        <Star size={14} fill="currentColor" />
                        <span className="font-medium">{p.rating?.toFixed(1) || "New"}</span>
                      </div>
                      <span className="text-xs text-primary-600 font-medium">View Menu →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-500 mb-12">Order your favorite food in 3 simple steps</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: <Search size={32} className="text-primary-500" />,
                step: "01",
                title: "Browse & Choose",
                desc: "Explore hundreds of meals from verified restaurants. Filter by category, price, or cuisine.",
              },
              {
                icon: <ShieldCheck size={32} className="text-primary-500" />,
                step: "02",
                title: "Place Your Order",
                desc: "Add items to your cart and checkout securely. Cash on delivery — no hidden fees.",
              },
              {
                icon: <Bike size={32} className="text-primary-500" />,
                step: "03",
                title: "Fast Delivery",
                desc: "Track your order in real time. Fresh food delivered hot to your doorstep.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/meals" className="btn-primary px-8 py-3">
              Order Now
            </Link>
            <Link href="/register" className="btn-secondary px-8 py-3">
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
                <span>🍱</span> FoodHub
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Connecting hungry customers with the best local restaurants. Fresh food, fast delivery.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/meals" className="hover:text-white transition-colors">Browse Meals</Link></li>
                <li><Link href="/providers" className="hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">For Providers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Register Restaurant</Link></li>
                <li><Link href="/provider/dashboard" className="hover:text-white transition-colors">Provider Dashboard</Link></li>
                <li><Link href="/provider/menu" className="hover:text-white transition-colors">Manage Menu</Link></li>
                <li><Link href="/provider/orders" className="hover:text-white transition-colors">View Orders</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock size={14} />
              <span>Mon – Sun: 8:00 AM – 11:00 PM</span>
            </div>
            <p>© {new Date().getFullYear()} FoodHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
