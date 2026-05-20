"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, User, MapPin, Phone, Pill, Activity, FileText } from "lucide-react";
import { use } from "react";

type ChildDetailsPageProps = {
  params: Promise<{
    childId: string;
  }>;
};

// Mock data for children
const mockChildrenData: Record<string, any> = {
  "child-001": {
    id: "child-001",
    first_name: "Amara",
    last_name: "Uwimana",
    gender: "FEMALE",
    date_of_birth: "2026-04-15",
    age: "1 month",
    mother_name: "Uwimana Marie",
    mother_phone: "+250789123456",
    facility: "Nyamata Health Center",
    immunization_status: "Up to date",
    completed_vaccinations: 3,
    total_vaccinations: 12,
    growth_status: "Normal",
    last_checkup: "2026-05-15",
    next_appointment: "2026-06-15",
    conditions: ["Healthy"],
  },
  "child-002": {
    id: "child-002",
    first_name: "Ishimwe",
    last_name: "Mukamana",
    gender: "MALE",
    date_of_birth: "2026-03-22",
    age: "2 months",
    mother_name: "Mukamana Jeanne",
    mother_phone: "+250788654321",
    facility: "Nyamata Health Center",
    immunization_status: "Due for checkup",
    completed_vaccinations: 4,
    total_vaccinations: 12,
    growth_status: "Normal",
    last_checkup: "2026-05-10",
    next_appointment: "2026-05-25",
    conditions: ["Monitoring"],
  },
};

export default function ChildDetailsPage({ params }: ChildDetailsPageProps) {
  const resolvedParams = use(params);
  const childId = decodeURIComponent(resolvedParams.childId);
  const child = mockChildrenData[childId];

  if (!child) {
    return (
      <div className="space-y-6">
        <Link
          href="/children"
          className="inline-flex items-center gap-2 text-[#2C6F73] hover:text-[#1D5052] font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Children
        </Link>
        <div className="rounded-3xl border border-[#D5E9E6] bg-white p-12 text-center">
          <p className="text-lg text-[#5B8784]">Child record not found</p>
        </div>
      </div>
    );
  }

  const vaccineProgress = Math.round((child.completed_vaccinations / child.total_vaccinations) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/children"
          className="inline-flex items-center gap-2 text-[#2C6F73] hover:text-[#1D5052] font-semibold transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Children
        </Link>
      </div>

      {/* Child Profile Card */}
      <div className="rounded-3xl border border-[#D5E9E6] bg-gradient-to-br from-[#E8F5F2] to-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1D5052]">
              {child.first_name} {child.last_name}
            </h1>
            <p className="mt-2 text-lg text-[#5B8784]">
              {child.age} • {child.gender}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                <Activity className="h-4 w-4" />
                {child.growth_status}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                <Pill className="h-4 w-4" />
                {child.immunization_status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-[#2C6F73]">{child.age}</div>
            <p className="mt-1 text-sm text-[#5B8784]">Age</p>
          </div>
        </div>

        {/* Vaccination Progress */}
        <div className="mt-8 rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#1D5052]">Vaccination Progress</h3>
            <span className="text-sm font-bold text-[#2C6F73]">{vaccineProgress}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-[#D5E9E6]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2C6F73] to-[#085041] transition-all"
              style={{ width: `${vaccineProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[#5B8784]">
            {child.completed_vaccinations} of {child.total_vaccinations} vaccinations completed
          </p>
        </div>
      </div>

      {/* Mother Information */}
      <div className="rounded-3xl border border-[#D5E9E6] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1D5052] mb-6 flex items-center gap-3">
          <User className="h-6 w-6 text-[#2C6F73]" />
          Mother's Information
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-[#F8FBFB] p-4">
            <p className="text-xs uppercase tracking-widest text-[#5B8784] font-semibold">Name</p>
            <p className="mt-2 text-xl font-semibold text-[#1D5052]">{child.mother_name}</p>
          </div>
          <div className="rounded-2xl bg-[#F8FBFB] p-4">
            <p className="text-xs uppercase tracking-widest text-[#5B8784] font-semibold">Phone</p>
            <p className="mt-2 text-xl font-semibold text-[#1D5052] flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {child.mother_phone}
            </p>
          </div>
        </div>
      </div>

      {/* Facility & Appointments */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#D5E9E6] bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#1D5052] mb-4 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-[#2C6F73]" />
            Facility
          </h3>
          <p className="text-xl font-semibold text-[#2C6F73]">{child.facility}</p>
        </div>

        <div className="rounded-3xl border border-[#D5E9E6] bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#1D5052] mb-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#2C6F73]" />
            Next Appointment
          </h3>
          <p className="text-xl font-semibold text-[#2C6F73]">{child.next_appointment}</p>
        </div>
      </div>

      {/* Checkup History */}
      <div className="rounded-3xl border border-[#D5E9E6] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1D5052] mb-6 flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#2C6F73]" />
          Recent Checkup
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[#F8FBFB] p-4">
            <p className="text-xs uppercase tracking-widest text-[#5B8784] font-semibold">Last Checkup</p>
            <p className="mt-2 text-lg font-semibold text-[#1D5052]">{child.last_checkup}</p>
          </div>
          <div className="rounded-2xl bg-[#F8FBFB] p-4">
            <p className="text-xs uppercase tracking-widest text-[#5B8784] font-semibold">Status</p>
            <p className="mt-2 text-lg font-semibold text-green-600">Healthy</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-6">
        <Link
          href={`/children/${childId}/vaccinations`}
          className="inline-flex items-center gap-2 rounded-full bg-[#2C6F73] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]"
        >
          <Pill className="h-4 w-4" />
          View Vaccinations
        </Link>
        <Link
          href={`/children/${childId}/appointments`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#2C6F73] px-8 py-3 text-sm font-semibold text-[#2C6F73] transition-colors hover:bg-[#F8FBFB]"
        >
          <Calendar className="h-4 w-4" />
          View Appointments
        </Link>
      </div>
    </div>
  );
}
