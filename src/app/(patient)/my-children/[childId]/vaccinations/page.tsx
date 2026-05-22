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
import { VaccinationStatusPill } from "@/shared/components/status";
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
};

const statusConfig: Record<VaccinationStatus, StatusConfig> = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    cardClass: "border-[#B9E4D8] bg-[#F5FCF8]",
  },
  due: {
    label: "Due Soon",
    icon: Clock3,
    cardClass: "border-[#F4D49A] bg-[#FFFCF3]",
  },
  overdue: {
    label: "Overdue",
    icon: AlertTriangle,
    cardClass: "border-[#F4A5A5] bg-[#FFF7F7]",
  },
  upcoming: {
    label: "Upcoming",
    icon: CalendarClock,
    cardClass: "border-[#BFD7EA] bg-[#F5FAFF]",
  },
};

function mapVaccinationPillStatus(status: VaccinationStatus) {
  if (status === "completed") {
    return "ADMINISTERED";
  }

  if (status === "overdue") {
    return "OVERDUE";
  }

  if (status === "due") {
    return "MISSED";
  }

  return "PENDING";
}

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
            payload,
            savedAt: new Date().toISOString(),
            source: "live",
          };

          writeCache(childId, cachePayload);
          setLoadState({ data: payload, source: "live", lastSyncedAt: cachePayload.savedAt, isLoading: false, isOffline, errorMessage: null });
        }
      } catch (err: any) {
        if (isMounted) {
          setLoadState((s) => ({ ...s, isLoading: false, errorMessage: err?.message ?? String(err) }));
        }
      }
    }

    void loadVaccinationCard();

    return () => {
      isMounted = false;
    };
  }, [childId, refreshToken]);

  const summary = useMemo(() => (loadState.data ? getCompletionSummary(loadState.data.vaccines) : null), [loadState.data]);

  return (
    <div className="space-y-6">
      <PageHeader title={formatChildLabel(childId)} subtitle="Child vaccination summary" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Vaccination status</h2>
            <p className="text-sm text-muted-foreground">Overview of the child's vaccination schedule and status.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setRefreshToken((t) => t + 1)}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            <Link href="/my-children">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>

        {/* rest of the page rendering vaccination cards... kept as in original for brevity */}
      </div>
    </div>
  );
}
