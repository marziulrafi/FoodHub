"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMeals, useCategories, useProviders } from "@/hooks/useApi";
import { RevealSection } from "@/components/ui/RevealSection";
import { MealCardSkeleton } from "@/components/ui/CollectionSkeleton";
import { MealCard } from "@/components/features/meals/MealCard";
import { ProviderCard } from "@/components/features/ProviderCard";
import { EmptyState, Skeleton } from "@/components/ui";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  ArrowRight,
  Search,
  ShoppingBag,
  CookingPot,
  CheckCheck,
  UtensilsCrossed,
} from "lucide-react";

export default function HomePage() {
  const {
    data,
    isLoading: mealsLoading,
    error: mealsError,
    refetch,
  } = useMeals({ limit: "4" });
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: retryCategories,
  } = useCategories();
  const { data: providers } = useProviders();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/meals?search=${encodeURIComponent(search)}`);
  };
  return (
    <div>
      <section className="page-container py-6 sm:py-10">
        <div className="hero-surface relative isolate overflow-hidden rounded-[2rem] bg-[#eee9df] lg:min-h-[530px]">
          <div className="grid lg:grid-cols-[1.05fr_1fr]">
            <div className="reveal relative z-10 px-6 py-10 sm:p-12 lg:py-16">
              <p className="eyebrow mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" /> A
                little local. A lot delicious.
              </p>
              <h1 className="max-w-xl text-[2.8rem] font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-6xl">
                Good food.
                <br />
                Great mood.
                <br />
                <span className="text-primary-600">Delivered.</span>
              </h1>
              <p className="mt-6 max-w-sm text-base leading-7 text-gray-600">
                From comfort-food cravings to something new. Discover meals from
                local kitchens, all in one place.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/meals" className="btn-primary">
                  Explore meals <ArrowRight size={17} />
                </Link>
                <Link
                  href="/providers"
                  className="btn-secondary bg-transparent"
                >
                  Meet the kitchens
                </Link>
              </div>
              <p className="mt-7 flex items-center gap-2 text-xs font-medium text-gray-600">
                <ShoppingBag size={15} /> Choose your meal. Pay on delivery.
              </p>
            </div>
            <div className="hero-photo relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
              <Image
                src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=1200&auto=format&fit=crop&q=85"
                alt="A spread of freshly prepared food, ready to share"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="hero-note absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur-md sm:right-auto">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <UtensilsCrossed size={22} />
                </span>
                <div>
                  <p className="text-sm font-bold">
                    Your next favorite is here
                  </p>
                  <p className="mt-0.5 text-xs text-gray-600">
                    Explore the FoodHub menu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSearch}
          className="search-surface relative mx-auto mt-5 flex max-w-3xl items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:gap-3 sm:p-3"
        >
          <Search className="ml-2 shrink-0 text-gray-400" size={20} />
          <label htmlFor="home-search" className="sr-only">
            Find a meal
          </label>
          <input
            id="home-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What are you craving?"
            className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none"
          />
          <button className="btn-primary" type="submit">
            Find food
          </button>
        </form>
      </section>
      <RevealSection className="page-container py-8 sm:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Follow your cravings</p>
            <h2 className="section-title">What sounds good?</h2>
          </div>
          <Link
            href="/meals"
            className="shrink-0 text-sm font-semibold text-primary-700"
          >
            All meals →
          </Link>
        </div>
        {categoriesLoading ? (
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 flex-1" />
            ))}
          </div>
        ) : categoriesError ? (
          <ErrorState
            error={categoriesError}
            retry={() => void retryCategories()}
          />
        ) : categories?.length ? (
          <div className="flex gap-3 overflow-x-auto pb-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/meals?category=${cat.id}`}
                className="category-card reveal group flex min-w-40 shrink-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-5 transition duration-200 hover:border-primary-300 hover:bg-primary-50"
              >
                {cat.image && /^https?:\/\//.test(cat.image) ? (
                  <img
                    src={cat.image}
                    alt=""
                    loading="lazy"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-lg object-cover"
                  />
                ) : (
                  <UtensilsCrossed size={22} className="text-primary-600" />
                )}
                <span className="text-sm font-semibold">{cat.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
            Our kitchens are getting their menus ready. Explore all meals to see
            what’s available.
          </p>
        )}
      </RevealSection>
      <RevealSection className="page-container py-8 sm:py-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">On the menu</p>
            <h2 className="section-title">A delicious place to start</h2>
            <p className="mt-2 text-sm text-gray-500">
              Explore dishes from the FoodHub kitchen community.
            </p>
          </div>
          <Link
            href="/meals"
            className="shrink-0 text-sm font-semibold text-primary-700"
          >
            View all →
          </Link>
        </div>
        {mealsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : mealsError ? (
          <ErrorState error={mealsError} retry={() => void refetch()} />
        ) : data?.meals?.length ? (
          <div className="meal-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<UtensilsCrossed />}
            title="The menu is on its way"
            description="Check back soon to discover meals from our providers."
          />
        )}
      </RevealSection>
      {providers && providers.length > 0 && (
        <RevealSection className="page-container py-8 sm:py-12">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Behind every good meal</p>
              <h2 className="section-title">Meet your local kitchens</h2>
            </div>
            <Link
              href="/providers"
              className="shrink-0 text-sm font-semibold text-primary-700"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.slice(0, 3).map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </RevealSection>
      )}
      <RevealSection className="my-8 border-y border-gray-200 bg-white py-14 sm:py-20">
        <div className="page-container">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3">Less effort. More enjoyment.</p>
            <h2 className="section-title">From our kitchens to your table</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Search,
                title: "Discover",
                desc: "Browse local menus and find a meal that hits the spot.",
              },
              {
                icon: ShoppingBag,
                title: "Order",
                desc: "Choose your dishes, add your address, and pay on delivery.",
              },
              {
                icon: CookingPot,
                title: "Track",
                desc: "Follow your order from placed to preparing, ready, and delivered.",
              },
              {
                icon: CheckCheck,
                title: "Enjoy",
                desc: "Make time for a good meal. Share your experience with a review.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                    <Icon size={24} />
                  </span>
                  <span className="text-3xl font-light text-gray-200">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>
      <RevealSection className="page-container py-8 pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#283d31] p-8 sm:p-12 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#d7e5cb]">
              For the love of good food
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Your kitchen. A new community.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">
              Share what you do best. Register your restaurant and start your
              FoodHub journey.
            </p>
          </div>
          <Link href="/register" className="btn-secondary shrink-0">
            Become a provider <ArrowRight size={17} />
          </Link>
        </div>
      </RevealSection>
    </div>
  );
}
