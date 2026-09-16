"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  Users,
  Tags,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import type { ReactNode } from "react";
const navigation = {
  ADMIN: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/providers", label: "Provider approvals", icon: Store },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ],
  PROVIDER: [
    { href: "/provider/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/provider/menu", label: "My menu", icon: UtensilsCrossed },
    { href: "/provider/orders", label: "Incoming orders", icon: ShoppingBag },
    { href: "/provider/profile", label: "Restaurant profile", icon: Store },
  ],
};
export function DashboardShell({
  role,
  children,
}: {
  role: keyof typeof navigation;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const current = navigation[role].find((item) => item.href === pathname);
  return (
    <div className="page-container grid gap-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 lg:py-8">
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <div className="card dashboard-sidebar p-3 lg:p-4">
          <p className="eyebrow px-3 pb-4 pt-2">
            {role === "ADMIN" ? "Administration" : "Restaurant workspace"}
          </p>
          <nav
            aria-label={`${role.toLowerCase()} navigation`}
            className="flex gap-1 overflow-x-auto lg:grid"
          >
            {navigation[role].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="nav-link flex shrink-0 items-center gap-3 whitespace-nowrap"
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/meals"
            className="mt-8 hidden items-center gap-2 border-t border-gray-100 px-3 pt-5 text-sm text-gray-500 lg:flex"
          >
            View marketplace <ArrowUpRight size={15} />
          </Link>
        </div>
      </aside>
      <div className="min-w-0">
        <p className="mb-5 flex items-center gap-2 text-xs text-gray-500">
          FoodHub <span aria-hidden="true">/</span>{" "}
          {role === "ADMIN" ? "Admin" : "Provider"}{" "}
          <span aria-hidden="true">/</span>
          <span className="text-gray-800">{current?.label}</span>
        </p>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
export function CustomerNavigation() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Customer navigation"
      className="page-container flex gap-2 overflow-x-auto pt-5"
    >
      {[
        { href: "/orders", label: "My orders", icon: ShoppingBag },
        { href: "/profile", label: "My profile", icon: UserRound },
        { href: "/cart", label: "Cart", icon: UtensilsCrossed },
      ].map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="nav-link flex shrink-0 items-center gap-2"
          aria-current={pathname.startsWith(href) ? "page" : undefined}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
