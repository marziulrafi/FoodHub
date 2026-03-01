"use client";

import { useAdminUsers, useUpdateUserStatus } from "@/hooks/useApi";
import { Spinner, Badge } from "@/components/ui";
import toast from "react-hot-toast";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();

  const handleToggle = async (user: User) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
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
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
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
                    }
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
                            user.status === "active"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {(!users || users.length === 0) && (
            <div className="py-12 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
