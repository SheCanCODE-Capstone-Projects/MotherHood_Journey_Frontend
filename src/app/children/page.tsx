import Link from "next/link";
import { ArrowRight, Baby, ClipboardList, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function ChildrenPage() {
  const cards = [
    { title: "Health profiles", description: "See registration details, caregivers, and contact points.", icon: Baby },
    { title: "Vaccination follow-up", description: "Track completed and due immunization sessions.", icon: ShieldCheck },
    { title: "Visit history", description: "Review consultation notes and clinic follow-ups.", icon: ClipboardList },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader title="Children" subtitle="Track child health profiles and follow-up events." />

      <section className="rounded-[2rem] border border-[#E8F6F5] bg-gradient-to-br from-white via-[#FAFFFE] to-[#F1FBFA] p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">Child registry</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#11403F]">A clearer view of every child record.</h2>
            <p className="mt-3 text-sm leading-6 text-[#54797C]">
              Keep the registry focused on the details that matter most during clinic visits: identity, vaccination progress, and upcoming follow-up work.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/mothers">
              <Button variant="default">Open registry <ArrowRight className="size-4" /></Button>
            </Link>
            <Link href="/appointments">
              <Button variant="outline">View appointments</Button>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Feature</p>
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
