"use client";

import { getMotherProfile } from "@/lib/api/mothers";
import { NidaStatusBadge } from "@/shared/components/status/NidaStatusBadge";
import type { PregnancyDTO } from "@/shared/types/mother";
import {
  Phone,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  Baby,
  CheckCircle2,
  MessageCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

type MotherProfilePageProps = {
  params: Promise<{ motherId: string }>;
};


// Patient Dashboard Section Component
function PatientDashboardSection({
  mother,
  activePregnancy,
  children,
  nextAppointment,
}: {
  mother: any;
  activePregnancy: any;
  children: { id: string; name: string; age: string; vaccinationStatus: "on-track" | "due" | "overdue" }[];
  nextAppointment: any;
}) {
  return (
    <div className="space-y-5">
      {/* Active Pregnancy Card */}
      <div className="rounded-3xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Left - Pregnancy Info */}
          <div>
            <span className="inline-block px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              Active Pregnancy
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Hello, {mother.name.split(' ')[0]}.</h2>
            <p className="text-sm text-gray-600 mb-5">
              You're in <span className="font-semibold text-gray-800">Week {activePregnancy.currentWeek}</span> of your pregnancy. Your baby is the size of an eggplant!
            </p>

            <div className="flex items-end gap-4 mb-4">
              <div>
                <p className="text-5xl font-bold text-gray-900 leading-none">{activePregnancy.daysUntilEdd}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Days Until EDD</p>
              </div>
            </div>

            <div className="h-2 bg-teal-200 rounded-full overflow-hidden w-full max-w-xs mb-2">
              <div
                className="h-full bg-teal-600 rounded-full transition-all"
                style={{ width: `${(activePregnancy.currentWeek / 40) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">Week {activePregnancy.currentWeek} of 40 • Trimester {activePregnancy.trimester}</p>
          </div>

          {/* Right - CHW Card */}
          <div className="bg-teal-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-teal-200 uppercase tracking-wider">Assigned CHW</p>
                <h4 className="font-bold text-lg">{mother.chw.name}</h4>
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-teal-300" />
                <span className="text-sm text-teal-100">{mother.chw.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-teal-300" />
                <span className="text-sm text-teal-100">{nextAppointment.date}</span>
              </div>
              <p className="text-xs text-teal-200">{nextAppointment.time} • {nextAppointment.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
        {/* Quick Actions */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Quick Actions</p>
          <div className="space-y-3">
            <Link href={`/health-worker/mothers/${mother.id}/visits/new`}>
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plus size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Request Service</p>
                    <p className="text-xs text-gray-500">Submit new request</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/patient/chat">
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageCircle size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Chat with CHW</p>
                    <p className="text-xs text-gray-500">Get instant support</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Daily Health Tips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Daily Health Tips</p>
            <div className="flex gap-2">
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden h-40 relative group cursor-pointer hover:shadow-xl transition-shadow bg-teal-700">
              <img src="/imagefood.webp" alt="Third Trimester Essentials" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-semibold text-sm">Third Trimester Essentials</h4>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-40 relative group cursor-pointer hover:shadow-xl transition-shadow bg-teal-700">
              <img src="/sleepPosition.png" alt="Managing Sleep Positions" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-semibold text-sm">Managing Sleep Positions</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Children & Health Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Children List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Children</h3>
            <Link href="/patient/children" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {children.map((child) => {
              const statusConfig = {
                "on-track": { bg: "bg-green-100", text: "text-green-700", label: "On Track" },
                due: { bg: "bg-amber-100", text: "text-amber-700", label: "Due Soon" },
                overdue: { bg: "bg-red-100", text: "text-red-700", label: "Overdue" },
              };
              const status = statusConfig[child.vaccinationStatus];

              return (
                <div key={child.id} className="bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-teal-300 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <Baby size={20} className="text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{child.name}</h4>
                        <p className="text-sm text-gray-500">{child.age}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Blood Pressure</p>
              <div className="mb-1">
                <span className="text-2xl font-bold text-teal-700">118/76</span>
                <span className="text-xs font-semibold text-gray-500 ml-1">mmHg</span>
              </div>
              <p className="text-xs font-semibold text-gray-500">Normal</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight</p>
              <div className="mb-1">
                <span className="text-2xl font-bold text-teal-700">154</span>
                <span className="text-xs font-semibold text-gray-500 ml-1">Lbs</span>
              </div>
              <p className="text-xs font-semibold text-gray-500">+2 this week</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Heart Rate</p>
              <div className="mb-1">
                <span className="text-2xl font-bold text-teal-700">72</span>
                <span className="text-xs font-semibold text-gray-500 ml-1">BPM</span>
              </div>
              <p className="text-xs font-semibold text-gray-500">Normal</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Baby Height</p>
              <div className="mb-1">
                <span className="text-2xl font-bold text-teal-700">High</span>
              </div>
              <p className="text-xs font-semibold text-gray-500">35 cm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Appointment</h3>
        <div className="bg-white rounded-2xl p-5 border-2 border-teal-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
              <Calendar size={24} className="text-teal-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">{nextAppointment.type}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-teal-600" />
                  <span>{nextAppointment.date} at {nextAppointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-teal-600" />
                  <span>{nextAppointment.facilityName}</span>
                </div>
              </div>
            </div>
            <Link
              href="/patient/appointments"
              className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PregnancyCard({
  pregnancy,
  isActive,
  motherId,
}: {
  pregnancy: PregnancyDTO;
  isActive: boolean;
  motherId: string;
}) {
  const statusConfig = {
    active: {
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    completed: {
      className: "bg-[#E8F4F4] text-[#2C6F73] border-[#B9D8D5]",
      dot: "bg-[#2C6F73]",
    },
    lost: {
      className: "bg-red-50 text-red-600 border-red-200",
      dot: "bg-red-500",
    },
    referred: {
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
  };

  const config = statusConfig[pregnancy.status];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${
        isActive
          ? "border-[#2C6F73] bg-gradient-to-r from-[#F0F9F9] to-white ring-1 ring-[#2C6F73]/20"
          : "border-[#D5E9E6] bg-white hover:border-[#2C6F73]/40"
      }`}
    >
      {isActive && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#2C6F73] to-[#5B8784]" />
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isActive ? "bg-[#2C6F73]" : "bg-[#F0F9F9]"
            }`}
          >
            <Baby
              className={`h-4 w-4 ${
                isActive ? "text-white" : "text-[#2C6F73]"
              }`}
            />
          </div>
          <div className="min-w-[80px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
              Gravida · Para
            </p>
            <p className="font-bold text-[#1D5052]">
              G{pregnancy.gravida} · P{pregnancy.para}
            </p>
          </div>
        </div>

        <div className="hidden h-8 w-px bg-[#D5E9E6] sm:block" />
        <div className="min-w-[100px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
            LMP Date
          </p>
          <p className="text-sm font-semibold text-[#1D5052]">
            {new Date(pregnancy.lmpDate + "T00:00:00").toLocaleDateString(
              "en-RW",
              { day: "numeric", month: "short", year: "numeric" }
            )}
          </p>
        </div>

        <div className="hidden h-8 w-px bg-[#D5E9E6] sm:block" />

        <div className="min-w-[100px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5B8784]">
            Due Date (EDD)
          </p>
          <p className="text-sm font-semibold text-[#1D5052]">
            {new Date(pregnancy.eddDate + "T00:00:00").toLocaleDateString(
              "en-RW",
              { day: "numeric", month: "short", year: "numeric" }
            )}
          </p>
        </div>

        <div className="hidden h-8 w-px bg-[#D5E9E6] sm:block" />
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${config.className}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {pregnancy.status}
        </span>
        <div className="ml-auto flex items-center gap-3">
          {isActive && (
            <span className="rounded-full bg-[#2C6F73] px-2.5 py-0.5 text-xs font-semibold text-white">
              Current
            </span>
          )}
          <Link
            href={`/mothers/${motherId}/pregnancies/${pregnancy.id}/visits`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2C6F73] hover:underline"
          >
            Visit History
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MotherProfilePage({
  params,
}: MotherProfilePageProps) {
  const { motherId } = use(params);
  // TODO: Replace with actual API call using react-query
  const mother = {
    id: motherId,
    name: "Sarah Uwera",
    phone: "+250 788 123 456",
    dateOfBirth: "1990-05-15",
    nidaStatus: "verified" as const,
    location: {
      village: "Nyamirambo",
      cell: "Muhima",
      sector: "Nyarugenge",
      district: "Kigali",
      province: "Kigali City",
    },
    chw: {
      id: "chw-1",
      name: "Dr. Helena Smith",
      phone: "+250 788 999 888",
    },
  };

  const activePregnancy = {
    id: "preg-1",
    motherId,
    gravida: 2,
    para: 1,
    lmpDate: "2024-02-01",
    eddDate: "2024-12-15",
    status: "active" as const,
    isActive: true,
    currentWeek: 28,
    trimester: 3,
    daysUntilEdd: 84,
  };

  const pregnancies = [activePregnancy];

  const children = [
    { id: "1", name: "Grace Uwera", age: "1y 3m", vaccinationStatus: "on-track" as const },
    { id: "2", name: "Emmanuel Mugisha", age: "3y 2m", vaccinationStatus: "due" as const },
  ];

  const nextAppointment = {
    id: "apt-1",
    date: "Oct 14, 2024",
    time: "2:00 PM",
    facilityName: "Nyamata Health Center",
    type: "Prenatal Check-up",
  };

  const initials = mother.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Patient Dashboard Section */}
      <PatientDashboardSection
        mother={mother}
        activePregnancy={activePregnancy}
        children={children}
        nextAppointment={nextAppointment}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-5">
          <section className="rounded-3xl border border-[#D5E9E6] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D5052] to-[#2C6F73] text-3xl font-bold text-white shadow-md">
                  {initials}
                </div>
               {mother.nidaStatus === "verified" && (
  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow">
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2C6F73]">
      <CheckCircle2 className="h-3 w-3 text-white" />
    </div>
  </div>
)}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-[#1D5052]">
                      {mother.name}
                    </h1>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                      Digital Health ID:{" "}
                      <span className="font-bold text-[#2C6F73]">
                        {mother.id}
                      </span>
                    </p>
                  </div>
                  {activePregnancy ? (
                    <button className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100">
                      Close Pregnancy
                    </button>
                  ) : (
                    <button className="rounded-full bg-[#2C6F73] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D5052]">
                      + New Pregnancy
                    </button>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-8">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                      Contact Number
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#2C6F73]" />
                      <span className="text-sm font-semibold text-[#1D5052]">
                        {mother.phone}
                      </span>
                      <NidaStatusBadge status={mother.nidaStatus} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                      Location
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#2C6F73]" />
                      <span className="text-sm font-semibold text-[#1D5052]">
                        {mother.location.village}, {mother.location.cell},{" "}
                        {mother.location.sector}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#D5E9E6] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1D5052]">
                  Pregnancy Timeline
                </h2>
                <p className="text-sm text-[#5B8784]">
                  {pregnancies.length} record
                  {pregnancies.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            {pregnancies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#B9D8D5] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F9F9]">
                  <Calendar className="h-7 w-7 text-[#2C6F73]" />
                </div>
                <p className="mt-3 font-semibold text-[#1D5052]">
                  No pregnancies recorded
                </p>
                <p className="mt-1 text-sm text-[#5B8784]">
                  Start by opening a new pregnancy record
                </p>
                <button className="mt-5 rounded-full bg-[#2C6F73] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]">
                  + Open New Pregnancy
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pregnancies.map((pregnancy) => (
                  <PregnancyCard
                    key={pregnancy.id}
                    pregnancy={pregnancy}
                    isActive={pregnancy.id === activePregnancy?.id}
                    motherId={mother.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="w-full space-y-4 lg:w-72 lg:shrink-0">

          {activePregnancy ? (
            <div className="rounded-3xl bg-gradient-to-br from-[#1D5052] to-[#2C6F73] p-5 shadow-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B9D8D5]">
                Active Pregnancy
              </p>
              <div className="mt-3 flex items-start gap-3">
                <div className="rounded-xl bg-white/20 px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-white">
                    G{activePregnancy.gravida}
                  </p>
                  <p className="text-xs text-[#B9D8D5]">Gravida</p>
                </div>
                <div className="rounded-xl bg-white/20 px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-white">
                    P{activePregnancy.para}
                  </p>
                  <p className="text-xs text-[#B9D8D5]">Para</p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5 border-t border-white/20 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#B9D8D5]">
                    LMP Date
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(
                      activePregnancy.lmpDate + "T00:00:00"
                    ).toLocaleDateString("en-RW", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#B9D8D5]">
                    Due Date
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(
                      activePregnancy.eddDate + "T00:00:00"
                    ).toLocaleDateString("en-RW", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#B9D8D5] bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F0F9F9]">
                <Baby className="h-6 w-6 text-[#2C6F73]" />
              </div>
              <p className="mt-2 font-semibold text-[#1D5052]">
                No Active Pregnancy
              </p>
              <p className="mt-1 text-xs text-[#5B8784]">
                Open a new pregnancy to get started
              </p>
              <button className="mt-3 w-full rounded-full bg-[#2C6F73] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D5052]">
                + Open New Pregnancy
              </button>
            </div>
          )}

          {/* CHW Card */}
          <div className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
              Assigned CHW
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1D5052] to-[#2C6F73]">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1D5052]">
                  {mother.chw.name}
                </p>
                <p className="text-xs text-[#5B8784]">
                  Community Health Worker
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-[#D5E9E6] pt-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F9F9]">
                  <Phone className="h-3.5 w-3.5 text-[#2C6F73]" />
                </div>
                <p className="text-sm font-medium text-[#1D5052]">
                  {mother.chw.phone}
                </p>
              </div>
              <button className="mt-3 w-full rounded-full border border-[#2C6F73] py-2 text-xs font-semibold text-[#2C6F73] transition-colors hover:bg-[#F0F9F9]">
                Connect with CHW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}