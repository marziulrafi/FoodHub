"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMeals, useCategories } from "@/hooks/useApi";
import { MealCardSkeleton } from "@/components/ui/CollectionSkeleton";
import { MealCard } from "@/components/features/meals/MealCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState, Skeleton } from "@/components/ui";
import { ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";

function MealsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoryError,
    refetch: retryCategories,
  } = useCategories();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 8;

  const filters = useMemo(() => {
    const next: Record<string, string> = {
      limit: pageSize.toString(),
      page: currentPage.toString(),
    };
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (search) next.search = search;
    if (category) next.category = category;

    return next;
  }, [searchParams, currentPage]);

  const { data, isLoading, error, refetch } = useMeals(filters);
  const meals = data?.meals || [];
  const meta = data?.meta;

  const totalPages = meta?.totalPages || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/meals?${params.toString()}`);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const handlePrevious = () => {
    if (hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="page-container py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow mb-3">Find your next favorite</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What’s on the menu?
          </h1>
          <p className="text-gray-500 mt-1">
            Discover something delicious from top restaurants
          </p>
        </div>
        <p className="text-sm text-gray-500" aria-live="polite">
          {meta
            ? `${meta.total} meals to explore`
            : "Prepared by local kitchens"}
        </p>
      </div>

      <form
        key={searchParams.toString()}
        className="card search-surface mb-5 flex flex-wrap items-end gap-3 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const params = new URLSearchParams(searchParams);
          const term = String(form.get("search") || "").trim();
          if (term) params.set("search", term);
          else params.delete("search");
          params.delete("page");
          router.push(`/meals?${params}`);
        }}
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="meal-search"
            className="mb-2 block text-xs font-semibold text-gray-600"
          >
            Search the menu
          </label>
          <input
            id="meal-search"
            name="search"
            className="input"
            defaultValue={searchParams.get("search") || ""}
            placeholder="Search for a dish…"
          />
        </div>
        <button className="btn-primary" type="submit">
          <Search size={17} />
          Search
        </button>
        {(searchParams.get("search") || searchParams.get("category")) && (
          <Link className="btn-secondary" href="/meals">
            Clear filters
          </Link>
        )}
      </form>
      <div className="mb-6">
        {categoriesLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-28 h-11" />
            ))}
          </div>
        ) : categoryError ? (
          <ErrorState
            error={categoryError}
            retry={() => void retryCategories()}
          />
        ) : categories && categories.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Link href="/meals" className="btn-secondary shrink-0">
              All meals
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/meals?${new URLSearchParams({ ...(searchParams.get("search") ? { search: searchParams.get("search")! } : {}), category: cat.id })}`}
                aria-current={
                  searchParams.get("category") === cat.id ? "page" : undefined
                }
                className="aria-[current=page]:bg-primary-50 aria-[current=page]:border-primary-500 aria-[current=page]:text-primary-700 flex-shrink-0 bg-white border border-gray-200 hover:border-primary-400 hover:bg-primary-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="meal-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <MealCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} retry={() => void refetch()} />
      ) : !meals || meals.length === 0 ? (
        <EmptyState
          icon="🍱"
          title="No meals found"
          description="Try adjusting your filters or search query."
          action={
            <Link href="/meals" className="btn-primary">
              Clear filters
            </Link>
          }
        />
      ) : (
        <>
          <div className="meal-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-6">
              {/* Info Text */}
              <p className="text-sm text-gray-600">
                Showing page{" "}
                <span className="font-semibold text-gray-900">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </p>

              {/* Previous Button */}
              <div className="flex max-w-full flex-wrap justify-center items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={!hasPrevPage}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    hasPrevPage
                      ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                      : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {/* First Page */}
                  {!paginationRange.includes(1) && totalPages > 0 && (
                    <>
                      <PageButton
                        page={1}
                        isActive={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                      />
                      {paginationRange[0] > 2 && (
                        <span className="text-gray-500 px-2">...</span>
                      )}
                    </>
                  )}

                  {/* Range Pages */}
                  {paginationRange.map((page) => (
                    <PageButton
                      key={page}
                      page={page}
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    />
                  ))}

                  {/* Last Page */}
                  {!paginationRange.includes(totalPages) &&
                    totalPages > 0 &&
                    paginationRange[paginationRange.length - 1] <
                      totalPages - 1 && (
                      <>
                        <span className="text-gray-500 px-2">...</span>
                        <PageButton
                          page={totalPages}
                          isActive={currentPage === totalPages}
                          onClick={() => handlePageChange(totalPages)}
                        />
                      </>
                    )}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={!hasNextPage}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    hasNextPage
                      ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                      : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
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

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-primary-600 text-white shadow-md hover:bg-primary-700"
          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </button>
  );
}

export default function MealsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <MealsPageInner />
    </Suspense>
  );
}
