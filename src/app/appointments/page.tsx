import { PageHeader } from "@/shared/components/layout";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle="Manage upcoming visits and review past appointments."
      />

      <section className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
        <p className="text-sm text-[#54797C]">
          No appointments yet. New bookings will appear in this list.
        </p>
      </section>
    </div>
  );
}
