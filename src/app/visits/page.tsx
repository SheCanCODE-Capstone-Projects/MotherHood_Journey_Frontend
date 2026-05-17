"use client";

import { PageHeader } from "@/shared/components/layout";

export default function VisitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Visits"
        subtitle="Manage health facility visits and patient follow-ups."
      />

      <section className="grid gap-4">
        <article className="rounded-3xl border border-[#CCE6EB] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            Patient Visits
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#1B5360]">Visit Schedule</h2>
          <p className="mt-1 text-sm text-[#54797C]">Track and record patient clinic visits and checkups.</p>
        </article>
      </section>
    </div>
  );
}
