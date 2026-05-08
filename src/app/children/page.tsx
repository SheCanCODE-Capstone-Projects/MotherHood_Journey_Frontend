import { PageHeader } from "@/shared/components/layout";

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Children"
        subtitle="Track child health profile and follow-up events."
      />

      <section className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
        <p className="text-sm text-[#54797C]">
          Child records will appear here as soon as they are registered.
        </p>
      </section>
    </div>
  );
}
