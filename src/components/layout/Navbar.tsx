"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  LogOut,
  Menu,
  X,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useCartStore } from "@/stores/cart.store";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const cartCount = useCartStore((s) => s.count());
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };
  const role = (session?.user as { role?: string })?.role;
  const accountHref =
    role === "PROVIDER"
      ? "/provider/profile"
      : role === "ADMIN"
        ? "/admin"
        : "/profile";
  const links = [
    { href: "/meals", label: "Browse meals" },
    { href: "/providers", label: "Restaurants" },
    { href: "/about", label: "Our story" },
  ];
  if (role === "CUSTOMER") links.push({ href: "/orders", label: "My orders" });
  if (role === "PROVIDER")
    links.push({ href: "/provider/dashboard", label: "Dashboard" });
  if (role === "ADMIN") links.push({ href: "/admin", label: "Admin panel" });
  const navLinks = links.map(({ href, label }) => (
    <Link
      key={href}
      href={href}
      className="nav-link"
      aria-current={
        pathname === href ||
        (href !== "/admin" && pathname.startsWith(href + "/"))
          ? "page"
          : undefined
      }
      onClick={() => setMenuOpen(false)}
    >
      {label}
    </Link>
  ));
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/95 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="page-container">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="FoodHub home"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <UtensilsCrossed size={21} />
            </span>
            Food<span className="-ml-2.5 text-primary-600">Hub</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">{navLinks}</div>
          <div className="flex items-center gap-2 sm:gap-3">
            {role === "CUSTOMER" && (
              <Link
                href="/cart"
                className="icon-button relative"
                aria-label={`Cart, ${mounted ? cartCount : 0} items`}
              >
                <ShoppingCart size={20} />
                {mounted && cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="reveal absolute -right-1 -top-1 rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {session ? (
              <div className="hidden lg:block">
                <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 p-2 text-sm transition-colors hover:border-primary-200">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-800">
                        {session.user.name?.charAt(0)}
                      </span>
                      <span className="max-w-28 truncate">
                        {session.user.name}
                      </span>
                      <ChevronDown
                        size={15}
                        className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <p className="truncate border-b border-gray-100 px-3 py-3 text-xs text-gray-500">
                      {session.user.email}
                    </p>
                    <DropdownMenuItem asChild>
                      <Link href={accountHref}>
                        {role === "ADMIN" ? "Administration" : "My profile"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => void handleSignOut()}
                      className="text-red-700"
                    >
                      <LogOut size={16} /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              !isPending && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="nav-link">
                    Log in
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Get started
                  </Link>
                </div>
              )
            )}
            <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
              <DialogTrigger asChild>
                <button
                  className="icon-button lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu size={21} />
                </button>
              </DialogTrigger>
              <DialogContent sheet aria-describedby={undefined}>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <DialogTitle className="text-xl font-bold">
                    Explore FoodHub
                  </DialogTitle>
                  <DialogClose asChild>
                    <button
                      className="icon-button"
                      aria-label="Close navigation"
                    >
                      <X size={20} />
                    </button>
                  </DialogClose>
                </div>
                <div
                  id="mobile-navigation"
                  className="grid gap-1 border-t border-gray-100 py-4"
                >
                  {navLinks}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/contact"
                    className="nav-link"
                  >
                    Contact
                  </Link>
                  {session ? (
                    <>
                      <Link
                        onClick={() => setMenuOpen(false)}
                        href={accountHref}
                        className="nav-link"
                      >
                        My account
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="nav-link text-left text-red-700"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-3 pt-3">
                      <Link
                        onClick={() => setMenuOpen(false)}
                        href="/login"
                        className="btn-secondary flex-1"
                      >
                        Log in
                      </Link>
                      <Link
                        onClick={() => setMenuOpen(false)}
                        href="/register"
                        className="btn-primary flex-1"
                      >
                        Get started
                      </Link>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>
    </header>
  );
}
