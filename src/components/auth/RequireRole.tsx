"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui";
import type { Role } from "@/types";

export function RequireRole({
  allowed,
  children,
}: {
  allowed: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role = (session?.user as { role?: Role })?.role;

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      toast.error("Please login to continue.");
      router.replace("/login");
      return;
    }
    if (!role || !allowed.includes(role)) {
      toast.error("You are not allowed to access this page.");
      router.replace("/");
    }
  }, [allowed, isPending, role, router, session]);

  if (isPending) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!session || !role || !allowed.includes(role)) return null;
  return <>{children}</>;
}

