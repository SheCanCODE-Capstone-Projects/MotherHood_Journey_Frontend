"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Clock, User, CheckCircle, AlertCircle, MapPin } from "lucide-react";

type VisitItem = {
  id: number;
  time: string;
  motherName: string;
  type: string;
  status: "Completed" | "In Progress" | "Scheduled";
  bp: string;
  weight: string;
  notes: string;
};

export default function VisitsPage() {
  const router = useRouter();
  const roleTheme = ROLE_THEMES.health_worker;

  const [todaysVisits, setTodaysVisits] = useState<VisitItem[]>([
    {
      id: 1,
      time: "9:00 AM",
      motherName: "Diane Habimana",
      type: "Antenatal Checkup",
      status: "Completed",
      bp: "120/80",
      weight: "68kg",
      notes: "Week 28, all vitals normal",
    },
    {
      id: 2,
      time: "10:30 AM",
      motherName: "Grace Mukamana",
      type: "High Risk Follow-up",
      status: "In Progress",
      bp: "--",
      weight: "--",
      notes: "gestational diabetes monitoring",
    },
    {
      id: 3,
      time: "2:00 PM",
      motherName: "Sylvie Ingabire",
      type: "Child Immunization",
      status: "Scheduled",
      bp: "--",
      weight: "--",
      notes: "BCG and OPV 1",
    },
  ]);
  const [notesDraft, setNotesDraft] = useState("");
  const [notesTargetId, setNotesTargetId] = useState<number | null>(null);

  const stats = [
    { label: "Today's Visits", value: "3", highlight: true },
    { label: "Completed", value: "1", color: "#10B981" },
    { label: "In Progress", value: "1", color: "#F59E0B" },
    { label: "Pending", value: "1", color: "#6B7280" },
  ];

  const openNotesEditor = () => {
    const targetVisit = todaysVisits.find((visit) => visit.status !== "Completed") ?? todaysVisits[0];

    if (!targetVisit) {
      return;
    }

    setNotesTargetId(targetVisit.id);
    setNotesDraft(targetVisit.notes);
  };

  const saveNotes = () => {
    if (notesTargetId == null) {
      return;
    }

    setTodaysVisits((currentVisits) =>
      currentVisits.map((visit) =>
        visit.id === notesTargetId
          ? {
              ...visit,
              notes: notesDraft.trim() || visit.notes,
            }
          : visit,
      ),
    );
    setNotesTargetId(null);
    setNotesDraft("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visits"
        subtitle="Manage health facility visits and patient follow-ups."
      />

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: roleTheme.border }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold" style={{ color: stat.color || stat.highlight ? roleTheme.accent : "#6B7280" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Visits Schedule */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Today's Visit Schedule</h2>
        <div className="space-y-3">
          {todaysVisits.map((visit) => (
            <div key={visit.id} className="rounded-2xl border-2 p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: roleTheme.accentSoft }}>
                      <Clock className="size-5" style={{ color: roleTheme.accent }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: roleTheme.text }}>{visit.time}</h3>
                      <p className="text-sm" style={{ color: roleTheme.text }}>{visit.motherName}</p>
                    </div>
                  </div>
                  <p className="mt-2 font-medium" style={{ color: roleTheme.text }}>{visit.type}</p>
                  <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>{visit.notes}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    visit.status === "Completed" ? "bg-green-100 text-green-700" :
                    visit.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {visit.status}
                  </span>
                  {visit.status !== "Scheduled" && (
                    <div className="mt-3 text-sm">
                      <p style={{ color: roleTheme.text }}>BP: {visit.bp}</p>
                      <p style={{ color: roleTheme.text }}>Wt: {visit.weight}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border-2 p-5" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft }}>
        <h3 className="font-semibold" style={{ color: roleTheme.text }}>Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.assign("/visits/new")}
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: roleTheme.accent, color: "white" }}
          >
            Record Visit
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/visits/new")}
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ borderColor: roleTheme.border, border: "2px solid", color: roleTheme.text }}
          >
            Schedule Next
          </button>
          <button
            type="button"
            onClick={openNotesEditor}
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ borderColor: roleTheme.border, border: "2px solid", color: roleTheme.text }}
          >
            Add Notes
          </button>
        </div>

        {notesTargetId != null ? (
          <div className="mt-4 rounded-xl border bg-white p-4" style={{ borderColor: roleTheme.border }}>
            <p className="text-sm font-semibold" style={{ color: roleTheme.text }}>
              Add note for {todaysVisits.find((visit) => visit.id === notesTargetId)?.motherName}
            </p>
            <textarea
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              rows={3}
              className="mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: roleTheme.border }}
              placeholder="Write a follow-up note..."
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={saveNotes}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: roleTheme.accent }}
              >
                Save Note
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotesTargetId(null);
                  setNotesDraft("");
                }}
                className="rounded-lg border px-4 py-2 text-sm font-semibold"
                style={{ borderColor: roleTheme.border, color: roleTheme.text }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
