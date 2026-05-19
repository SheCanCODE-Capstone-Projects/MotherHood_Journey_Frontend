"use client";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Baby, CheckCircle, AlertCircle, Calendar } from "lucide-react";

export default function ChildrenPage() {
  const roleTheme = ROLE_THEMES.patient;

  const children = [
    {
      id: 1,
      name: "Grace Uwera",
      dob: "Jan 15, 2023",
      age: "1y 3m",
      status: "On Track",
      immunizations: { completed: 8, total: 12 },
      nextAppointment: "May 10, 2024",
    },
  ];

  const vaccinations = [
    { name: "BCG", scheduledDate: "Birth", actualDate: "Jan 15, 2023", status: "Completed" },
    { name: "OPV 1", scheduledDate: "6 weeks", actualDate: "Feb 26, 2023", status: "Completed" },
    { name: "Pentavalent 1", scheduledDate: "6 weeks", actualDate: "Feb 26, 2023", status: "Completed" },
    { name: "PCV 2", scheduledDate: "4 months", actualDate: "Upcoming", status: "Due" },
    { name: "MR", scheduledDate: "9 months", actualDate: "--", status: "Upcoming" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Children"
        subtitle="Track immunization records and health follow-ups."
      />

      {/* Children Profiles */}
      {children.map((child) => (
        <div key={child.id}>
          <section className="rounded-3xl border-2 bg-white p-6" style={{ borderColor: roleTheme.border }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Baby className="size-6" style={{ color: roleTheme.accent }} />
                  <h2 className="text-2xl font-bold" style={{ color: roleTheme.text }}>{child.name}</h2>
                </div>
                <p className="mt-2 text-sm" style={{ color: roleTheme.text }}>Born: {child.dob} • Age: {child.age}</p>
              </div>
              <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>✓ {child.status}</span>
            </div>

            {/* Progress Stats */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl p-4" style={{ backgroundColor: roleTheme.accentSoft }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Immunizations</p>
                <p className="mt-2 text-2xl font-bold" style={{ color: roleTheme.text }}>{child.immunizations.completed}/{child.immunizations.total}</p>
                <div className="mt-3 h-2 rounded-full bg-white/30">
                  <div className="h-full rounded-full" style={{ width: `${(child.immunizations.completed / child.immunizations.total) * 100}%`, backgroundColor: roleTheme.accent }} />
                </div>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: roleTheme.accentSoft }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Next Checkup</p>
                <p className="mt-2 text-lg font-bold" style={{ color: roleTheme.text }}>{child.nextAppointment}</p>
                <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>in 7 days</p>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: roleTheme.accentSoft }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Health Status</p>
                <p className="mt-2 text-lg font-bold" style={{ color: roleTheme.text }}>Healthy</p>
                <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>Growth: Normal</p>
              </div>
            </div>
          </section>

          {/* Vaccination Records */}
          <section className="mt-6">
            <h3 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Vaccination Records</h3>
            <div className="space-y-3">
              {vaccinations.map((vax, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: roleTheme.border }}>
                  <div className="flex items-center gap-3">
                    {vax.status === 'Completed' ? (
                      <CheckCircle className="size-6" style={{ color: '#10B981' }} />
                    ) : vax.status === 'Due' ? (
                      <AlertCircle className="size-6" style={{ color: '#F59E0B' }} />
                    ) : (
                      <Calendar className="size-6" style={{ color: '#D1D5DB' }} />
                    )}
                    <div>
                      <p className="font-semibold" style={{ color: roleTheme.text }}>{vax.name}</p>
                      <p className="text-sm" style={{ color: roleTheme.text }}>Scheduled: {vax.scheduledDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium" style={{ color: roleTheme.text }}>{vax.actualDate}</p>
                    <span className={`inline-block mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      vax.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      vax.status === 'Due' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {vax.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}
