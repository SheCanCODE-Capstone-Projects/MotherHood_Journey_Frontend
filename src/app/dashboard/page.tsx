"use client";

import Link from "next/link";
import { ChevronRight, Users, Calendar, Heart } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";

export default function DashboardPage() {
  const { role, displayName } = useRole();

  const cards = [
    { key: "cases", title: "Active Cases", value: 24, icon: Users, color: "from-emerald-50 to-emerald-100" },
    { key: "visits", title: "Scheduled Today", value: 8, icon: Calendar, color: "from-sky-50 to-sky-100" },
    { key: "followup", title: "Children Due", value: 5, icon: Heart, color: "from-amber-50 to-amber-100" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Welcome back"
        subtitle={`Good to see you${displayName ? `, ${displayName}` : ''}. Quick overview of your workspace.`}
      />

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Today</p>
          <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">{role === 'health_worker' ? 'Health Worker Dashboard' : 'Your Dashboard'}</h3>
          <p className="mt-2 text-sm text-[#54797C]">Access quick actions and recent summaries.</p>

          <div className="mt-5 flex gap-3">
            <Link href="/appointments">
              <Button variant="default" size="sm">View appointments</Button>
            </Link>
            <Link href="/children">
              <Button variant="outline" size="sm">Children</Button>
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Overview</p>
          <h3 className="mt-2 text-xl font-semibold text-[#1D5052]">Quick stats</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {cards.map((c) => (
              <div key={c.key} className={`rounded-2xl border border-[#EEF6F5] bg-gradient-to-br ${c.color} p-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#5B8784]">{c.title}</p>
                    <p className="mt-2 text-2xl font-bold text-[#0F4E4B]">{c.value}</p>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2">
                    <c.icon className="size-6 text-[#0F4E4B]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <Link href="/dashboard/mothers">
              <Button variant="ghost">Open dashboard <ChevronRight className="size-4 ml-2" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1D5052]">Recent activity</h3>
          <Link href="/appointments" className="text-sm font-medium text-[#1D5551]">See all</Link>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-[#EEF6F5] bg-[#FAFFFE] p-3">
            <div>
              <p className="text-sm font-medium text-[#11403F]">New visit recorded</p>
              <p className="text-xs text-[#54797C]">Patient: Jane Doe — 2 hours ago</p>
            </div>
            <ChevronRight className="size-5 text-[#1D5551]" />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#EEF6F5] bg-white p-3">
            <div>
              <p className="text-sm font-medium text-[#11403F]">3 vaccines administered</p>
              <p className="text-xs text-[#54797C]">At: Ruhango Health Center — today</p>
            </div>
            <ChevronRight className="size-5 text-[#1D5551]" />
          </div>
        </div>
      </section>
    </div>
  );
}
