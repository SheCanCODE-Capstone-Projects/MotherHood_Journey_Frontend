"use client";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Users, AlertCircle, CheckCircle, Calendar } from "lucide-react";

export default function MothersPage() {
  const roleTheme = ROLE_THEMES.health_worker;

  const stats = [
    { label: "Active Cases", value: "24", icon: Users, color: roleTheme.accent },
    { label: "High Risk", value: "3", icon: AlertCircle, color: "#EF4444" },
    { label: "Due This Month", value: "5", icon: Calendar, color: roleTheme.accent },
    { label: "Completed", value: "8", icon: CheckCircle, color: "#10B981" },
  ];

  const mothers = [
    { id: 1, name: "Diane Habimana", gestationWeek: 28, dueDate: "May 21, 2024", status: "Normal", lastVisit: "Apr 5", phone: "+250791234567" },
    { id: 2, name: "Grace Mukamana", gestationWeek: 32, dueDate: "May 5, 2024", status: "High Risk", lastVisit: "Apr 8", phone: "+250792345678" },
    { id: 3, name: "Sylvie Ingabire", gestationWeek: 20, dueDate: "July 10, 2024", status: "Normal", lastVisit: "Mar 28", phone: "+250793456789" },
    { id: 4, name: "Christine Bikindi", gestationWeek: 35, dueDate: "April 28, 2024", status: "Normal", lastVisit: "Apr 10", phone: "+250794567890" },
    { id: 5, name: "Agnes Mukamusoni", gestationWeek: 25, dueDate: "June 5, 2024", status: "Normal", lastVisit: "Apr 2", phone: "+250795678901" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Facilities"
        title="Mothers"
        subtitle="Manage and monitor pregnant mothers in your care"
      />

      {/* Statistics */}
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <Icon className="size-6" style={{ color: stat.color }} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Mothers List */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Active Mothers Under Care</h2>
        <div className="space-y-3">
          {mothers.map((mother) => (
            <div key={mother.id} className="rounded-2xl border-2 p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full" style={{ backgroundColor: roleTheme.accentSoft }} />
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: roleTheme.text }}>
                        {mother.name}
                      </h3>
                      <p className="text-sm" style={{ color: roleTheme.text }}>
                        📞 {mother.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    mother.status === "High Risk" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {mother.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: roleTheme.text }}>Gestation</p>
                  <p className="mt-1 text-lg font-bold" style={{ color: roleTheme.text }}>Week {mother.gestationWeek}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: roleTheme.text }}>Due Date</p>
                  <p className="mt-1 font-medium" style={{ color: roleTheme.text }}>
                    {mother.dueDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: roleTheme.text }}>Last Visit</p>
                  <p className="mt-1 font-medium" style={{ color: roleTheme.text }}>
                    {mother.lastVisit}
                  </p>
                </div>
                <div>
                  <button
                    className="rounded-lg px-3 py-2 text-sm font-semibold"
                    style={{ backgroundColor: roleTheme.accent, color: "white" }}
                  >
                    Schedule Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
