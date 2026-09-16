"use client";
import { confirmAction } from "@/lib/confirm";
import { ErrorState } from "@/components/ui/ErrorState";
import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

import { useState } from "react";
import {
  useCategories,
  useAddCategory,
  useDeleteCategory,
} from "@/hooks/useApi";

import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, error, refetch } = useCategories();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();
  const [name, setName] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Fill all fields");
      return;
    }
    try {
      await addCategory.mutateAsync({
        name,
      });
      toast.success("Category added!");
      setName("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (
      !(await confirmAction(
        "Delete category?",
        `Remove “${catName}” from the category list?`,
        "Delete category",
      ))
    )
      return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>

      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Add Category</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            aria-label="Category name"
            className="input flex-1"
            placeholder="Category name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button
            type="submit"
            disabled={addCategory.isPending}
            className="btn-primary flex items-center gap-1 px-4"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

      {isLoading ? (
        <ContentSkeleton variant="table" />
      ) : error ? (
        <ErrorState error={error} retry={() => void refetch()} />
      ) : (
        <div className="card divide-y divide-gray-50">
          {categories?.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div>
                <p className="font-medium text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400">/{cat.slug}</p>
              </div>
              <button
                aria-label={`Delete ${cat.name}`}
                disabled={deleteCategory.isPending}
                onClick={() => handleDelete(cat.id, cat.name)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {(!categories || categories.length === 0) && (
            <p className="px-5 py-6 text-center text-gray-500">
              No categories yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
