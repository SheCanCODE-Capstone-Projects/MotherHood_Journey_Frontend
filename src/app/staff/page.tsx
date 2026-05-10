"use client";

import Link from "next/link";
import { Users, UserCheck } from "lucide-react";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function StaffPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <PageHeader
        title="Staff Management"
        subtitle="View facility staff members, roles, and assignments."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E8F6F5] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8784]">Team directory</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#11403F]">Staff Members</h3>
              <p className="mt-2 text-sm text-[#54797C]">Manage facility team and role assignments.</p>
            </div>
            <Users className="size-8 text-[#1D5551]" />
          </div>

          <div className="mt-5 flex gap-3">
            <Link href="/reports">
              <Button variant="default" size="sm">View reports</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8F6F5] bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <UserCheck className="mt-0.5 size-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Team information loading</p>
              <p className="mt-1 text-sm text-green-800">Facility staff directory and role information will display here.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F0F6F6] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D5052]">Staff Categories</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Health Workers</p>
            <p className="mt-1 text-xs text-[#54797C]">Nurses and community health workers.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Administrators</p>
            <p className="mt-1 text-xs text-[#54797C]">Facility managers and coordinators.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF6F5] bg-[#FAFFTE] p-4">
            <p className="font-medium text-[#11403F]">Support Staff</p>
            <p className="mt-1 text-xs text-[#54797C]">Administrative and support personnel.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
