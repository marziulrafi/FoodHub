"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ChefHat } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Meals" },
  { href: "/providers", label: "Providers" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Food<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart">
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition hover:bg-muted">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  0
                </span>
              </button>
            </Link>

            <Link href="/login">
              <button className="h-9 rounded-md border-2 border-primary px-4 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                Login
              </button>
            </Link>

            <Link href="/register">
              <button className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="section-container py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 font-medium transition-colors ${
                    isActive(link.href) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex gap-3 pt-4 border-t border-border">
                <Link href="/login" className="flex-1">
                  <button className="w-full h-11 rounded-lg border-2 border-primary font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                    Login
                  </button>
                </Link>

                <Link href="/register" className="flex-1">
                  <button className="w-full h-11 rounded-lg bg-primary font-semibold text-primary-foreground transition hover:bg-primary/90">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
