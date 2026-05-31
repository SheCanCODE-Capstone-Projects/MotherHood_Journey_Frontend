"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MotherRegistrationForm } from "@/features/maternal/components";
import { useRole } from "@/shared/hooks/useRole";

export default function MotherRegistrationPage() {
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/mothers"
        className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
        style={{ color: roleTheme.text }}
      >
        <ArrowLeft className="size-4" />
        Back to Mothers
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register New Mother</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete all steps to register a new mother in the maternal health tracking system.
        </p>
      </div>

      <MotherRegistrationForm />
    </div>
  );
}
