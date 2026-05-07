"use client";

import Link from "next/link";
import { ArrowRight, Activity, Layers3, TrendingUp } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function AnalyticsPage() {
  const cards = [
    { title: "Performance trends", description: "Spot patterns with a clearer summary layout.", icon: TrendingUp },
    { title: "District coverage", description: "Track reach and service spread across the region.", icon: Layers3 },
    { title: "Live indicators", description: "Make the most relevant numbers easy to read.", icon: Activity },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader title="Analytics" subtitle="District health metrics and performance analytics." />

      <section className="rounded-[2rem] border border-[#E8F6F5] bg-gradient-to-br from-white via-[#FAFFFE] to-[#F0FBF9] p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">Insights</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#11403F]">Analytics that feel like a dashboard, not a dump.</h2>
            <p className="mt-3 text-sm leading-6 text-[#54797C]">Use a calmer presentation for district statistics and performance signals.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/reports">
              <Button variant="default">Reports <ArrowRight className="size-4" /></Button>
            </Link>
            <Link href="/sync">
              <Button variant="outline">Sync</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-3xl border border-[#E6F1F0] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Module</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#1D5052]">{card.title}</h3>
                </div>
                <div className="rounded-2xl bg-[#F3FAF9] p-3 text-[#1D5551]">
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#54797C]">{card.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
