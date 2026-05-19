"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { EnhancedCard } from "@/shared/components/ui/EnhancedCard";
import { StatsCard } from "@/shared/components/ui/StatsCard";
import { useRole } from "@/shared/hooks/useRole";

type DashboardStat = {
  label: string;
  value: string;
  icon: ReactNode;
};

type DashboardModule = {
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
};

type DashboardContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  summary: string;
  stats: DashboardStat[];
  modules: DashboardModule[];
  highlights: string[];
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  imageLabel: string;
  imageCaption: string;
};

const dashboardContent: Record<string, DashboardContent> = {
  patient: {
    eyebrow: "Mother Portal",
    title: "Your care journey, organized in one place",
    subtitle:
      "Track pregnancy progress, appointments, and child follow-ups from a calm, role-focused dashboard.",
    intro: "A clearer view of milestones, reminders, and the next actions in your care pathway.",
    summary:
      "Updated for mothers who need fast access to the next visit, support contacts, and health records.",
    stats: [
      { label: "Pregnancy Week", value: "28", icon: <HeartPulse className="size-5" /> },
      { label: "Next Visit", value: "6 days", icon: <CalendarDays className="size-5" /> },
      { label: "Follow-ups", value: "3", icon: <CheckCircle2 className="size-5" /> },
      { label: "Care Team", value: "4", icon: <Users className="size-5" /> },
    ],
    modules: [
      {
        label: "Pregnancy",
        title: "Timeline and milestones",
        description: "See the current week, expected next steps, and alerts that need attention.",
        icon: <HeartPulse className="size-5" />,
        href: "/pregnancies",
      },
      {
        label: "Appointments",
        title: "Upcoming visits",
        description: "Review the next appointment, facility details, and travel reminders.",
        icon: <CalendarDays className="size-5" />,
        href: "/appointments",
      },
      {
        label: "Children",
        title: "Child follow-up records",
        description: "Track immunization reminders, growth checkups, and care notes.",
        icon: <ShieldCheck className="size-5" />,
        href: "/children",
      },
      {
        label: "Support",
        title: "Care team contacts",
        description: "Quickly reach community support or review your assigned facility details.",
        icon: <MessageSquareText className="size-5" />,
        href: "/dashboard",
      },
    ],
    highlights: [
      "Track pregnancy week and expected milestones",
      "Open upcoming visit details in one tap",
      "Keep child follow-up reminders visible",
    ],
    primaryAction: { label: "Open appointments", href: "/appointments" },
    secondaryAction: { label: "View pregnancy timeline", href: "/pregnancies" },
    imageLabel: "Care snapshot",
    imageCaption:
      "A calm, visual summary of your current stage, next visit, and support network.",
  },
  health_worker: {
    eyebrow: "Health Worker Hub",
    title: "Monitor mothers, visits, and active cases from one workspace",
    subtitle:
      "Move between patient records, upcoming visits, and diagnosis queues without losing context.",
    intro: "A focused workspace for maternal care follow-up, community visits, and case review.",
    summary:
      "Built to keep active cases visible and reduce friction across the care workflow.",
    stats: [
      { label: "Active Cases", value: "24", icon: <Users className="size-5" /> },
      { label: "Visits Today", value: "8", icon: <CalendarDays className="size-5" /> },
      { label: "Pending Notes", value: "5", icon: <ClipboardList className="size-5" /> },
      { label: "Escalations", value: "2", icon: <ShieldCheck className="size-5" /> },
    ],
    modules: [
      {
        label: "Mothers",
        title: "Patient registry",
        description: "Search registered mothers and open the latest care record quickly.",
        icon: <Users className="size-5" />,
        href: "/mothers",
      },
      {
        label: "Visits",
        title: "Field and facility visits",
        description: "See today’s schedule and pending follow-up actions for each client.",
        icon: <CalendarDays className="size-5" />,
        href: "/visits",
      },
      {
        label: "Diagnoses",
        title: "Case review queue",
        description: "Track maternal conditions that need assessment, documentation, or escalation.",
        icon: <Stethoscope className="size-5" />,
        href: "/diagnoses",
      },
      {
        label: "Notes",
        title: "Care coordination",
        description: "Capture follow-up notes and keep the next step visible for the care team.",
        icon: <MessageSquareText className="size-5" />,
        href: "/dashboard",
      },
    ],
    highlights: [
      "Review mothers under active follow-up",
      "Track scheduled visits and missed check-ins",
      "Escalate cases that need immediate attention",
    ],
    primaryAction: { label: "Open mothers", href: "/mothers" },
    secondaryAction: { label: "Review visits", href: "/visits" },
    imageLabel: "Field overview",
    imageCaption:
      "A high-contrast summary of the day’s workload, active cases, and priority visits.",
  },
  facility_admin: {
    eyebrow: "Facility Operations",
    title: "Keep staff, reports, and operational status in view",
    subtitle:
      "A cleaner control room for staffing, reporting, and overall facility performance.",
    intro: "Monitor the facility at a glance and jump into the operational areas that need action.",
    summary:
      "Designed for administrative oversight with a concise picture of the facility state.",
    stats: [
      { label: "Staff Online", value: "18", icon: <Users className="size-5" /> },
      { label: "Reports Ready", value: "9", icon: <ClipboardList className="size-5" /> },
      { label: "Open Tasks", value: "6", icon: <CheckCircle2 className="size-5" /> },
      { label: "Coverage", value: "92%", icon: <MapPin className="size-5" /> },
    ],
    modules: [
      {
        label: "Staff",
        title: "Team management",
        description: "Review assigned staff, availability, and workload distribution.",
        icon: <Users className="size-5" />,
        href: "/staff",
      },
      {
        label: "Reports",
        title: "Facility performance",
        description: "Open operational summaries and performance reports for the facility.",
        icon: <ClipboardList className="size-5" />,
        href: "/reports",
      },
      {
        label: "Operations",
        title: "Service coordination",
        description: "Keep an eye on service delivery, task follow-up, and care coverage.",
        icon: <MapPin className="size-5" />,
        href: "/dashboard",
      },
      {
        label: "Quality",
        title: "Care review",
        description: "Spot gaps in service quality and intervene early where needed.",
        icon: <ShieldCheck className="size-5" />,
        href: "/reports",
      },
    ],
    highlights: [
      "Track team and facility readiness",
      "Review performance reports in context",
      "Spot operational gaps before they grow",
    ],
    primaryAction: { label: "Open staff", href: "/staff" },
    secondaryAction: { label: "View reports", href: "/reports" },
    imageLabel: "Operations panel",
    imageCaption:
      "A structured view of staffing, reports, and service readiness across the facility.",
  },
  district_officer: {
    eyebrow: "District Oversight",
    title: "Compare facilities, coverage, and district-level trends",
    subtitle:
      "A district monitoring dashboard tuned for oversight, analytics, and intervention planning.",
    intro: "See where performance is rising, where coverage is slipping, and where action is needed.",
    summary:
      "Designed for quick scanning of district health indicators and facility status.",
    stats: [
      { label: "Facilities", value: "14", icon: <MapPin className="size-5" /> },
      { label: "Analytics", value: "Realtime", icon: <Sparkles className="size-5" /> },
      { label: "Alerts", value: "3", icon: <ShieldCheck className="size-5" /> },
      { label: "Coverage", value: "88%", icon: <CheckCircle2 className="size-5" /> },
    ],
    modules: [
      {
        label: "Analytics",
        title: "District metrics",
        description: "Review trends, coverage, and service delivery data for the district.",
        icon: <Sparkles className="size-5" />,
        href: "/analytics",
      },
      {
        label: "Facilities",
        title: "Comparative oversight",
        description: "Inspect where facilities need support or closer supervision.",
        icon: <MapPin className="size-5" />,
        href: "/dashboard",
      },
      {
        label: "Reports",
        title: "Oversight summaries",
        description: "Move into reporting views for deeper analysis and follow-up.",
        icon: <ClipboardList className="size-5" />,
        href: "/reports",
      },
      {
        label: "Interventions",
        title: "Priority response",
        description: "Keep the most urgent district actions visible at the top of the workflow.",
        icon: <ShieldCheck className="size-5" />,
        href: "/analytics",
      },
    ],
    highlights: [
      "Compare district facilities in one scan",
      "Surface alerts and priority interventions",
      "Review trend shifts before monthly reporting",
    ],
    primaryAction: { label: "Open analytics", href: "/analytics" },
    secondaryAction: { label: "View reports", href: "/reports" },
    imageLabel: "District snapshot",
    imageCaption:
      "A compact view of coverage, trend lines, and the highest-priority district concerns.",
  },
  government: {
    eyebrow: "National Oversight",
    title: "Monitor program health, sync status, and nationwide reporting",
    subtitle:
      "A national-level control surface for policy, reporting, and synchronized program data.",
    intro: "A cleaner command view for ministry workflows, national reports, and sync monitoring.",
    summary:
      "Built to keep national indicators visible and centralize executive oversight.",
    stats: [
      { label: "Programs", value: "6", icon: <Sparkles className="size-5" /> },
      { label: "Sync Jobs", value: "Healthy", icon: <CheckCircle2 className="size-5" /> },
      { label: "Reports", value: "18", icon: <ClipboardList className="size-5" /> },
      { label: "Regions", value: "30", icon: <MapPin className="size-5" /> },
    ],
    modules: [
      {
        label: "Sync",
        title: "Data synchronization",
        description: "Review national sync progress and identify issues that need intervention.",
        icon: <CheckCircle2 className="size-5" />,
        href: "/sync",
      },
      {
        label: "Reports",
        title: "National reporting",
        description: "Open ministry reports and keep a close eye on aggregate indicators.",
        icon: <ClipboardList className="size-5" />,
        href: "/reports",
      },
      {
        label: "Analytics",
        title: "Policy insight",
        description: "Move into analytics when a trend needs deeper policy review.",
        icon: <Sparkles className="size-5" />,
        href: "/analytics",
      },
      {
        label: "Coverage",
        title: "National reach",
        description: "Keep coverage, coordination, and rollout status in focus.",
        icon: <MapPin className="size-5" />,
        href: "/dashboard",
      },
    ],
    highlights: [
      "Track national sync and reporting health",
      "Review indicators across programs and regions",
      "Keep policy-level follow-up visible",
    ],
    primaryAction: { label: "Open sync", href: "/sync" },
    secondaryAction: { label: "View reports", href: "/reports" },
    imageLabel: "Command board",
    imageCaption:
      "A national overview of sync health, reporting cadence, and coverage across regions.",
  },
};

