"use client";

import { CustomerNavigation } from "@/components/layout/DashboardShell";
import { RequireRole } from "@/components/auth/RequireRole";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole allowed={["CUSTOMER"]}>
      <CustomerNavigation />
      {children}
    </RequireRole>
  );
}
