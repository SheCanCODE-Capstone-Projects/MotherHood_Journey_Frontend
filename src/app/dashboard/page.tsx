"use client";

import { PageHeader } from "@/shared/components/layout";
import { useRole } from "@/shared/hooks/useRole";

export default function DashboardPage() {
  const { role } = useRole();

  const dashboardContent: Record<string, { title: string; subtitle: string; cards: Array<{ label: string; title: string; description: string }> }> = {
    patient: {
      title: "Dashboard",
      subtitle: "Overview of your motherhood journey and recent updates.",
      cards: [
        { label: "Pregnancy", title: "Current Week", description: "Track your latest stage and milestones." },
        { label: "Appointments", title: "Upcoming Visit", description: "See your next scheduled facility appointment." },
        { label: "Children", title: "Follow-up Status", description: "Review immunization and checkup reminders." },
      ],
    },
    health_worker: {
      title: "Dashboard",
      subtitle: "Overview of maternal health activities and patient updates.",
      cards: [
        { label: "Active Cases", title: "Patients Under Care", description: "Monitor ongoing maternal care cases." },
        { label: "Visits", title: "Scheduled Today", description: "View your patient visit schedule." },
        { label: "Diagnoses", title: "Recent Cases", description: "Review diagnosed maternal health conditions." },
      ],
    },
    facility_admin: {
      title: "Dashboard",
      subtitle: "Facility management and operational overview.",
      cards: [
        { label: "Staff", title: "Team Members", description: "Manage facility staff and assignments." },
        { label: "Operations", title: "Facility Status", description: "Monitor facility operational metrics." },
        { label: "Reports", title: "Performance", description: "View facility performance reports." },
      ],
    },
    district_officer: {
      title: "Dashboard",
      subtitle: "District-level maternal health monitoring and oversight.",
      cards: [
        { label: "District Overview", title: "Facilities Status", description: "Monitor all facilities in the district." },
        { label: "Analytics", title: "Key Metrics", description: "View district-level health metrics and statistics." },
      ],
    },
    government: {
      title: "Dashboard",
      subtitle: "National maternal health program oversight and monitoring.",
      cards: [
        { label: "National", title: "Program Overview", description: "Monitor national maternal health program performance." },
        { label: "Sync", title: "Data Synchronization", description: "Manage data synchronization across districts." },
        { label: "Reports", title: "National Reports", description: "View comprehensive national health reports." },
      ],
    },
  };

  const content = dashboardContent[role] || dashboardContent.patient;
  const borderColor = role === "patient" ? "#D5E9E6" : role === "health_worker" ? "#CCE6EB" : role === "facility_admin" ? "#CEE6E1" : role === "district_officer" ? "#CFE8E3" : "#CFE3E9";
  const textColor = role === "patient" ? "#1D5052" : role === "health_worker" ? "#1B5360" : role === "facility_admin" ? "#1D5551" : role === "district_officer" ? "#215C57" : "#194D56";

  return (
    <div className="space-y-6">
      <PageHeader title={content.title} subtitle={content.subtitle} />

      <section className={`grid gap-4 ${content.cards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {content.cards.map((card) => (
          <article key={card.title} className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              {card.label}
            </p>
            <h2 className="mt-2 text-lg font-semibold" style={{ color: textColor }}>
              {card.title}
            </h2>
            <p className="mt-1 text-sm text-[#54797C]">{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
