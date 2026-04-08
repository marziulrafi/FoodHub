"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <EmptyState
        icon="🔎"
        title="Page not found"
        description="The page you’re looking for doesn’t exist."
        action={
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
        }
      />
    </div>
  );
}

