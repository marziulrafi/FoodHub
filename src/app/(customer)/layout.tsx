"use client";

import { RequireRole } from "@/components/auth/RequireRole";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole allowed={["CUSTOMER"]}>{children}</RequireRole>;
}

