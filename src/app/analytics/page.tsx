"use client";

import Link from "next/link";
import { TrendingUp, PieChart } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Performance Analytics"
        subtitle="District health metrics and performance indicators."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Performance data</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">District Statistics</h3>
              <p className="mt-2 text-sm text-[#54797C]">Access key metrics and performance indicators across the district.</p>
            </div>
            <TrendingUp className="size-8 text-[#1D5551]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Link href="/reports">
              <Button variant="default" size="sm">View reports</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <PieChart className="mt-0.5 size-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Analytics dashboard</p>
              <p className="mt-1 text-sm text-blue-800">Real-time metrics and performance tracking across all facilities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Key Metrics</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-6 text-center">
            <p className="text-3xl font-bold text-[#1D5551]">92%</p>
            <p className="mt-2 text-xs font-medium text-[#54797C]">Coverage Rate</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-6 text-center">
            <p className="text-3xl font-bold text-[#1D5551]">1,245</p>
            <p className="mt-2 text-xs font-medium text-[#54797C]">Active Cases</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-6 text-center">
            <p className="text-3xl font-bold text-[#1D5551]">156</p>
            <p className="mt-2 text-xs font-medium text-[#54797C]">Facilities</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-6 text-center">
            <p className="text-3xl font-bold text-[#1D5551]">3,892</p>
            <p className="mt-2 text-xs font-medium text-[#54797C]">Staff Members</p>
          </div>
        </div>
      </section>
    </div>
  );
}
