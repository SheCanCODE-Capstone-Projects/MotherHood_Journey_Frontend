"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Printer,
  RefreshCw,
  Smartphone,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type {
  VaccinationCardCache,
  VaccinationCardData,
  VaccinationRecord,
  VaccinationStatus,
} from "@/features/child/types";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
type PatientVaccinationPageProps = {
  params: Promise<{
    childId: string;
  }>;
};

type LoadState = {
  data: VaccinationCardData | null;
  source: VaccinationCardCache["source"] | "stale-cache";
  lastSyncedAt: string | null;
  isLoading: boolean;
  isOffline: boolean;
  errorMessage: string | null;
};

type StatusConfig = {
  label: string;
  icon: LucideIcon;
  cardClass: string;
  badgeClass: string;
  textClass: string;
};

const statusConfig: Record<VaccinationStatus, StatusConfig> = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    cardClass: "border-[#B9E4D8] bg-[#F5FCF8]",
    badgeClass: "bg-[#E3F7ED] text-[#166534]",
    textClass: "text-[#14532D]",
  },
  due: {
    label: "Due Soon",
    icon: Clock3,
    cardClass: "border-[#F4D49A] bg-[#FFFCF3]",
    badgeClass: "bg-[#FEF0C7] text-[#8A4B00]",
    textClass: "text-[#7C2D12]",
  },
  overdue: {
    label: "Overdue",
    icon: AlertTriangle,
    cardClass: "border-[#F4A5A5] bg-[#FFF7F7]",
    badgeClass: "bg-[#FDE2E2] text-[#9F1239]",
    textClass: "text-[#991B1B]",
  },
  upcoming: {
    label: "Upcoming",
    icon: CalendarClock,
    cardClass: "border-[#BFD7EA] bg-[#F5FAFF]",
    badgeClass: "bg-[#E5F1FB] text-[#1D4ED8]",
    textClass: "text-[#1E3A8A]",
  },
};

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not synced yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getCacheKey(childId: string) {
  return `motherhood:vaccination-card:${childId}`;
}

function readCache(childId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(getCacheKey(childId));
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<VaccinationCardCache>;
    if (!parsed.savedAt || !parsed.payload) {
      return null;
    }

    return parsed as VaccinationCardCache;
  } catch {
    return null;
  }
}

function writeCache(childId: string, payload: VaccinationCardCache) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getCacheKey(childId), JSON.stringify(payload));
  } catch {
    // Ignore storage failures and keep the page functional.
  }
}

function isFresh(savedAt: string) {
  return Date.now() - new Date(savedAt).getTime() <= CACHE_TTL_MS;
}

function normalizeChildId(childId: string) {
  return decodeURIComponent(childId).trim();
}

