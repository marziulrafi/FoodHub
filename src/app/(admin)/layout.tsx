"use client";

import { RequireRole } from "@/components/auth/RequireRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole allowed={["ADMIN"]}>{children}</RequireRole>;
}

