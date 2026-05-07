import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardCheck, Clock3 } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function AppointmentsPage() {
  const items = [
    { title: "Upcoming visits", description: "See the next patient appointments at a glance.", icon: CalendarDays },
    { title: "Follow-up actions", description: "Prepare for tasks that need confirmation or review.", icon: ClipboardCheck },
    { title: "Waiting today", description: "Spot what needs attention in the current clinic flow.", icon: Clock3 },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader title="Appointments" subtitle="Manage upcoming visits and review past appointments." />

      <section className="rounded-[2rem] border border-[#E8F6F5] bg-gradient-to-br from-white via-[#FAFFFE] to-[#F0FBF9] p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">Visit planning</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#11403F]">Keep appointment flow visible and organized.</h2>
            <p className="mt-3 text-sm leading-6 text-[#54797C]">
              Use this area as the entry point for scheduling, reviewing, and following up on patient visits.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button variant="default">Go to dashboard <ArrowRight className="size-4" /></Button>
            </Link>
            <Link href="/children">
              <Button variant="outline">Children</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-3xl border border-[#E6F1F0] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Focus</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#1D5052]">{item.title}</h3>
                </div>
                <div className="rounded-2xl bg-[#F3FAF9] p-3 text-[#1D5551]">
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#54797C]">{item.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
