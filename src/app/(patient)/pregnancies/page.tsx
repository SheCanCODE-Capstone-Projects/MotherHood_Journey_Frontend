import { PageHeader } from "@/shared/components/layout";

export default function PregnanciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pregnancies"
        subtitle="View active and historical pregnancy records."
      />

      <section className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
        <p className="text-sm text-[#54797C]">
          Pregnancy entries will appear here once your clinical records are connected.
        </p>
      </section>
    </div>
  );
}
