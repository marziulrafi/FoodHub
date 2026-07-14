"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import type { Role } from "@/types";

const demoCredentials: Record<Role, { email: string; password: string; title: string }> = {
  CUSTOMER: {
    email: "demo.customer@foodhub.com",
    password: "demoCustomer123",
    title: "Customer",
  },
  PROVIDER: {
    email: "demo.provider@foodhub.com",
    password: "demoProvider123",
    title: "Provider",
  },
  ADMIN: {
    email: "demo.admin@foodhub.com",
    password: "demoAdmin123",
    title: "Admin",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: "/",
      });
      if (error) throw new Error(error.message);
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role: Role) => {
    const credentials = demoCredentials[role];
    setForm({ email: credentials.email, password: credentials.password });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍱</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your FoodHub account</p>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick demo access</p>
            <div className="grid gap-2">
              {(Object.keys(demoCredentials) as Role[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillCredentials(role)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-primary-400 hover:bg-primary-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{demoCredentials[role].title}</p>
                      <p className="text-sm text-gray-500">Auto-fill email and password fields</p>
                    </div>
                    <span className="text-sm font-medium text-primary-600">Fill</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs uppercase tracking-wide text-gray-400">or use email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                onKeyDown={(e) => {
                  if (e.key === "Tab" && !form.email && !form.password) {
                    fillCredentials("CUSTOMER");
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
