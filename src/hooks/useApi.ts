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


export function useMeals(filters?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.meals(filters),
    queryFn: () =>
      api
        .get<{ meals: Meal[] }>("/api/meals", { params: filters })
        .then((r) => r.data.meals),
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: queryKeys.meal(id),
    queryFn: () =>
      api.get<{ meal: Meal }>(`/api/meals/${id}`).then((r) => r.data.meal),
    enabled: !!id,
  });
}

export function useProviders() {
  return useQuery({
    queryKey: queryKeys.providers(),
    queryFn: () =>
      api
        .get<{ providers: ProviderProfile[] }>("/api/providers")
        .then((r) => r.data.providers),
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: queryKeys.provider(id),
    queryFn: () =>
      api
        .get<{ provider: ProviderProfile }>(`/api/providers/${id}`)
        .then((r) => r.data.provider),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () =>
      api
        .get<{ categories: Category[] }>("/api/categories")
        .then((r) => r.data.categories),
  });
}


export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders(),
    queryFn: () =>
      api.get<{ orders: Order[] }>("/api/orders").then((r) => r.data.orders),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () =>
      api
        .get<{ order: Order }>(`/api/orders/${id}`)
        .then((r) => r.data.order),
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
        .post<{ order: Order }>("/api/orders", data)
        .then((r) => r.data.order),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders() }),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      api.patch(`/api/orders/${orderId}/cancel`).then((r) => r.data.order),
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
    }) => api.post("/api/reviews", data).then((r) => r.data.review),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders() }),
  });
}


export function useProviderMeals() {
  return useQuery({
    queryKey: queryKeys.providerMeals(),
    queryFn: () =>
      api
        .get<{ meals: Meal[] }>("/api/provider/meals")
        .then((r) => r.data.meals),
  });
}

export function useProviderOrders() {
  return useQuery({
    queryKey: queryKeys.providerOrders(),
    queryFn: () =>
      api
        .get<{ orders: Order[] }>("/api/provider/orders")
        .then((r) => r.data.orders),
    refetchInterval: 30000,
  });
}

export function useProviderStats() {
  return useQuery({
    queryKey: queryKeys.providerStats(),
    queryFn: () =>
      api
        .get<{ stats: Record<string, unknown> }>("/api/provider/stats")
        .then((r) => r.data.stats),
  });
}

export function useAddMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Meal>) =>
      api
        .post<{ meal: Meal }>("/api/provider/meals", data)
        .then((r) => r.data.meal),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerMeals() }),
  });
}

export function useUpdateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Meal> & { id: string }) =>
      api
        .put<{ meal: Meal }>(`/api/provider/meals/${id}`, data)
        .then((r) => r.data.meal),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerMeals() }),
  });
}

export function useDeleteMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/provider/meals/${id}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerMeals() }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api
        .patch(`/api/provider/orders/${id}`, { status })
        .then((r) => r.data.order),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.providerOrders() }),
  });
}


export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats(),
    queryFn: () =>
      api
        .get<{ stats: Record<string, unknown> }>("/api/admin/stats")
        .then((r) => r.data.stats),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers(),
    queryFn: () =>
      api.get<{ users: User[] }>("/api/admin/users").then((r) => r.data.users),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "suspended";
    }) =>
      api
        .patch(`/api/admin/users/${id}`, { status })
        .then((r) => r.data.user),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers() }),
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.adminOrders(),
    queryFn: () =>
      api
        .get<{ orders: Order[] }>("/api/admin/orders")
        .then((r) => r.data.orders),
  });
}

export function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string }) =>
      api
        .post<{ category: Category }>("/api/categories", data)
        .then((r) => r.data.category),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.categories() }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/categories/${id}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.categories() }),
  });
}
