"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CalendarClock,
  Printer,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type {
  VaccinationCardCache,
  VaccinationCardData,
  VaccinationRecord,
  VaccinationStatus,
} from "@/features/child/types";

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cacheKey(id: string) {
  return `motherhood:vaccination-card:${id}`;
}

function readCache(id: string): VaccinationCardCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VaccinationCardCache>;
    if (!parsed.savedAt || !parsed.payload) return null;
    return parsed as VaccinationCardCache;
  } catch { return null; }
}

function writeCache(id: string, payload: VaccinationCardCache) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(cacheKey(id), JSON.stringify(payload)); }
  catch { /* storage full — continue */ }
}

function isFresh(savedAt: string) {
  return Date.now() - new Date(savedAt).getTime() <= CACHE_TTL_MS;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(v: string | null | undefined) {
  if (!v) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(v));
}

function fmtDateTime(v: string | null | undefined) {
  if (!v) return "Not synced";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }).format(new Date(v));
}

function completionSummary(vaccines: VaccinationRecord[]) {
  const completed = vaccines.filter((v) => v.status === "completed").length;
  const overdue   = vaccines.filter((v) => v.status === "overdue").length;
  const total     = vaccines.length;
  return { completed, overdue, total, pct: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

// ─── Status cell ──────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<VaccinationStatus, string> = {
  completed: "Given",
  due:       "Due Soon",
  overdue:   "Overdue",
  upcoming:  "Upcoming",
};

const STATUS_CLASSES: Record<VaccinationStatus, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  due:       "bg-amber-50 text-amber-700",
  overdue:   "bg-red-50 text-red-700",
  upcoming:  "bg-gray-50 text-gray-500",
};

const STATUS_ICON: Record<VaccinationStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  due:       Clock3,
  overdue:   AlertTriangle,
  upcoming:  CalendarClock,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadState = {
  data: VaccinationCardData | null;
  source: VaccinationCardCache["source"] | "stale-cache";
  lastSyncedAt: string | null;
  isLoading: boolean;
  errorMessage: string | null;
};

