"use client";

import { PageHeader } from "@/shared/components/layout";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        subtitle="Manage facility staff members and their assignments."
      />

      <section className="grid gap-4">
        <article className="rounded-3xl border border-[#CEE6E1] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            Team Members
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#1D5551]">Staff Directory</h2>
          <p className="mt-1 text-sm text-[#54797C]">View and manage all facility staff members.</p>
        </article>
      </section>
    </div>
  );
}