function formatChildLabel(childId: string) {
  const cleaned = childId.replace(/[-_]+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : "Child record";
}

function getCompletionSummary(vaccines: VaccinationRecord[]) {
  const completed = vaccines.filter((vaccine) => vaccine.status === "completed").length;
  const total = vaccines.length;
  const overdue = vaccines.filter((vaccine) => vaccine.status === "overdue").length;
  const dueSoon = vaccines.filter((vaccine) => vaccine.status === "due").length;

  return {
    completed,
    total,
    overdue,
    dueSoon,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

function getSoonestPending(vaccines: VaccinationRecord[]) {
  const pending = vaccines
    .filter((vaccine) => vaccine.status !== "completed")
    .slice()
    .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime());

  return pending[0] ?? null;
}

export default function PatientVaccinationCardPage({ params }: PatientVaccinationPageProps) {
  const resolvedParams = use(params);
  const childId = normalizeChildId(resolvedParams.childId);
  const [refreshToken, setRefreshToken] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>({
    data: null,
    source: "demo",
    lastSyncedAt: null,
    isLoading: true,
    isOffline: false,
    errorMessage: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadVaccinationCard() {
      const cachedValue = readCache(childId);
      const isOffline = typeof navigator !== "undefined" ? !navigator.onLine : false;

      if (cachedValue && isFresh(cachedValue.savedAt)) {
        if (isMounted) {
          setLoadState({
            data: cachedValue.payload,
            source: cachedValue.source,
            lastSyncedAt: cachedValue.savedAt,
            isLoading: false,
            isOffline,
            errorMessage: null,
          });
        }

        return;
      }

      try {
        const response = await fetch(`/api/children/${encodeURIComponent(childId)}/vaccinations`, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as VaccinationCardData;

        if (isMounted) {
          const cachePayload: VaccinationCardCache = {
            savedAt: new Date().toISOString(),
            source: "live",
            payload,
          };

          writeCache(childId, cachePayload);

          setLoadState({
            data: payload,
            source: "live",
            lastSyncedAt: cachePayload.savedAt,
            isLoading: false,
            isOffline,
            errorMessage: null,
          });
        }

        return;
      } catch (error) {
        if (cachedValue) {
          if (isMounted) {
            setLoadState({
              data: cachedValue.payload,
              source: isFresh(cachedValue.savedAt) ? cachedValue.source : "stale-cache",
              lastSyncedAt: cachedValue.savedAt,
              isLoading: false,
              isOffline: true,
              errorMessage: error instanceof Error ? error.message : "Unable to sync live vaccination data.",
            });
          }

          return;
        }
      }

      const demoPayload = createDemoVaccinationCard(childId);
      const cachePayload: VaccinationCardCache = {
        savedAt: new Date().toISOString(),
        source: "demo",
        payload: demoPayload,
      };

      writeCache(childId, cachePayload);

      if (isMounted) {
        setLoadState({
          data: demoPayload,
          source: "demo",
          lastSyncedAt: cachePayload.savedAt,
          isLoading: false,
          isOffline,
          errorMessage: "Live data is unavailable, so the card is showing a seeded offline record.",
        });
      }
    }

    void loadVaccinationCard();

    return () => {
      isMounted = false;
    };
  }, [childId, refreshToken]);

  const card = loadState.data;
  const summary = useMemo(() => (card ? getCompletionSummary(card.vaccines) : null), [card]);
  const nextPending = useMemo(() => (card ? getSoonestPending(card.vaccines) : null), [card]);
  const overdueVaccines = card?.vaccines.filter((vaccine) => vaccine.status === "overdue") ?? [];

  const handleRefresh = () => {
    setLoadState((current) => ({ ...current, isLoading: true, errorMessage: null }));
    setRefreshToken((current) => current + 1);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-6 text-slate-950">
      <PageHeader
        title="Vaccination Card"
        subtitle="Mobile-first record for a child's immunization schedule, with offline cache support and a print-ready layout."
      />

      <section className="overflow-hidden rounded-[2rem] border border-[#CFE6E2] bg-white shadow-[0_20px_55px_-35px_rgba(18,89,82,0.35)] print:rounded-none print:border-black print:shadow-none">
        <div className="bg-[linear-gradient(135deg,#1F6F72_0%,#2C8A84_55%,#E8F5F2_100%)] px-5 py-6 text-white sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
                <Smartphone className="size-3.5" />
                Patient view
              </div>

              <div>
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  {card ? card.child.fullName : formatChildLabel(childId)}
                </h1>
                <p className="mt-2 max-w-xl text-base text-white/90">
                  {card
                    ? `${card.child.motherName} · ${card.child.facilityName}`
                    : "Loading the latest vaccination record."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-white/90">
                <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1">
                  Child ID: {childId}
                </span>
                {card ? (
                  <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1">
                    DOB: {formatDate(card.child.dateOfBirth)}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1">
                  {loadState.isOffline ? "Offline ready" : "Online sync available"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:justify-end print:hidden">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl border-white/30 bg-white/10 px-4 text-white hover:bg-white/20"
                onClick={handleRefresh}
                disabled={loadState.isLoading}
              >
                <RefreshCw className={cn("size-4", loadState.isLoading && "animate-spin")} />
                <span>Refresh</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl border-white/30 bg-white/10 px-4 text-white hover:bg-white/20"
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                <span>Print</span>
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Completed</p>
              <p className="mt-1 text-3xl font-semibold">{summary?.completed ?? "--"}</p>
              <p className="text-sm text-white/80">of {summary?.total ?? "--"} vaccines</p>
            </article>

            <article className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Overdue</p>
              <p className="mt-1 text-3xl font-semibold">{summary?.overdue ?? "--"}</p>
              <p className="text-sm text-white/80">needs CHW follow-up</p>
            </article>

            <article className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Next due</p>
              <p className="mt-1 text-lg font-semibold leading-tight">
                {nextPending ? nextPending.name : "All clear"}
              </p>
              <p className="text-sm text-white/80">
                {nextPending ? formatDate(nextPending.dueDate) : "All vaccines recorded"}
              </p>
            </article>
          </div>

          <div className="mt-5 rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 text-sm font-medium text-white/90">
              <span>{summary ? `${summary.completed} of ${summary.total} vaccines completed` : "Loading completion summary"}</span>
              <span>{summary?.progress ?? 0}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${summary?.progress ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          {loadState.errorMessage ? (
            <div className="rounded-2xl border border-[#F2A9A9] bg-[#FFF4F4] px-4 py-3 text-sm font-medium text-[#991B1B]">
              {loadState.errorMessage}
            </div>
          ) : null}

          {overdueVaccines.length > 0 ? (
            <div className="rounded-2xl border border-[#E76D6D] bg-[#B91C1C] px-4 py-3 text-white shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-base font-semibold">Vaccines are overdue</p>
                  <p className="mt-1 text-sm text-white/90">
                    {overdueVaccines.length} record{overdueVaccines.length === 1 ? " is" : "s are"} overdue. Please contact the CHW for follow-up and catch-up guidance.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4">
            {card?.vaccines.map((vaccine) => {
              const config = statusConfig[vaccine.status];
              const StatusIcon = config.icon;

              return (
                <article
                  key={vaccine.id}
                  className={cn(
                    "relative overflow-hidden rounded-[1.6rem] border p-4 shadow-sm print:break-inside-avoid",
                    config.cardClass,
                    vaccine.status === "overdue" && "ring-2 ring-[#B91C1C]/15",
                  )}
                >
                  {vaccine.status === "overdue" ? (
                    <div className="-mx-4 -mt-4 mb-4 bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white">
                      Overdue. Contact the CHW to plan the next dose.
                    </div>
                  ) : null}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#64807C]">
                        {vaccine.doseLabel}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950 sm:text-[1.35rem]">
                        {vaccine.name}
                      </h2>
                    </div>

                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", config.badgeClass)}>
                      <StatusIcon className="size-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/75 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6A7F7A]">Due date</p>
                      <p className={cn("mt-1 text-lg font-semibold", config.textClass)}>
                        {formatDate(vaccine.dueDate)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/75 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6A7F7A]">Administered</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">
                        {vaccine.administeredDate ? formatDate(vaccine.administeredDate) : "Not yet given"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#54797C]">
                    <span>Status: {config.label}</span>
                    <span>{vaccine.note ?? (vaccine.status === "completed" ? "Recorded in the child health file" : "Keep this card with the caregiver")}</span>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="grid gap-4 rounded-[1.6rem] border border-[#D7E8E5] bg-[#F6FBFA] p-4 print:border-black print:bg-white sm:grid-cols-3">
            <article className="rounded-2xl border border-[#D8E9E4] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">Facility</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{card?.child.facilityName ?? "-"}</p>
            </article>

            <article className="rounded-2xl border border-[#D8E9E4] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">Mother</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{card?.child.motherName ?? "-"}</p>
            </article>

            <article className="rounded-2xl border border-[#D8E9E4] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">Last synced</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatDateTime(loadState.lastSyncedAt)}</p>
            </article>
          </section>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#D7E8E5] bg-white px-4 py-3 text-sm text-[#54797C] print:border-black">
            <WifiOff className="size-4 shrink-0" />
            <span>
              {loadState.source === "live"
                ? "Live data is synced and cached for the next 24 hours."
                : loadState.source === "cache" || loadState.source === "stale-cache"
                  ? "This card is being shown from the local offline cache."
                  : "This record is a seeded offline fallback and will be replaced when a live API is connected."}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 print:hidden">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl border-[#BFD9D4] bg-white px-4 text-[#1D5052]"
              onClick={handleRefresh}
              disabled={loadState.isLoading}
            >
              <RefreshCw className={cn("size-4", loadState.isLoading && "animate-spin")} />
              <span>Reload card</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl border-[#BFD9D4] bg-white px-4 text-[#1D5052]"
              onClick={handlePrint}
            >
              <Printer className="size-4" />
              <span>Print card</span>
            </Button>

            <Button
              asChild
              type="button"
              variant="ghost"
              className="h-11 rounded-2xl px-4 text-[#1D5052] hover:bg-[#F1F8F6]"
            >
              <Link href="/children">
                <span>Back to children</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}