export default function DashboardPage() {
  const { role, roleTheme, roleLabel } = useRole();
  const content = dashboardContent[role] ?? dashboardContent.patient;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={content.secondaryAction.href}
              className="inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ borderColor: roleTheme.border, color: roleTheme.text, backgroundColor: "white" }}
            >
              {content.secondaryAction.label}
            </Link>
            <Link
              href={content.primaryAction.href}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: roleTheme.accent }}
            >
              {content.primaryAction.label}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        }
      />

      <section
        className="grid gap-6 rounded-[2rem] border bg-linear-to-br from-white via-[#F9FCFB] to-white p-6 shadow-sm xl:grid-cols-[1.6fr_0.9fr]"
        style={{ borderColor: roleTheme.border }}
      >
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-linear-to-br from-[#0C4A4E] via-[#1D6567] to-[#2C6F73] p-6 text-white shadow-[0_24px_60px_-30px_rgba(44,111,115,0.75)]">
              <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-12 left-8 size-32 rounded-full bg-[#9AE6E1]/20 blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
                  <Sparkles className="size-3.5" />
                  {roleLabel} dashboard
                </div>
                <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                  {content.intro}
                </h2>
                <p className="max-w-xl text-sm leading-6 text-white/84">{content.summary}</p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={content.primaryAction.href}
                    className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-[#15494B] shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    {content.primaryAction.label}
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={content.secondaryAction.href}
                    className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    {content.secondaryAction.label}
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#D5E9E6] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">
                {content.imageLabel}
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-3xl bg-linear-to-br from-[#E3F4F0] to-[#F7FBFA] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#1D5052]">Next action</p>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2C6F73]">
                      Live
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white">
                    <div className="h-2 w-[72%] rounded-full" style={{ backgroundColor: roleTheme.accent }} />
                  </div>
                  <p className="mt-3 text-sm text-[#54797C]">{content.imageCaption}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-3xl border border-[#D5E9E6] bg-[#FBFEFD] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Priority</p>
                    <p className="mt-2 text-xl font-semibold text-[#1D5052]">High</p>
                    <p className="text-sm text-[#54797C]">Next review window</p>
                  </div>
                  <div className="rounded-3xl border border-[#D5E9E6] bg-[#FBFEFD] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Status</p>
                    <p className="mt-2 text-xl font-semibold text-[#1D5052]">Ready</p>
                    <p className="text-sm text-[#54797C]">Workflow on track</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.stats.map((stat) => (
              <StatsCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                accentColor={roleTheme.accent}
                backgroundColor={roleTheme.accentSoft}
                borderColor={roleTheme.border}
                textColor={roleTheme.text}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.75rem] border border-[#D5E9E6] bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">Care highlights</p>
            <h3 className="mt-2 text-lg font-semibold text-[#1D5052]">What matters now</h3>
            <p className="mt-2 text-sm leading-6 text-[#54797C]">
              The dashboard keeps your next steps visible so you can move from overview to action faster.
            </p>
          </div>

          <div className="space-y-3">
            {content.highlights.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#D5E9E6] bg-[#FBFEFD] p-4">
                <div
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: roleTheme.accent }}
                >
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-[#1D5052]">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-linear-to-br from-[#E6F5F2] to-[#F8FCFB] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Quick access</p>
            <div className="mt-3 space-y-2 text-sm font-medium text-[#1D5052]">
              {content.modules.slice(0, 2).map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <span>{module.label}</span>
                  <ArrowRight className="size-4 text-[#54797C]" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">Modules</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#1D5052]">Role-aware areas</h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#54797C]">
            Each module opens a focused workflow that matches the current role and keeps the interface consistent.
          </p>
        </div>

        <div className={`grid gap-4 ${content.modules.length >= 4 ? "xl:grid-cols-4" : "md:grid-cols-2"}`}>
          {content.modules.map((module) => (
            <EnhancedCard
              key={module.href}
              label={module.label}
              title={module.title}
              description={module.description}
              icon={module.icon}
              borderColor={roleTheme.border}
              textColor={roleTheme.text}
              accentColor={roleTheme.accent}
              onClick={() => window.location.assign(module.href)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
