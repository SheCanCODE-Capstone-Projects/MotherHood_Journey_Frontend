"use client";

import Link from "next/link";
import { FileText, BarChart3 } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";

export default function ReportsPage() {
  const { role } = useRole();

  const isGovernment = role === "government";
  const title = isGovernment ? "National Reports" : "Facility Reports";
  const subtitle = isGovernment ? "National maternal health program analytics and performance." : "Facility performance metrics and operational reports.";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader title={title} subtitle={subtitle} />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Reports & Analytics</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">{isGovernment ? "Program Reports" : "Facility Reports"}</h3>
              <p className="mt-2 text-sm text-[#54797C]">{isGovernment ? "Access national health statistics and program performance data." : "View facility performance metrics and operational data."}</p>
            </div>
            <FileText className="size-8 text-[#1D5551]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Link href="/analytics">
              <Button variant="default" size="sm">View analytics</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <BarChart3 className="mt-0.5 size-6 text-indigo-600" />
            <div>
              <p className="font-semibold text-indigo-900">Reports coming soon</p>
              <p className="mt-1 text-sm text-indigo-800">Detailed reports and analytics will be available here as data is processed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Available Reports</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Performance Metrics</p>
            <p className="mt-1 text-xs text-[#54797C]">Track coverage and outcome indicators.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Activity Reports</p>
            <p className="mt-1 text-xs text-[#54797C]">Monthly activity summaries and trends.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Analytics Dashboard</p>
            <p className="mt-1 text-xs text-[#54797C]">Interactive charts and statistics.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