type PageProps = { params: Promise<{ childId: string }> };

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PatientVaccinationCardPage({ params }: PageProps) {
  const { childId } = use(params);
  const [refreshToken, setRefreshToken] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>({
    data: null, source: "demo", lastSyncedAt: null,
    isLoading: true, errorMessage: null,
  });

  useEffect(() => {
    let alive = true;

    async function load() {
      const cached = readCache(childId);
      if (cached && isFresh(cached.savedAt)) {
        if (alive) setLoadState({ data: cached.payload, source: cached.source,
          lastSyncedAt: cached.savedAt, isLoading: false, errorMessage: null });
        return;
      }

      try {
        const res = await fetch(`/api/children/${encodeURIComponent(childId)}/vaccinations`, {
          cache: "no-store", headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = (await res.json()) as VaccinationCardData;
        const entry: VaccinationCardCache = { savedAt: new Date().toISOString(), source: "live", payload };
        writeCache(childId, entry);
        if (alive) setLoadState({ data: payload, source: "live",
          lastSyncedAt: entry.savedAt, isLoading: false, errorMessage: null });
        return;
      } catch (err) {
        if (cached) {
          if (alive) setLoadState({ data: cached.payload,
            source: isFresh(cached.savedAt) ? cached.source : "stale-cache",
            lastSyncedAt: cached.savedAt, isLoading: false,
            errorMessage: err instanceof Error ? err.message : "Could not sync." });
          return;
        }
      }

      const demo = buildDemoCard(childId);
      const entry: VaccinationCardCache = { savedAt: new Date().toISOString(), source: "demo", payload: demo };
      writeCache(childId, entry);
      if (alive) setLoadState({ data: demo, source: "demo",
        lastSyncedAt: entry.savedAt, isLoading: false,
        errorMessage: "Showing offline demo record — no live API connection." });
    }

    void load();
    return () => { alive = false; };
  }, [childId, refreshToken]);

  const card    = loadState.data;
  const summary = useMemo(() => card ? completionSummary(card.vaccines) : null, [card]);
  const overdue = card?.vaccines.filter((v) => v.status === "overdue") ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6 print:p-0">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm" className="rounded-xl text-gray-500">
          <Link href="/my-children">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline" size="sm" className="rounded-xl"
          onClick={() => { setLoadState((s) => ({ ...s, isLoading: true })); setRefreshToken((n) => n + 1); }}
          disabled={loadState.isLoading}
        >
          <RefreshCw className={cn("size-3.5", loadState.isLoading && "animate-spin")} />
          Refresh
        </Button>
        <Button
          variant="outline" size="sm" className="rounded-xl"
          onClick={() => window.print()}
        >
          <Printer className="size-3.5" /> Print
        </Button>
      </div>

      {/* ── Report card ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">

        {/* Report header */}
        <div className="border-b border-gray-200 px-6 py-5 print:border-black">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Vaccination Record
              </p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {card?.child.fullName ?? "Loading…"}
              </h1>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Child ID: <span className="font-medium text-gray-700">{childId}</span></p>
              {card && <p className="mt-0.5">DOB: <span className="font-medium text-gray-700">{fmtDate(card.child.dateOfBirth)}</span></p>}
            </div>
          </div>

          {/* Child meta row */}
          {card && (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
              <span>Facility: <span className="font-medium text-gray-700">{card.child.facilityName}</span></span>
              <span>Mother: <span className="font-medium text-gray-700">{card.child.motherName}</span></span>
              <span>Last synced: <span className="font-medium text-gray-700">{fmtDateTime(loadState.lastSyncedAt)}</span></span>
            </div>
          )}
        </div>

        {/* Error / offline notice */}
        {loadState.errorMessage && (
          <div className="border-b border-amber-100 bg-amber-50 px-6 py-2.5 text-xs text-amber-700">
            {loadState.errorMessage}
          </div>
        )}

        {/* Overdue alert */}
        {overdue.length > 0 && (
          <div className="flex items-start gap-3 border-b border-red-200 bg-red-50 px-6 py-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">
              <span className="font-semibold">
                {overdue.length} vaccine{overdue.length > 1 ? "s are" : " is"} overdue.
              </span>{" "}
              Please contact your Community Health Worker to schedule a catch-up visit.
            </p>
          </div>
        )}

        {/* Progress summary */}
        {summary && (
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                {summary.completed} of {summary.total} vaccines given
              </span>
              <span className="font-semibold text-gray-900">{summary.pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${summary.pct}%` }}
              />
            </div>
            <div className="mt-3 flex gap-5 text-xs text-gray-500">
              <span>
                <span className="font-semibold text-emerald-600">{summary.completed}</span> Given
              </span>
              <span>
                <span className="font-semibold text-red-500">{summary.overdue}</span> Overdue
              </span>
              <span>
                <span className="font-semibold text-gray-700">{summary.total - summary.completed - summary.overdue}</span> Upcoming
              </span>
            </div>
          </div>
        )}

        {/* Vaccine table */}
        {loadState.isLoading ? (
          <div className="space-y-3 px-6 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : card?.vaccines.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">#</th>
                  <th className="px-4 py-3">Vaccine</th>
                  <th className="px-4 py-3">Dose</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Date Given</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {card.vaccines.map((v, idx) => {
                  const Icon = STATUS_ICON[v.status];
                  return (
                    <tr
                      key={v.id}
                      className={cn(
                        "border-b border-gray-50 last:border-0",
                        v.status === "overdue" && "bg-red-50/40",
                      )}
                    >
                      <td className="px-6 py-3.5 text-xs text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">{v.name}</td>
                      <td className="px-4 py-3.5 text-gray-500">{v.doseLabel}</td>
                      <td className="px-4 py-3.5 text-gray-500">{fmtDate(v.dueDate)}</td>
                      <td className="px-4 py-3.5">
                        {v.administeredDate
                          ? <span className="font-medium text-gray-900">{fmtDate(v.administeredDate)}</span>
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          STATUS_CLASSES[v.status],
                        )}>
                          <Icon className="size-3" />
                          {STATUS_LABEL[v.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-gray-400">No vaccine records found.</p>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs text-gray-400">
          {loadState.source === "live"
            ? "Data synced from server · cached for 24 hours"
            : loadState.source === "demo"
            ? "Showing offline demo record"
            : "Showing cached data · last synced " + fmtDateTime(loadState.lastSyncedAt)}
        </div>
      </div>
    </div>
  );
}

// ─── Demo data ─────────────────────────────────────────────────────────────────

function buildDemoCard(childId: string): VaccinationCardData {
  const today = new Date();
  const add   = (d: Date, n: number) => new Date(d.getTime() + n * 86400000).toISOString().split("T")[0];
  return {
    child: {
      id:           childId,
      fullName:     "Amara Uwimana",
      dateOfBirth:  "2024-11-20",
      motherName:   "Uwimana Marie",
      facilityName: "Nyamata Health Center",
    },
    lastUpdatedAt: today.toISOString(),
    vaccines: [
      { id: "bcg",      name: "BCG",                doseLabel: "Dose 1",  status: "completed", dueDate: "2024-11-21", administeredDate: "2024-11-21", note: undefined},
      { id: "polio0",   name: "Polio (OPV 0)",       doseLabel: "Dose 1",  status: "completed", dueDate: "2024-11-21", administeredDate: "2024-11-21", note: undefined},
      { id: "penta1",   name: "DPT-HepB-Hib",        doseLabel: "Dose 1",  status: "completed", dueDate: "2025-01-02", administeredDate: "2025-01-05", note: undefined},
      { id: "polio1",   name: "Polio (OPV 1)",        doseLabel: "Dose 1",  status: "completed", dueDate: "2025-01-02", administeredDate: "2025-01-05", note: undefined},
      { id: "pcv1",     name: "PCV (Pneumococcal)",   doseLabel: "Dose 1",  status: "completed", dueDate: "2025-01-02", administeredDate: "2025-01-05", note: undefined},
      { id: "penta2",   name: "DPT-HepB-Hib",        doseLabel: "Dose 2",  status: "completed", dueDate: "2025-01-30", administeredDate: "2025-02-01", note: undefined},
      { id: "polio2",   name: "Polio (OPV 2)",        doseLabel: "Dose 2",  status: "completed", dueDate: "2025-01-30", administeredDate: "2025-02-01", note: undefined},
      { id: "penta3",   name: "DPT-HepB-Hib",        doseLabel: "Dose 3",  status: "completed", dueDate: "2025-02-27", administeredDate: "2025-03-02", note: undefined},
      { id: "measles1", name: "Measles-Rubella",      doseLabel: "Dose 1",  status: "completed", dueDate: "2025-08-20", administeredDate: "2025-08-25", note: undefined},
      { id: "measles2", name: "Measles-Rubella",      doseLabel: "Dose 2",  status: "due",       dueDate: add(today, 7), administeredDate: null,          note: undefined},
      { id: "vita",     name: "Vitamin A",             doseLabel: "18 mo",   status: "upcoming",  dueDate: add(today, 60), administeredDate: null,         note: undefined},
      { id: "dpt-b",    name: "DPT Booster",          doseLabel: "Booster", status: "upcoming",  dueDate: add(today, 90), administeredDate: null,         note: undefined},
      { id: "ipv",      name: "IPV (Polio)",           doseLabel: "Booster", status: "upcoming",  dueDate: add(today, 120), administeredDate: null,        note: undefined},
    ],
  };
}
