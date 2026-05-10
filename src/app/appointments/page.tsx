import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function AppointmentsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Your Appointments"
        subtitle="Schedule visits, track upcoming appointments, and review past sessions."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Schedule</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">Book an Appointment</h3>
              <p className="mt-2 text-sm text-[#54797C]">Schedule facility visits and prenatal checkups.</p>
            </div>
            <Calendar className="size-8 text-[#1D5551]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Link href="/dashboard">
              <Button variant="default" size="sm">View dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-sky-50 to-sky-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Clock className="mt-0.5 size-6 text-sky-600" />
            <div>
              <p className="font-semibold text-sky-900">No upcoming appointments</p>
              <p className="mt-1 text-sm text-sky-800">Scheduled appointments will appear here. Contact your facility to book.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Appointment types</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFFE] p-4">
            <p className="font-medium text-[#11403F]">Prenatal Visits</p>
            <p className="mt-1 text-xs text-[#54797C]">Routine pregnancy checkups and monitoring.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Child Checkups</p>
            <p className="mt-1 text-xs text-[#54797C]">Immunization and growth tracking visits.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Follow-ups</p>
            <p className="mt-1 text-xs text-[#54797C]">Post-visit reviews and health monitoring.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
