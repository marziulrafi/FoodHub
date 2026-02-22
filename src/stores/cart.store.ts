"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Meal } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (meal: Meal) => void;
  removeItem: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (meal) => {
        set((state) => {
          const existing = state.items.find((i) => i.meal.id === meal.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.meal.id === meal.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { meal, quantity: 1 }] };
        });
      },

      removeItem: (mealId) =>
        set((state) => ({
          items: state.items.filter((i) => i.meal.id !== mealId),
        })),

      updateQuantity: (mealId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(mealId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.meal.id === mealId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (acc, i) => acc + parseFloat(i.meal.price) * i.quantity,
          0
        ),
      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: "foodhub-cart" }
  )
);
