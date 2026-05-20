"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Baby,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  RefreshCcw,
  ShieldPlus,
  Stethoscope,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";

type DashboardCard = {
  label: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type MetricCard = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  tone?: "success" | "warning";
};

type DashboardContent = {
  title: string;
  subtitle: string;
  eyebrow: string;
  spotlight: {
    label: string;
    value: string;
    description: string;
  };
  cards: DashboardCard[];
  metrics: MetricCard[];
  priorities: string[];
  activity: string[];
};

const dashboardContent: Record<UserRole, DashboardContent> = {
  patient: {
    title: "Dashboard",
    subtitle: "A calm overview of your pregnancy, visits, and child health follow-ups.",
    eyebrow: "Care journey",
    spotlight: {
      label: "Next appointment",
      value: "Thursday, 09:30",
      description: "Nyamata Health Center antenatal check-in.",
    },
    metrics: [
      { label: "Pregnancy week", value: "28", trend: "Healthy progress", icon: Baby, tone: "success" },
      { label: "Upcoming visits", value: "2", trend: "Next 30 days", icon: CalendarDays },
      { label: "Completed tasks", value: "84%", trend: "+6% this month", icon: CheckCircle2, tone: "success" },
    ],
    cards: [
      { label: "Pregnancy", title: "Current Week", description: "Track your latest stage, milestones, and care guidance.", href: "/pregnancies", icon: Baby },
      { label: "Appointments", title: "Upcoming Visit", description: "Review your scheduled facility appointments.", href: "/appointments", icon: CalendarDays },
      { label: "Children", title: "Follow-up Status", description: "Check immunization and child health reminders.", href: "/children", icon: HeartPulse },
    ],
    priorities: ["Confirm transport for your next visit", "Review iron supplement reminder", "Update emergency contact details"],
    activity: ["Antenatal visit marked complete", "Child follow-up reminder added", "Pregnancy milestone updated"],
  },
  health_worker: {
    title: "Dashboard",
    subtitle: "Monitor patient workload, high-risk follow-ups, and today's maternal care activity.",
    eyebrow: "Clinical overview",
    spotlight: {
      label: "Scheduled today",
      value: "12 visits",
      description: "3 require priority review before noon.",
    },
    metrics: [
      { label: "Active mothers", value: "24", trend: "+4 this week", icon: Users },
      { label: "High risk cases", value: "3", trend: "Needs follow-up", icon: ShieldPlus, tone: "warning" },
      { label: "Completed visits", value: "18", trend: "Today", icon: Stethoscope, tone: "success" },
    ],
    cards: [
      { label: "Active Cases", title: "Patients Under Care", description: "Monitor ongoing maternal care cases.", href: "/mothers", icon: Users },
      { label: "Visits", title: "Scheduled Today", description: "View your patient visit schedule.", href: "/visits", icon: CalendarDays },
      { label: "Diagnoses", title: "Recent Cases", description: "Review diagnosed maternal health conditions.", href: "/diagnoses", icon: ClipboardList },
    ],
    priorities: ["Review 3 high-risk mother records", "Prepare morning visit notes", "Close pending diagnosis summaries"],
    activity: ["Grace Mukamana flagged for review", "6 visit records synced", "New diagnosis draft created"],
  },
  facility_admin: {
    title: "Dashboard",
    subtitle: "Keep facility staffing, reports, and service readiness visible at a glance.",
    eyebrow: "Facility operations",
    spotlight: {
      label: "Facility status",
      value: "92% ready",
      description: "Staffing and reporting indicators are stable.",
    },
    metrics: [
      { label: "Staff on duty", value: "18", trend: "4 departments", icon: Users, tone: "success" },
      { label: "Open reports", value: "5", trend: "2 due soon", icon: FileText },
      { label: "Service coverage", value: "91%", trend: "+3% month over month", icon: TrendingUp, tone: "success" },
    ],
    cards: [
      { label: "Staff", title: "Team Members", description: "Manage facility staff and assignments.", href: "/staff", icon: Users },
      { label: "Operations", title: "Facility Status", description: "Monitor facility operational metrics.", href: "/reports", icon: Activity },
      { label: "Reports", title: "Performance", description: "View facility performance reports.", href: "/reports", icon: FileText },
    ],
    priorities: ["Approve weekly staffing roster", "Review pending facility report", "Check maternal care stock readiness"],
    activity: ["Staff roster updated", "Monthly report draft saved", "Coverage metric improved"],
  },
  district_officer: {
    title: "Dashboard",
    subtitle: "Track district maternal health performance and facility coverage.",
    eyebrow: "District command",
    spotlight: {
      label: "Coverage rate",
      value: "89%",
      description: "Across 24 active facilities in the district.",
    },
    metrics: [
      { label: "Facilities", value: "24", trend: "All reporting", icon: Activity, tone: "success" },
      { label: "Active mothers", value: "2,456", trend: "+128 this month", icon: Users },
      { label: "At risk cases", value: "34", trend: "7 newly flagged", icon: ShieldPlus, tone: "warning" },
    ],
    cards: [
      { label: "District Overview", title: "Facilities Status", description: "Monitor all facilities in the district.", href: "/analytics", icon: Activity },
      { label: "Analytics", title: "Key Metrics", description: "View district-level health metrics and statistics.", href: "/analytics", icon: BarChart3 },
    ],
    priorities: ["Follow up with 2 delayed-reporting facilities", "Review at-risk case distribution", "Prepare district coverage notes"],
    activity: ["Kicukiro Health Center submitted report", "Coverage rate increased by 5%", "At-risk case list refreshed"],
  },
  government: {
    title: "Dashboard",
    subtitle: "National maternal health program oversight with sync, reports, and performance signals.",
    eyebrow: "National oversight",
    spotlight: {
      label: "National sync",
      value: "98%",
      description: "District data is current across the program.",
    },
    metrics: [
      { label: "Districts synced", value: "28/30", trend: "2 pending", icon: RefreshCcw },
      { label: "Reports ready", value: "14", trend: "This quarter", icon: FileText, tone: "success" },
      { label: "Program coverage", value: "93%", trend: "+2% this month", icon: TrendingUp, tone: "success" },
    ],
    cards: [
      { label: "National", title: "Program Overview", description: "Monitor national maternal health program performance.", href: "/reports", icon: BarChart3 },
      { label: "Sync", title: "Data Synchronization", description: "Manage data synchronization across districts.", href: "/sync", icon: RefreshCcw },
      { label: "Reports", title: "National Reports", description: "View comprehensive national health reports.", href: "/reports", icon: FileText },
    ],
    priorities: ["Resolve 2 delayed district syncs", "Review national quarterly report", "Check coverage changes by province"],
    activity: ["National report generated", "28 districts synchronized", "Coverage dashboard refreshed"],
  },
};

