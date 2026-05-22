"use client";

import { useState } from "react";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { AlertCircle, CheckCircle, TrendingUp, User } from "lucide-react";

type DiagnosisStatus = "Active" | "Monitoring" | "Resolved";

type Diagnosis = {
  id: number;
  motherName: string;
  condition: string;
  severity: "High" | "Medium" | "Low";
  dateConfirmed: string;
  status: DiagnosisStatus;
  nextReview: string;
  notes: string;
};

const STATUS_ROTATION: DiagnosisStatus[] = ["Active", "Monitoring", "Resolved"];

function getNextStatus(currentStatus: DiagnosisStatus): DiagnosisStatus {
  const currentIndex = STATUS_ROTATION.indexOf(currentStatus);
  return STATUS_ROTATION[(currentIndex + 1) % STATUS_ROTATION.length];
}

export default function DiagnosesPage() {
  const roleTheme = ROLE_THEMES.health_worker;

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    {
      id: 1,
      motherName: "Grace Mukamana",
      condition: "Gestational Diabetes",
      severity: "High",
      dateConfirmed: "Mar 15, 2024",
      status: "Active",
      nextReview: "May 1, 2024",
      notes: "Requires dietary management and monitoring",
    },
    {
      id: 2,
      motherName: "Agnes Nsabiyumva",
      condition: "Pregnancy-Induced Hypertension",
      severity: "Medium",
      dateConfirmed: "Apr 2, 2024",
      status: "Monitoring",
      nextReview: "Apr 20, 2024",
      notes: "BP readings stable, continue monitoring",
    },
    {
      id: 3,
      motherName: "Beatrice Ingabire",
      condition: "Anemia",
      severity: "Low",
      dateConfirmed: "Mar 28, 2024",
      status: "Resolved",
      nextReview: "May 10, 2024",
      notes: "Iron supplementation prescribed",
    },
  ]);

  const updateDiagnosisStatus = (id: number) => {
    setDiagnoses((currentDiagnoses) =>
      currentDiagnoses.map((diagnosis) =>
        diagnosis.id === id
          ? {
              ...diagnosis,
              status: getNextStatus(diagnosis.status),
            }
          : diagnosis,
      ),
    );
  };

  const stats = [
    { label: "Total Cases", value: "3", icon: User },
    { label: "Active Cases", value: "2", icon: AlertCircle, color: "#EF4444" },
    { label: "Resolved", value: "1", icon: CheckCircle, color: "#10B981" },
    { label: "Trending Up", value: "2", icon: TrendingUp, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Diagnoses"
        subtitle="Review and manage maternal health diagnoses and conditions."
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
                  <p className="mt-2 text-3xl font-bold" style={{ color: stat.color || roleTheme.accent }}>
                    {stat.value}
                  </p>
                </div>
                <Icon className="size-6" style={{ color: stat.color || roleTheme.accent }} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Diagnosed Cases */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Diagnosed Maternal Conditions</h2>
        <div className="space-y-3">
          {diagnoses.map((diagnosis) => (
            <div key={diagnosis.id} className="rounded-2xl border-2 p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: roleTheme.text }}>{diagnosis.condition}</h3>
                  <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>Patient: {diagnosis.motherName}</p>
                  <p className="mt-2 rounded-lg px-3 py-1 text-sm" style={{ backgroundColor: roleTheme.accentSoft }}>
                    {diagnosis.notes}
                  </p>
                  <div className="mt-3 grid gap-4 md:grid-cols-3 text-sm">
                    <div>
                      <p className="font-semibold" style={{ color: roleTheme.text }}>Date Confirmed</p>
                      <p style={{ color: roleTheme.text }}>{diagnosis.dateConfirmed}</p>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: roleTheme.text }}>Next Review</p>
                      <p style={{ color: roleTheme.text }}>{diagnosis.nextReview}</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => updateDiagnosisStatus(diagnosis.id)}
                        className="rounded-lg px-3 py-2 text-sm font-semibold"
                        style={{ backgroundColor: roleTheme.accent, color: "white" }}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-2 ${
                    diagnosis.severity === "High" ? "bg-red-100 text-red-700" :
                    diagnosis.severity === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {diagnosis.severity}
                  </div>
                  <p className="mt-1 text-xs font-medium" style={{ color: roleTheme.text }}>{diagnosis.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
