"use client";

import { PageHeader } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function ReportsPage() {
  const { role } = useRole();

  const isGovernment = role === "government";
  const title = isGovernment ? "National Reports" : "Reports";
  const subtitle = isGovernment ? "Facility performance and operational reports." : "National maternal health program reports and statistics.";

  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} />

      <section className="grid gap-4">
        <article className={`rounded-3xl border bg-white p-5 shadow-sm`} style={{ borderColor: isGovernment ? "#CFE3E9" : "#CEE6E1" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            {isGovernment ? "National Reports" : "Performance"}
          </p>
          <h2 className="mt-2 text-lg font-semibold" style={{ color: isGovernment ? "#194D56" : "#1D5551" }}>
            {isGovernment ? "Program Reports" : "Facility Reports"}
          </h2>
          <p className="mt-1 text-sm text-[#54797C]">
            {isGovernment ? "Access comprehensive national maternal health program reports and statistics." : "Access detailed facility performance and activity reports."}
          </p>
        </article>
      </section>
    </div>
  );
}
