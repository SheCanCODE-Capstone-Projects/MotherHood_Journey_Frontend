"use client";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AppointmentsPage() {
  const roleTheme = ROLE_THEMES.patient;

  const upcomingAppointments = [
    {
      id: 1,
      date: "May 10, 2024",
      time: "10:00 AM",
      type: "Child Checkup",
      facility: "Nyamata Health Center",
      notes: "Routine immunizations scheduled",
      reminder: true,
    },
    {
      id: 2,
      date: "May 19, 2024",
      time: "2:00 PM",
      type: "Antenatal Visit",
      facility: "Nyamata Health Center",
      notes: "Week 30 checkup",
      reminder: true,
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      date: "April 5, 2024",
      type: "Antenatal Checkup",
      facility: "Nyamata Health Center",
      notes: "Week 28 - All normal",
    },
    {
      id: 4,
      date: "March 22, 2024",
      type: "Ultrasound Scan",
      facility: "Nyamata Health Center",
      notes: "Baby development confirmed",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle="Your upcoming visits and care schedule."
      />

      {/* Upcoming Appointments */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: roleTheme.text }}>Upcoming Appointments</h2>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>{upcomingAppointments.length} scheduled</span>
        </div>
        <div className="space-y-3">
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: roleTheme.text }}>{apt.type}</h3>
                  <div className="mt-3 space-y-2 text-sm" style={{ color: roleTheme.text }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" style={{ color: roleTheme.accent }} />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4" style={{ color: roleTheme.accent }} />
                      <span>{apt.facility}</span>
                    </div>
                  </div>
                  <p className="mt-3 rounded-lg px-3 py-1 text-sm" style={{ backgroundColor: roleTheme.accentSoft }}>
                    {apt.notes}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  {apt.reminder && (
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>🔔 Reminder set</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Appointments */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Past Appointments</h2>
        <div className="space-y-3">
          {pastAppointments.map((apt) => (
            <div key={apt.id} className="flex items-start gap-4 rounded-2xl border p-4" style={{ borderColor: roleTheme.border }}>
              <CheckCircle className="size-6 mt-0.5 shrink-0" style={{ color: '#10B981' }} />
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: roleTheme.text }}>{apt.type}</h3>
                <p className="text-sm" style={{ color: roleTheme.text }}>📅 {apt.date}</p>
                <p className="text-sm" style={{ color: roleTheme.text }}>📋 {apt.facility}</p>
                <p className="mt-2 rounded-lg px-3 py-1 text-sm" style={{ backgroundColor: roleTheme.accentSoft }}>{apt.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Care Tips */}
      <section className="rounded-3xl border-2 p-6" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft }}>
        <h3 className="font-semibold" style={{ color: roleTheme.text }}>💡 Care Tips</h3>
        <ul className="mt-3 space-y-2 text-sm" style={{ color: roleTheme.text }}>
          <li>• Arrive 10 minutes early to your appointments</li>
          <li>• Keep your vaccination card with you</li>
          <li>• Write down any questions before your visit</li>
          <li>• Contact the facility if you need to reschedule</li>
        </ul>
      </section>
    </div>
  );
}
