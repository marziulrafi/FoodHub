"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Meal, Order, Category, ProviderProfile, User } from "@/types";

export const queryKeys = {
  meals: (filters?: object) => ["meals", filters],
  meal: (id: string) => ["meal", id],
  providers: () => ["providers"],
  provider: (id: string) => ["provider", id],
  categories: () => ["categories"],
  orders: () => ["orders"],
  order: (id: string) => ["order", id],
  providerMeals: () => ["provider", "meals"],
  providerOrders: () => ["provider", "orders"],
  providerStats: () => ["provider", "stats"],
  adminUsers: () => ["admin", "users"],
  adminOrders: () => ["admin", "orders"],
  adminStats: () => ["admin", "stats"],
};

// ─── Meals ────────────────────────────────────────────────────────────────────

export function useMeals(filters?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.meals(filters),
    queryFn: () =>
      api
        .get<{ data: Meal[] }>("/api/v1/meals", { params: filters })
        .then((r) => r.data.data),
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: queryKeys.meal(id),
    queryFn: () =>
      api
        .get<{ data: Meal }>(`/api/v1/meals/${id}`)
        .then((r) => r.data.data),
    enabled: !!id,
  });
}

// ─── Providers ────────────────────────────────────────────────────────────────

export function useProviders() {
  return useQuery({
    queryKey: queryKeys.providers(),
    queryFn: () =>
      api
        .get<{ data: ProviderProfile[] }>("/api/v1/providers")
        .then((r) => r.data.data),
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: queryKeys.provider(id),
    queryFn: () =>
      api
        .get<{ data: ProviderProfile }>(`/api/v1/providers/${id}`)
        .then((r) => r.data.data),
    enabled: !!id,
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () =>
      api
        .get<{ data: Category[] }>("/api/v1/categories")
        .then((r) => r.data.data),
  });
}

export function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; image?: string }) =>
      api
        .post<{ data: Category }>("/api/v1/categories", data)
        .then((r) => r.data.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.categories() }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/categories/${id}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.categories() }),
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders(),
    queryFn: () =>
      api
        .get<{ data: Order[] }>("/api/v1/orders")
        .then((r) => r.data.data),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () =>
      api
        .get<{ data: Order }>(`/api/v1/orders/${id}`)
        .then((r) => r.data.data),
    enabled: !!id,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      deliveryAddress: string;
      notes?: string;
      items: { mealId: string; quantity: number }[];
    }) =>
      api
        .post<{ data: Order }>("/api/v1/orders", data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders() }),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      api
        .patch<{ data: Order }>(`/api/v1/orders/${orderId}/cancel`)
        .then((r) => r.data.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.orders() }),
  });
}

export function useLeaveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      mealId: string;
      orderId: string;
      rating: number;
      comment?: string;
    }) =>
      api
        .post<{ data: unknown }>("/api/v1/reviews", data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders() }),
  });
}

// ─── Provider Meals ───────────────────────────────────────────────────────────

export function useProviderMeals() {
  return useQuery({
    queryKey: queryKeys.providerMeals(),
    queryFn: () =>
      api
        .get<{ data: Meal[] }>("/api/v1/meals/provider/mine")
        .then((r) => r.data.data),
  });
}

export function useAddMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Meal>) =>
      api
        .post<{ data: Meal }>("/api/v1/meals/provider", data)
        .then((r) => r.data.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerMeals() }),
  });
}

export function useUpdateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Meal> & { id: string }) =>
      api
        .put<{ data: Meal }>(`/api/v1/meals/provider/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerMeals() }),
  });
}

export function useDeleteMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/meals/provider/${id}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerMeals() }),
  });
}

// ─── Provider Orders ──────────────────────────────────────────────────────────

export function useProviderOrders() {
  return useQuery({
    queryKey: queryKeys.providerOrders(),
    queryFn: () =>
      api
        .get<{ data: Order[] }>("/api/v1/providers/orders/mine")
        .then((r) => r.data.data),
    refetchInterval: 30000,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api
        .patch<{ data: Order }>(`/api/v1/providers/orders/${id}/status`, { status })
        .then((r) => r.data.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerOrders() }),
  });
}

// ─── Provider Stats ───────────────────────────────────────────────────────────

export function useProviderStats() {
  return useQuery({
    queryKey: queryKeys.providerStats(),
    queryFn: () =>
      api
        .get<{ data: Record<string, unknown> }>("/api/v1/providers/dashboard/stats")
        .then((r) => r.data.data),
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats(),
    queryFn: () =>
      api
        .get<{ data: Record<string, unknown> }>("/api/v1/admin/stats")
        .then((r) => r.data.data),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers(),
    queryFn: () =>
      api
        .get<{ data: User[] }>("/api/v1/admin/users")
        .then((r) => r.data.data),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "suspended" }) =>
      api
        .patch<{ data: User }>(`/api/v1/admin/users/${id}`, { status })
        .then((r) => r.data.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers() }),
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.adminOrders(),
    queryFn: () =>
      api
        .get<{ data: Order[] }>("/api/v1/admin/orders")
        .then((r) => r.data.data),
  });
}