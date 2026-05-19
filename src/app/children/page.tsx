import Link from "next/link";
import { Baby, AlertCircle } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function ChildrenPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Children Records"
        subtitle="Track child health profiles, vaccinations, and follow-up milestones."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Getting started</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">Child Health Records</h3>
              <p className="mt-2 text-sm text-[#54797C]">Monitor vaccinations, growth, and development milestones.</p>
            </div>
            <Baby className="size-8 text-[#1D5551]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Link href="/appointments">
              <Button variant="default" size="sm">Schedule visit</Button>
            </Link>
            <Link href="/dashboard/mothers">
              <Button variant="outline" size="sm">View list</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-amber-50 to-amber-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-0.5 size-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">No child records yet</p>
              <p className="mt-1 text-sm text-amber-800">Child records will appear here once they are registered in the system.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Why track here?</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFFE] p-4">
            <p className="font-medium text-[#11403F]">Vaccinations</p>
            <p className="mt-1 text-xs text-[#54797C]">Monitor all vaccine doses and schedules.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFFE] p-4">
            <p className="font-medium text-[#11403F]">Growth Tracking</p>
            <p className="mt-1 text-xs text-[#54797C]">Record height, weight, and milestones.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Follow-up Alerts</p>
            <p className="mt-1 text-xs text-[#54797C]">Get reminders for appointments and visits.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