const metricToneStyles = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  default: "bg-slate-50 text-slate-600",
};

export default function DashboardPage() {
  const { role, roleTheme } = useRole();
  const content = dashboardContent[role] || dashboardContent.patient;
  const theme = ROLE_THEMES[role] || ROLE_THEMES.patient;
  const primaryAction = content.cards[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
        action={
          <Button
            asChild
            className="h-11 rounded-2xl px-4 text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <Link href={primaryAction.href}>
              <span>{primaryAction.title}</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <section
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        style={{ borderColor: theme.border }}
      >
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-5 sm:p-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: theme.accentSoft, color: theme.text }}
            >
              <Activity className="size-3.5" />
              <span>{content.spotlight.label}</span>
            </div>

            <div className="mt-5 max-w-2xl">
              <p className="text-4xl font-semibold tracking-tight sm:text-5xl" style={{ color: theme.text }}>
                {content.spotlight.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#54797C] sm:text-base">
                {content.spotlight.description}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {content.metrics.map((metric) => {
                const Icon = metric.icon;
                const tone = metric.tone ?? "default";

                return (
                  <article key={metric.label} className="rounded-2xl border bg-[#FBFDFD] p-4" style={{ borderColor: theme.border }}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
                        {metric.label}
                      </p>
                      <Icon className="size-5 shrink-0" style={{ color: theme.accent }} />
                    </div>
                    <p className="mt-3 text-2xl font-semibold" style={{ color: theme.text }}>
                      {metric.value}
                    </p>
                    <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${metricToneStyles[tone]}`}>
                      {metric.trend}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="border-t bg-[#F7FBFA] p-5 sm:p-6 lg:border-l lg:border-t-0" style={{ borderColor: theme.border }}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: theme.text }}>
              Priorities
            </h2>
            <div className="mt-4 space-y-3">
              {content.priorities.map((priority, index) => (
                <div key={priority} className="flex gap-3 rounded-2xl bg-white p-3 shadow-xs">
                  <div
                    className="grid size-8 shrink-0 place-items-center rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-[#315F62]">{priority}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`grid gap-4 ${content.cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        {content.cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="grid size-11 shrink-0 place-items-center rounded-2xl"
                  style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                >
                  <Icon className="size-5" />
                </div>
                <ArrowUpRight className="size-5 text-[#7BA09D] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
                {card.label}
              </p>
              <h2 className="mt-2 text-lg font-semibold" style={{ color: theme.text }}>
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#54797C]">{card.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.border }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              Recent activity
            </p>
            <h2 className="mt-1 text-lg font-semibold" style={{ color: theme.text }}>
              Latest updates
            </h2>
          </div>
          <Activity className="size-5" style={{ color: theme.accent }} />
        </div>

        <div className="mt-4 divide-y" style={{ borderColor: theme.border }}>
          {content.activity.map((item) => (
            <div key={item} className="flex items-center gap-3 py-3">
              <span className="size-2 rounded-full" style={{ backgroundColor: theme.accent }} />
              <p className="text-sm text-[#315F62]">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
