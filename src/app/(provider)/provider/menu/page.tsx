"use client";

import { useState } from "react";
import {
  useProviderMeals,
  useAddMeal,
  useUpdateMeal,
  useDeleteMeal,
  useCategories,
} from "@/hooks/useApi";
import { Spinner, Badge } from "@/components/ui";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Meal } from "@/types";

interface MealForm {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
}

const defaultForm: MealForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  image: "",
  isAvailable: true,
  isVegetarian: false,
  isVegan: false,
};

export default function ProviderMenuPage() {
  const { data: meals, isLoading } = useProviderMeals();
  const { data: categories } = useCategories();
  const addMeal = useAddMeal();
  const updateMeal = useUpdateMeal();
  const deleteMeal = useDeleteMeal();

  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [form, setForm] = useState<MealForm>(defaultForm);

  const openAdd = () => {
    setEditingMeal(null);
    setForm(defaultForm);
    setShowModal(true);
  };
  const openEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setForm({
      name: meal.name,
      description: meal.description || "",
      price: meal.price,
      categoryId: meal.categoryId || "",
      image: meal.image || "",
      isAvailable: meal.isAvailable,
      isVegetarian: meal.isVegetarian,
      isVegan: meal.isVegan,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        categoryId: form.categoryId || undefined,
        image: form.image || undefined,
      };

      if (editingMeal) {
        await updateMeal.mutateAsync({ id: editingMeal.id, ...form });
        toast.success("Meal updated!");
      } else {
        await addMeal.mutateAsync(form);
        toast.success("Meal added!");
      }
      setShowModal(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteMeal.mutateAsync(id);
      toast.success("Meal deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const field =
    (key: keyof MealForm) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const value =
          e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        setForm((p) => ({ ...p, [key]: value }));
      };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Meal
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !meals || meals.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <p className="text-4xl mb-3">🍽️</p>
          <p>No meals yet. Add your first meal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="card overflow-hidden">
              <div className="h-36 bg-gray-100 flex items-center justify-center text-4xl">
                {meal.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "🍽️"
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                    <p className="text-primary-600 font-bold">
                      ৳{parseFloat(meal.price).toFixed(0)}
                    </p>
                  </div>
                  <Badge
                    label={meal.isAvailable ? "Active" : "Inactive"}
                    variant={meal.isAvailable ? "active" : "suspended"}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(meal)}
                    className="btn-secondary text-sm flex-1 flex items-center justify-center gap-1 py-1.5"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal.id, meal.name)}
                    className="btn-danger text-sm px-3 py-1.5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingMeal ? "Edit Meal" : "Add Meal"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={field("name")}
                  placeholder="Chicken Biryani"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  value={form.description}
                  onChange={field("description")}
                  placeholder="Describe the meal..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (৳) *
                  </label>
                  <input
                    className="input"
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={field("price")}
                    placeholder="250.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="input"
                    value={form.categoryId}
                    onChange={field("categoryId")}
                  >
                    <option value="">Select...</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  className="input"
                  type="url"
                  value={form.image}
                  onChange={field("image")}
                  placeholder="https://..."
                />
              </div>
              <div className="flex flex-wrap gap-4">
                {(["isAvailable", "isVegetarian", "isVegan"] as const).map(
                  (key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form[key] as boolean}
                        onChange={field(key)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace("is", "")}
                      </span>
                    </label>
                  )
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMeal.isPending || updateMeal.isPending}
                  className="btn-primary flex-1"
                >
                  {editingMeal ? "Update" : "Add Meal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
