"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" as "customer" | "provider",
    restaurantName: "",
    restaurantAddress: "",
    restaurantPhone: "",
    city: "",
    description: "",
    logo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role.toUpperCase(),
      };

      if (form.role === "provider") {
        payload.restaurantName = form.restaurantName || undefined;
        payload.address = form.restaurantAddress || undefined;
        payload.phone = form.restaurantPhone || undefined;
        payload.city = form.city || undefined;
        payload.description = form.description || undefined;
        payload.logo = form.logo || undefined;
      }

      await api.post("/api/v1/auth/register", payload);

      if (form.role === "provider") {
        setShowPendingModal(true);
        toast.success(
          "Thank you for registering! Your restaurant is under review by the admin. You can still login and manage your menu while pending."
        );
      } else {
        toast.success("Account created! Please login to continue.");
        router.push("/login");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍱</div>
          <h1 className="text-2xl font-bold text-gray-900">Join FoodHub</h1>
          <p className="text-gray-500 mt-1">Create your account to get started</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {(["customer", "provider"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: r }))}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all capitalize ${form.role === r
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {r === "customer" ? "🛒 Customer" : "🍳 Provider"}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>

            {form.role === "provider" && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Tasty Biryani House"
                    value={form.restaurantName}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        restaurantName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Address *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="House 12, Road 3, Dhanmondi"
                    value={form.restaurantAddress}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        restaurantAddress: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="input"
                    placeholder="+880 1700 000000"
                    value={form.restaurantPhone}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        restaurantPhone: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City (optional)
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Dhaka"
                    value={form.city}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        city: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    className="input resize-none"
                    rows={3}
                    placeholder="Fresh, flavorful meals made with care..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL (optional)
                  </label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://example.com/logo.png"
                    value={form.logo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, logo: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                className="input"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {showPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <div className="text-4xl">⏳</div>
                <h2 className="text-2xl font-bold mt-3">Verification Pending</h2>
              </div>
              <p className="text-gray-600">
                Thank you for registering! Your restaurant is currently under review by the Admin.
              </p>
              <p className="text-gray-600">
                You cannot receive orders or add meals until you are approved. Please check back later.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowPendingModal(false);
                  router.push("/login");
                }}
                className="btn-primary w-full py-3"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
