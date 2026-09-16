import Link from "next/link";
import { UtensilsCrossed, ArrowUpRight } from "lucide-react";
export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-[#f2f0ea]">
      <div className="page-container py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold"
            >
              <UtensilsCrossed className="text-primary-600" size={22} />
              FoodHub
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-600">
              Good food. Local kitchens. One happy table.
              <br />
              Find your next favorite meal on FoodHub.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold">Explore</h2>
            <div className="mt-4 grid gap-3 text-sm text-gray-600">
              {[
                ["/meals", "Browse meals"],
                ["/providers", "Restaurants"],
                ["/about", "Our story"],
                ["/contact", "Contact us"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="hover:text-primary-700">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">Your next chapter</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Bring your restaurant to FoodHub.
            </p>
            <Link
              href="/register"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700"
            >
              Become a provider <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/faq"
              className="mt-4 block text-sm text-gray-600 hover:text-primary-700"
            >
              Help & FAQ
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-gray-300/60 pt-6 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} FoodHub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
