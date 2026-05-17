"use client";

import { PageHeader } from "@/shared/components/layout";

export default function SyncPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sync"
        subtitle="Manage data synchronization across the national health system."
      />

      <section className="grid gap-4">
        <article className="rounded-3xl border border-[#CFE3E9] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            Data Sync
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#194D56]">System Synchronization</h2>
          <p className="mt-1 text-sm text-[#54797C]">Monitor and manage data synchronization across all districts and facilities.</p>
        </article>
      </section>
    </div>
  );
}
