"use client";

import { PageHeader } from "@/shared/components/layout";

export default function DiagnosesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Diagnoses"
        subtitle="Review and manage maternal health diagnoses and conditions."
      />

      <section className="grid gap-4">
        <article className="rounded-3xl border border-[#CCE6EB] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            Diagnosed Cases
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#1B5360]">Maternal Conditions</h2>
          <p className="mt-1 text-sm text-[#54797C]">View all diagnosed health conditions for your patients.</p>
        </article>
      </section>
    </div>
  );
}
