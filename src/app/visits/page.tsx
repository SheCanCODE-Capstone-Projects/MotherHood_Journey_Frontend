"use client";

import Link from "next/link";
import { Users, Calendar } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function VisitsPage() {
  const roleTheme = ROLE_THEMES.health_worker;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Patient Visits"
        subtitle="Record and manage health facility visits and patient follow-ups."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Today&apos;s schedule</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">Visit Management</h3>
              <p className="mt-2 text-sm text-[#54797C]">Track clinic visits, record outcomes, and follow-ups.</p>
            </div>
            <Users className="size-8 text-[#1D5551]" />
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

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Calendar className="mt-0.5 size-6 text-purple-600" />
            <div>
              <p className="font-semibold text-purple-900">No visits recorded today</p>
              <p className="mt-1 text-sm text-purple-800">Visits will be displayed here as they are recorded in the system.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Quick Actions</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFFE] p-4 hover:bg-[#F5FFFE] transition">
            <p className="font-medium text-[#11403F]">New Visit</p>
            <p className="mt-1 text-xs text-[#54797C]">Record a patient clinic visit or checkup.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4 hover:bg-[#F5FFFE] transition">
            <p className="font-medium text-[#11403F]">View History</p>
            <p className="mt-1 text-xs text-[#54797C]">Review patient visit history and outcomes.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4 hover:bg-[#F5FFFE] transition">
            <p className="font-medium text-[#11403F]">Schedule Follow-up</p>
            <p className="mt-1 text-xs text-[#54797C]">Book follow-up appointments for patients.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
