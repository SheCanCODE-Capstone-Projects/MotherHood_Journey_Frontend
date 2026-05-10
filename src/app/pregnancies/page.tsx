import Link from "next/link";
import { Heart, Calendar } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function PregnanciesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Pregnancy Journey"
        subtitle="Track pregnancy progress, upcoming milestones, and important dates."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Active pregnancy</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">Pregnancy Records</h3>
              <p className="mt-2 text-sm text-[#54797C]">Follow your pregnancy week by week and monitor health updates.</p>
            </div>
            <Heart className="size-8 text-[#E85D75]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Link href="/appointments">
              <Button variant="default" size="sm">Book appointment</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Go to dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Calendar className="mt-0.5 size-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Ready to start tracking?</p>
              <p className="mt-1 text-sm text-blue-800">Once your clinic connects your pregnancy record, you'll see detailed tracking and progress here.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">What you'll track</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFFE] p-4">
            <p className="font-medium text-[#11403F]">Weekly Progress</p>
            <p className="mt-1 text-xs text-[#54797C]">See your current pregnancy week and key milestones.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Health Metrics</p>
            <p className="mt-1 text-xs text-[#54797C]">Monitor blood pressure, weight, and vital signs.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Appointments</p>
            <p className="mt-1 text-xs text-[#54797C]">Schedule and track clinic visits and checkups.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
