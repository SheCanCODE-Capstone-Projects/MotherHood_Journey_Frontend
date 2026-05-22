"use client";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function ChildAppointmentsPage() {
  const roleTheme = ROLE_THEMES.patient;

  const childAppointments = [
    {
      id: 1,
      childName: "Grace Uwera",
      date: "May 10, 2024",
      time: "10:00 AM",
      type: "Immunization",
      facility: "Nyamata Health Center",
      notes: "Bring vaccination card",
    },
    {
      id: 2,
      childName: "James K.",
      date: "May 18, 2024",
      time: "09:30 AM",
      type: "Growth Check",
      facility: "Kigali Clinic",
      notes: "Weight & length measurements",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Children Appointments" subtitle="Upcoming appointments for your children." />

      <section>
        <div className="space-y-3">
          {childAppointments.map((apt) => (
            <div key={apt.id} className="rounded-3xl border p-4" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: roleTheme.text }}>{apt.childName} — {apt.type}</h3>
                  <div className="mt-2 text-sm" style={{ color: roleTheme.text }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" style={{ color: roleTheme.accent }} />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4" style={{ color: roleTheme.accent }} />
                      <span>{apt.facility}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm" style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>{apt.notes}</p>
                </div>
                <div className="ml-4 text-right">
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>View</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
