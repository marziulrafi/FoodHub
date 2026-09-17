"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmAction } from "@/lib/confirm";
import { ErrorState } from "@/components/ui/ErrorState";
import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

import { useAdminUsers, useUpdateUserStatus } from "@/hooks/useApi";
import { Badge, EmptyState } from "@/components/ui";
import toast from "react-hot-toast";
import type { User } from "@/types";

function AdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPage = Number(searchParams.get("page") || "1");
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const { data, isLoading, error, refetch } = useAdminUsers({
    page,
    limit: 10,
    search: searchParams.get("search") || undefined,
    role: searchParams.get("role") || undefined,
    status: searchParams.get("status") || undefined,
  });
  const users = data?.users;
  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const changePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/admin/users?${params.toString()}`, { scroll: false });
  };
  // A filtered status update can remove the final row of the final page.
  useEffect(() => {
    if (!meta || page <= Math.max(1, meta.totalPages)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(Math.max(1, meta.totalPages)));
    router.replace(`/admin/users?${params.toString()}`, { scroll: false });
  }, [meta, page, router, searchParams]);
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => firstPage + i,
  );
  const updateStatus = useUpdateUserStatus();

  const handleToggle = async (user: User) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (
      !(await confirmAction(
        `${newStatus === "SUSPENDED" ? "Suspend" : "Activate"} user?`,
        `Update access for ${user.name}?`,
        newStatus === "SUSPENDED" ? "Suspend user" : "Activate user",
      ))
    )
      return;
    try {
      await updateStatus.mutateAsync({ id: user.id, status: newStatus });
      toast.success(`User ${newStatus}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

      {isLoading ? (
        <ContentSkeleton variant="table" />
      ) : error ? (
        <ErrorState error={error} retry={() => void refetch()} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users?.map(
                  (
                    user: User & {
                      providerProfile?: { restaurantName: string };
                    },
                  ) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.providerProfile && (
                            <p className="text-xs text-primary-600">
                              {user.providerProfile.restaurantName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={user.role} variant={user.role} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={user.status} variant={user.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(user)}
                          disabled={updateStatus.isPending}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            user.status === "ACTIVE"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          {(!users || users.length === 0) && (
            <EmptyState
              icon={<Users size={28} />}
              title="No users found"
              description="No registered users match the current selection."
            />
          )}
          {meta && (
            <div className="flex flex-col gap-4 border-t border-gray-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600" role="status">
                Showing {users?.length ? (meta.page - 1) * meta.limit + 1 : 0}–
                {users?.length
                  ? (meta.page - 1) * meta.limit + users.length
                  : 0}{" "}
                of {meta.total} users
              </p>
              <nav
                aria-label="User pagination"
                className="flex flex-wrap items-center gap-1"
              >
                <Button
                  variant="secondary"
                  className="px-3"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                {pageNumbers.map((number) => (
                  <Button
                    key={number}
                    variant={number === page ? "default" : "secondary"}
                    className="min-w-10 px-3"
                    aria-label={`Page ${number}`}
                    aria-current={number === page ? "page" : undefined}
                    onClick={() => changePage(number)}
                  >
                    {number}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  className="px-3"
                  disabled={page >= totalPages}
                  onClick={() => changePage(page + 1)}
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </Button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<ContentSkeleton variant="table" />}>
      <AdminUsersContent />
    </Suspense>
  );
}
