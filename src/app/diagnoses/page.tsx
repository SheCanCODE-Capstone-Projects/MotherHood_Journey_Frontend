"use client";

import Link from "next/link";
import { AlertCircle, Stethoscope } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function DiagnosesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Patient Diagnoses"
        subtitle="Review and manage maternal health diagnoses and medical conditions."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Diagnosis records</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">Health Conditions</h3>
              <p className="mt-2 text-sm text-[#54797C]">Manage and track maternal health diagnoses.</p>
            </div>
            <Stethoscope className="size-8 text-[#E85D75]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Link href="/mothers">
              <Button variant="default" size="sm">View patients</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-0.5 size-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">No diagnosed cases</p>
              <p className="mt-1 text-sm text-red-800">Patient diagnosis records will appear here once they are recorded.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Common Conditions Tracked</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Hypertension</p>
            <p className="mt-1 text-xs text-[#54797C]">High blood pressure monitoring and management.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Anemia</p>
            <p className="mt-1 text-xs text-[#54797C]">Blood disorders and supplement tracking.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Gestational Diabetes</p>
            <p className="mt-1 text-xs text-[#54797C]">Blood glucose management during pregnancy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
