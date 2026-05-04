"use client";

import { PageHeader } from "@/shared/components/layout";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="District health metrics and performance analytics."
      />

      <section className="grid gap-4">
        <article className="rounded-3xl border border-[#CFE8E3] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            Key Metrics
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#215C57]">District Statistics</h2>
          <p className="mt-1 text-sm text-[#54797C]">Access detailed analytics and performance indicators for the district.</p>
        </article>
      </section>
    </div>
  );
}
