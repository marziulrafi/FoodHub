"use client";

import Link from "next/link";
import { useAdminStats } from "@/hooks/useApi";
import { StatCard, Spinner } from "@/components/ui";
import { Users, ShoppingBag, DollarSign, UtensilsCrossed } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-500 mb-8">Platform overview and management</p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={(stats as Record<string, number>)?.totalUsers ?? 0} icon={<Users />} color="blue" />
          <StatCard label="Total Orders" value={(stats as Record<string, number>)?.totalOrders ?? 0} icon={<ShoppingBag />} color="primary" />
          <StatCard label="Revenue (৳)" value={parseFloat((stats as Record<string, string>)?.revenue || "0").toFixed(0)} icon={<DollarSign />} color="green" />
          <StatCard label="Meals Listed" value={(stats as Record<string, number>)?.totalMeals ?? 0} icon={<UtensilsCrossed />} color="purple" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: "/admin/users", icon: "👥", label: "Manage Users", desc: "View, suspend, or activate users" },
          { to: "/admin/orders", icon: "📦", label: "All Orders", desc: "Monitor all platform orders" },
          { to: "/admin/categories", icon: "🏷️", label: "Categories", desc: "Manage food categories" },
        ].map((item) => (
          <Link key={item.to} href={item.to}>
            <div className="card p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900">{item.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
