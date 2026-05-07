"use client";

import { PageHeader } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function MothersPage() {
  const role = useRole();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mothers"
        subtitle="Manage and track pregnant mothers under your care."
      />

      <section className="grid gap-4">
        <article className="rounded-3xl border border-[#CCE6EB] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            Active Pregnancies
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#1B5360]">Mothers in Program</h2>
          <p className="mt-1 text-sm text-[#54797C]">View all pregnant mothers currently under your monitoring.</p>
        </article>
      </section>
    </div>
  );
}
