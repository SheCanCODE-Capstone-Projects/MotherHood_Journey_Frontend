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
  TrendingUp,
  Activity,
} from "lucide-react";

import { useSession } from "next-auth/react";
import { useRole } from "@/shared/hooks/useRole";
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
  ANC:               "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  PNC:               "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  IMMUNIZATION:      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  SICK_CHILD:        "bg-red-50 text-red-700 ring-1 ring-red-200",
  GROWTH_MONITORING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffH = Math.floor(diffMs / (60 * 60 * 1000));
  const diffD = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  return `${diffD}d ago`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HealthWorkerDashboard() {
  const { roleTheme, displayName } = useRole({ fallbackRole: "health_worker" });
  const { data: session } = useSession();
  const facilityId = session?.user?.facilityId
    ? String(session.user.facilityId)
    : undefined;

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: ["visits", facilityId],
    queryFn: () => getVisits(facilityId),
  });

  const { data: mothers, isLoading: mothersLoading } = useQuery({
    queryKey: ["mothers"],
    queryFn: () => getMothers(),
  });

  const todayVisits =
    visits?.filter(
      (v) => new Date(v.recorded_at).toDateString() === new Date().toDateString(),
    ) ?? [];

  const pendingNida = mothers?.filter((m) => m.nidaStatus === "pending").length ?? 0;
  const recentVisits = visits?.slice(0, 6) ?? [];

  const stats = [
    {
      label: "Visits Today",
      value: visitsLoading ? null : todayVisits.length,
      icon: ClipboardList,
      trend: "+2 from yesterday",
      color: roleTheme.accent,
      bg: roleTheme.accentSoft,
    },
    {
      label: "Total Mothers",
      value: mothersLoading ? null : (mothers?.length ?? 0),
      icon: Users,
      trend: "Registered in your facility",
      color: "#2A7F8A",
      bg: "#E1F3F6",
    },
    {
      label: "Pending NIDA",
      value: mothersLoading ? null : pendingNida,
      icon: AlertTriangle,
      trend: pendingNida > 0 ? "Action required" : "All verified",
      color: pendingNida > 0 ? "#D97706" : "#059669",
      bg: pendingNida > 0 ? "#FEF3C7" : "#D1FAE5",
    },
    {
      label: "This Week",
      value: visitsLoading ? null : (visits?.length ?? 0),
      icon: TrendingUp,
      trend: "Total visits recorded",
      color: "#059669",
      bg: "#D1FAE5",
    },
  ];

  const quickActions = [
    { href: "/mothers/register", icon: UserPlus,    label: "Register Mother",    desc: "Add a new mother" },
    { href: "/visits/new",       icon: FilePlus,    label: "Record Visit",       desc: "Log a clinical visit" },
    { href: "/appointments/new", icon: CalendarDays,label: "Schedule Appointment",desc: "Book a patient visit" },
    { href: "/vaccinations",     icon: Syringe,     label: "Vaccinations",       desc: "Run vaccination session" },
    { href: "/children/register",icon: Baby,        label: "Register Child",     desc: "Register a newborn" },
    { href: "/mothers",          icon: Users,       label: "View Mothers",       desc: "Search all records" },
  ];

  return (
    <div className="space-y-6">

      {/* ── Greeting header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" suppressHydrationWarning>
            {greeting()}, {displayName.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500" suppressHydrationWarning>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div
          className="hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold sm:flex"
          style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.accent }}
        >
          <Activity className="size-3.5" />
          Live data
        </div>
      </div>

      {/* ── KPI stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, trend, color, bg }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            style={{ borderColor: roleTheme.border }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-4 -top-4 size-20 rounded-full opacity-10"
              style={{ backgroundColor: color }}
            />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div
                  className="grid size-10 place-items-center rounded-xl"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="size-5" style={{ color }} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  {label}
                </p>
                <p className="mt-1 text-3xl font-bold" style={{ color }}>
                  {value === null ? (
                    <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-gray-100" />
                  ) : (
                    value
                  )}
                </p>
                <p className="mt-1 text-[12px] text-gray-400">{trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick actions + Recent visits (2-col on desktop) ── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Quick actions — 2 cols */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-gray-400">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: roleTheme.border }}
              >
                <div
                  className="grid size-9 place-items-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: roleTheme.accentSoft }}
                >
                  <Icon className="size-4.5" style={{ color: roleTheme.accent }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold leading-tight text-gray-800">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-gray-400">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent visits — 3 cols */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Recent Visits
            </h2>
            <Link
              href="/visits"
              className="flex items-center gap-1 text-[12px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: roleTheme.accent }}
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>

          <div
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            {visitsLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-gray-400">
                <Loader2 className="size-4 animate-spin" />
                Loading visits…
              </div>
            ) : recentVisits.length === 0 ? (
              <div className="py-12 text-center">
                <ClipboardList className="mx-auto size-8 text-gray-200" />
                <p className="mt-2 text-[13px] text-gray-400">No visits recorded yet.</p>
                <Link
                  href="/visits/new"
                  className="mt-1 inline-block text-[13px] font-semibold underline"
                  style={{ color: roleTheme.accent }}
                >
                  Record first visit →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {recentVisits.map((visit) => (
                  <li
                    key={visit.visit_id}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50/60"
                  >
                    <div
                      className="grid size-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white"
                      style={{ backgroundColor: roleTheme.accent }}
                    >
                      {visit.patient_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-gray-800">
                        {visit.patient_name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {visit.patient_health_id}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        VISIT_TYPE_COLOR[visit.visit_type] ??
                          "bg-gray-100 text-gray-600",
                      )}
                    >
                      {VISIT_TYPE_LABELS[visit.visit_type] ?? visit.visit_type}
                    </span>
                    <span className="shrink-0 text-[11px] text-gray-400">
                      {timeAgo(visit.recorded_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
