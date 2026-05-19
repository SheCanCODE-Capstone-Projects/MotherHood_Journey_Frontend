"use client";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Baby, Heart, Calendar, AlertCircle } from "lucide-react";

export default function PregnanciesPage() {
  const roleTheme = ROLE_THEMES.patient;

  const pregnancyData = [
    { week: 28, stage: "Third Trimester", daysLeft: 77, status: "On Track" },
  ];

  const milestones = [
    { week: 20, title: "Anatomy Scan", date: "Mar 15, 2024", status: "Completed" },
    { week: 28, title: "Glucose Test", date: "April 5, 2024", status: "Scheduled" },
    { week: 36, title: "Group B Strep", date: "May 3, 2024", status: "Upcoming" },
  ];

  const visits = [
    { date: "Apr 5, 2024", type: "Routine Checkup", notes: "BP & blood work normal", facility: "Nyamata Health Center" },
    { date: "Mar 22, 2024", type: "Ultrasound", notes: "Baby developing well", facility: "Nyamata Health Center" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pregnancies"
        subtitle="Track your pregnancy progress and upcoming milestones."
      />

      {/* Current Pregnancy Summary */}
      <section className="grid gap-4 md:grid-cols-4">
        {pregnancyData.map((preg, idx) => (
          <div key={idx} className="rounded-3xl border-2 bg-white p-6 shadow-sm" style={{ borderColor: roleTheme.border }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Week {preg.week}</p>
                <h3 className="mt-2 text-xl font-bold" style={{ color: roleTheme.text }}>{preg.stage}</h3>
                <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>~{preg.daysLeft} days to go</p>
              </div>
              <Baby className="size-8" style={{ color: roleTheme.accent }} />
            </div>
            <div className="mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>✓ {preg.status}</div>
          </div>
        ))}
        <div className="rounded-3xl border-2 bg-white p-6 shadow-sm" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Due Date</p>
              <h3 className="mt-2 text-xl font-bold" style={{ color: roleTheme.text }}>May 21</h3>
              <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>2024</p>
            </div>
            <Calendar className="size-8" style={{ color: roleTheme.accent }} />
          </div>
        </div>
        <div className="rounded-3xl border-2 bg-white p-6 shadow-sm" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Last Visit</p>
              <h3 className="mt-2 text-xl font-bold" style={{ color: roleTheme.text }}>Apr 5</h3>
              <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>All normal</p>
            </div>
            <Heart className="size-8" style={{ color: roleTheme.accent }} />
          </div>
        </div>
        <div className="rounded-3xl border-2 bg-white p-6 shadow-sm" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Next Appointment</p>
              <h3 className="mt-2 text-xl font-bold" style={{ color: roleTheme.text }}>Apr 19</h3>
              <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>Checkup</p>
            </div>
            <AlertCircle className="size-8" style={{ color: roleTheme.accent }} />
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Pregnancy Milestones</h2>
        <div className="space-y-3">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="flex items-start gap-4 rounded-2xl border p-4" style={{ borderColor: roleTheme.border }}>
              <div className="mt-1 rounded-full p-2" style={{ backgroundColor: milestone.status === 'Completed' ? roleTheme.accentSoft : roleTheme.accentSoft }}>
                <div className="size-3 rounded-full" style={{ backgroundColor: roleTheme.accent }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: roleTheme.text }}>Week {milestone.week}: {milestone.title}</p>
                <p className="text-sm" style={{ color: roleTheme.text }}>Scheduled: {milestone.date}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: milestone.status === 'Completed' ? '#D1FAE5' : '#FEF3C7', color: milestone.status === 'Completed' ? '#065F46' : '#92400E' }}>
                {milestone.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Visits */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Recent Visits</h2>
        <div className="space-y-3">
          {visits.map((visit, idx) => (
            <div key={idx} className="rounded-2xl border p-4" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold" style={{ color: roleTheme.text }}>{visit.type}</p>
                  <p className="text-sm" style={{ color: roleTheme.text }}>{visit.date}</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: roleTheme.text }}>{visit.notes}</p>
                </div>
              </div>
              <p className="mt-3 text-xs" style={{ color: roleTheme.text }}>📋 {visit.facility}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
