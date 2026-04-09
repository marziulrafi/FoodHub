"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useMyProviderProfile, useUpdateProviderProfile } from "@/hooks/useApi";
import { LoadingScreen } from "@/components/ui";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ProviderProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, error } = useMyProviderProfile();
  const updateProfile = useUpdateProviderProfile();

  const [form, setForm] = useState({
    restaurantName: "",
    description: "",
    logo: "",
    banner: "",
    address: "",
    city: "",
    phone: "",
    cuisineTypes: "",
  });

  useEffect(() => {
    if (!profile) return;

    setForm({
      restaurantName: profile.restaurantName || "",
      description: profile.description || "",
      logo: profile.logo || "",
      banner: profile.banner || "",
      address: profile.address || "",
      city: profile.city || "",
      phone: profile.phone || "",
      cuisineTypes: Array.isArray(profile.cuisineTypes)
        ? profile.cuisineTypes.join(", ")
        : "",
    });
  }, [profile]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateProfile.mutateAsync({
        restaurantName: form.restaurantName,
        description: form.description,
        logo: form.logo,
        banner: form.banner,
        address: form.address,
        city: form.city,
        phone: form.phone,
        cuisineTypes: form.cuisineTypes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      toast.success("Restaurant profile updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["provider", "me"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update profile.");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Provider Profile</h1>
          <p className="text-gray-500 mt-3">Unable to load your profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Profile</h1>
        <p className="text-gray-500 mt-2">
          Keep your restaurant details up to date so customers see the latest information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant name
            </label>
            <input
              className="input w-full"
              value={form.restaurantName}
              onChange={(e) => setForm((prev) => ({ ...prev, restaurantName: e.target.value }))}
              placeholder="My restaurant name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone number
            </label>
            <input
              className="input w-full"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="0123456789"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              className="input w-full"
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Dhaka"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              className="input w-full"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="House 12, Road 4, Block C"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            className="input w-full resize-none"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your restaurant, cuisine, and specialties."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              className="input w-full"
              value={form.logo}
              onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner URL</label>
            <input
              className="input w-full"
              value={form.banner}
              onChange={(e) => setForm((prev) => ({ ...prev, banner: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine types</label>
          <input
            className="input w-full"
            value={form.cuisineTypes}
            onChange={(e) => setForm((prev) => ({ ...prev, cuisineTypes: e.target.value }))}
            placeholder="Biryani, Chinese, Fast food"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate cuisine types with commas.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Your profile is saved instantly to the backend when you update.
            </p>
          </div>
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="btn-primary w-full sm:w-auto px-6 py-3"
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
