"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  CalendarDays,
  Syringe,
  ClipboardList,
  UserPlus,
  FilePlus,
  Baby,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useRole } from "@/shared/hooks/useRole";
import { useAuth } from "@/shared/hooks/useAuth";
import { getVisits } from "@/lib/api/visits";
import { getMothers } from "@/lib/api/mothers";
import { cn } from "@/shared/lib/utils";

const VISIT_TYPE_LABELS: Record<string, string> = {
  ANC: "Antenatal Care",
  PNC: "Postnatal Care",
  IMMUNIZATION: "Immunization",
  SICK_CHILD: "Sick Child",
  GROWTH_MONITORING: "Growth Monitoring",
};

const VISIT_TYPE_COLOR: Record<string, string> = {
  ANC: "bg-blue-50 text-blue-700",
  PNC: "bg-purple-50 text-purple-700",
  IMMUNIZATION: "bg-emerald-50 text-emerald-700",
  SICK_CHILD: "bg-red-50 text-red-700",
  GROWTH_MONITORING: "bg-amber-50 text-amber-700",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffH = Math.floor(diffMs / (60 * 60 * 1000));
  const diffD = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  return `${diffD}d ago`;
}

export default function HealthWorkerDashboard() {
  const { roleTheme, displayName } = useRole({ fallbackRole: "health_worker" });
  const { currentUser } = useAuth();

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: ["visits"],
    queryFn: () => getVisits(),
  });

  const { data: mothers, isLoading: mothersLoading } = useQuery({
    queryKey: ["mothers"],
    queryFn: () => getMothers(),
  });

  const todayVisits = visits?.filter((v) => {
    const visitDate = new Date(v.recorded_at).toDateString();
    return visitDate === new Date().toDateString();
  }) ?? [];

  const pendingNida = mothers?.filter((m) => m.nidaStatus === "pending").length ?? 0;
  const recentVisits = visits?.slice(0, 5) ?? [];

  const quickActions = [
    { href: "/mothers/register", icon: UserPlus, label: "Register Mother", desc: "Add a new mother to the system" },
    { href: "/visits/new", icon: FilePlus, label: "Record Visit", desc: "Log a clinical visit" },
    { href: "/appointments/new", icon: CalendarDays, label: "Schedule Appointment", desc: "Book a patient appointment" },
    { href: "/vaccinations", icon: Syringe, label: "Vaccinations", desc: "Run a vaccination session" },
    { href: "/children/register", icon: Baby, label: "Register Child", desc: "Register a newborn" },
    { href: "/mothers", icon: Users, label: "View Mothers", desc: "Search mother records" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" suppressHydrationWarning>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
          {displayName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-gray-500" suppressHydrationWarning>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Visits Today",
            value: visitsLoading ? "—" : todayVisits.length,
            icon: ClipboardList,
            color: roleTheme.accent,
            bg: roleTheme.accentSoft,
          },
          {
            label: "Total Mothers",
            value: mothersLoading ? "—" : mothers?.length ?? 0,
            icon: Users,
            color: "#2A7F8A",
            bg: "#E1F3F6",
          },
          {
            label: "Pending NIDA",
            value: mothersLoading ? "—" : pendingNida,
            icon: AlertTriangle,
            color: "#D97706",
            bg: "#FEF3C7",
          },
          {
            label: "Visits This Week",
            value: visitsLoading ? "—" : visits?.length ?? 0,
            icon: CalendarDays,
            color: "#059669",
            bg: "#D1FAE5",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-3xl border bg-white p-5 shadow-sm"
              style={{ borderColor: roleTheme.border }}
            >
              <div
                className="grid size-12 shrink-0 place-items-center rounded-2xl"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon className="size-6" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-opacity-70"
              style={{ borderColor: roleTheme.border }}
            >
              <div
                className="grid size-10 shrink-0 place-items-center rounded-xl transition-colors group-hover:opacity-90"
                style={{ backgroundColor: roleTheme.accentSoft }}
              >
                <Icon className="size-5" style={{ color: roleTheme.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 truncate">{desc}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent visits */}
      <div
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        style={{ borderColor: roleTheme.border }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4" style={{ color: roleTheme.accent }} />
            <h2 className="text-base font-semibold text-gray-800">Recent Visits</h2>
          </div>
          <Link
            href="/visits"
            className="text-xs font-medium transition-colors hover:opacity-70"
            style={{ color: roleTheme.accent }}
          >
            View all →
          </Link>
        </div>

        {visitsLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400">
            <Loader2 className="size-4 animate-spin" /> Loading visits…
          </div>
        ) : recentVisits.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            No visits recorded yet.{" "}
            <Link href="/visits/new" className="font-medium underline" style={{ color: roleTheme.accent }}>
              Record first visit
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentVisits.map((visit) => (
              <li key={visit.visit_id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                <div
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: roleTheme.accent }}
                >
                  {visit.patient_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">{visit.patient_name}</p>
                  <p className="text-xs text-gray-400">{visit.patient_health_id}</p>
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", VISIT_TYPE_COLOR[visit.visit_type] ?? "bg-gray-100 text-gray-600")}>
                  {VISIT_TYPE_LABELS[visit.visit_type] ?? visit.visit_type}
                </span>
                <span className="shrink-0 text-xs text-gray-400">{timeAgo(visit.recorded_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
