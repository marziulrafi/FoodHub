"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequireRole } from "@/components/auth/RequireRole";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole allowed={["ADMIN"]}>
      <DashboardShell role="ADMIN">{children}</DashboardShell>
    </RequireRole>
  );
}
