"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, X, ChefHat } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useCartStore } from "@/stores/cart.store";
import toast from "react-hot-toast";

export function Navbar() {
  const { data: session } = useSession();
  const cartCount = useCartStore((s) => s.count());
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  const role = (session?.user as { role?: string })?.role;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary-600"
          >
            <span className="text-2xl">🍱</span>
            <span>FoodHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/meals"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Browse Meals
            </Link>
            <Link
              href="/providers"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Restaurants
            </Link>

            {session ? (
              <>
                {role === "customer" && (
                  <>
                    <Link
                      href="/orders"
                      className="text-gray-600 hover:text-primary-600"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/cart"
                      className="relative text-gray-600 hover:text-primary-600"
                    >
                      <ShoppingCart size={22} />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {role === "provider" && (
                  <Link
                    href="/provider/dashboard"
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600"
                  >
                    <ChefHat size={18} /> Dashboard
                  </Link>
                )}
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-primary-600"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600"
                  >
                    <User size={18} />
                    <span className="text-sm">{session.user.name}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="btn-secondary text-sm py-1.5">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-1.5">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="/meals"
            className="block text-gray-700 py-2"
            onClick={() => setMenuOpen(false)}
          >
            Browse Meals
          </Link>
          <Link
            href="/providers"
            className="block text-gray-700 py-2"
            onClick={() => setMenuOpen(false)}
          >
            Restaurants
          </Link>
          {session ? (
            <>
              {role === "customer" && (
                <>
                  <Link
                    href="/orders"
                    className="block text-gray-700 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/cart"
                    className="block text-gray-700 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Cart ({cartCount})
                  </Link>
                </>
              )}
              {role === "provider" && (
                <Link
                  href="/provider/dashboard"
                  className="block text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Provider Dashboard
                </Link>
              )}
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="block text-gray-700 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="block text-red-500 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-gray-700 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-gray-700 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
