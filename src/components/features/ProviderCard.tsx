import Link from "next/link";
import { MapPin, Store, Star, ArrowUpRight } from "lucide-react";
import type { ProviderProfile } from "@/types";
export function ProviderCard({ provider: p }: { provider: ProviderProfile }) {
  return (
    <Link
      href={`/providers/${p.id}`}
      className="card meal-card reveal group block p-5"
    >
      {p.banner && (
        <img
          src={p.banner}
          alt=""
          loading="lazy"
          className="mb-5 h-36 w-full rounded-xl object-cover"
        />
      )}
      <div className="flex items-center gap-4">
        {p.logo ? (
          <img
            src={p.logo}
            alt=""
            loading="lazy"
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Store size={24} />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-bold">{p.restaurantName}</h3>
          <p className="mt-1 text-xs text-gray-500">
            {p.cuisineTypes?.join(" · ")}
          </p>
        </div>
      </div>
      {(p.city || p.address) && (
        <p className="mt-4 flex items-start gap-2 text-sm text-gray-500">
          <MapPin size={15} className="mt-0.5 shrink-0" />
          {p.city || p.address}
        </p>
      )}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-gray-700">
          <Star size={14} className="text-primary-600" />
          {p.rating > 0 ? p.rating.toFixed(1) : "No reviews yet"}
        </span>
        <span className="flex items-center gap-1 font-semibold text-primary-700">
          View menu <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </span>
      </div>
    </Link>
  );
}
