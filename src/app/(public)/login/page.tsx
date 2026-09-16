"use client";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
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
      setFormError(
        err instanceof Error ? err.message : "Unable to submit the form.",
      );
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 bg-primary-50/40 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍱</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your FoodHub account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}
            <div>
              <label
                htmlFor="field-1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="field-1"
                type="email"
                required
                className="input"
                placeholder="Enter your email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="field-2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <PasswordInput
                id="field-2"
                autoComplete="current-password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
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
