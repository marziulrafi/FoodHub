"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequireRole } from "@/components/auth/RequireRole";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole allowed={["PROVIDER"]}>
      <DashboardShell role="PROVIDER">{children}</DashboardShell>
    </RequireRole>
  );
}
