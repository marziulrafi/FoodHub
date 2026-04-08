"use client";

import {
  useAdminPendingProviders,
  useApproveProvider,
  useRejectProvider,
} from "@/hooks/useApi";
import { EmptyState, Spinner } from "@/components/ui";
import toast from "react-hot-toast";

export default function AdminProvidersPage() {
  const { data: providers, isLoading, error } = useAdminPendingProviders();
  const approveProvider = useApproveProvider();
  const rejectProvider = useRejectProvider();

  const handleApprove = async (id: string) => {
    try {
      await approveProvider.mutateAsync(id);
      toast.success("Provider approved successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to approve provider.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectProvider.mutateAsync(id);
      toast.success("Provider rejected successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to reject provider.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Approvals</h1>
      <p className="text-gray-500 mb-6">Review and approve pending restaurants.</p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="Failed to load pending providers"
          description="Please refresh and try again."
        />
      ) : !providers || providers.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No pending providers"
          description="All provider applications are reviewed."
        />
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {provider.restaurantName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Owner: {provider.user?.email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Address: {provider.address || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {provider.phone || "N/A"}
                  </p>
                  {provider.description && (
                    <p className="text-sm text-gray-500 mt-2">{provider.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(provider.id)}
                    disabled={approveProvider.isPending || rejectProvider.isPending}
                    className="btn-primary"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(provider.id)}
                    disabled={approveProvider.isPending || rejectProvider.isPending}
                    className="btn-danger"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

