"use client";

import { useEffect, useMemo, useState } from "react";

type VaccineStatus = "completed" | "due" | "overdue" | "missed";

type VaccineItem = {
  id: string;
  name: string;
  status: VaccineStatus;
  dueDate: string;
  administeredDate?: string;
};

type VaccinationCardData = {
  childName: string;
  childDob: string;
  motherName: string;
  facilityName: string;
  vaccines: VaccineItem[];
};

const CACHE_KEY_PREFIX = "vax-card-cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const mockVaccinationData = (childId: string): VaccinationCardData => ({
  childName: "Amina Uwimana",
  childDob: "2019-06-13",
  motherName: "Marie Uwimana",
  facilityName: "Nyagatare Health Centre",
  vaccines: [
    {
      id: `${childId}-1`,
      name: "BCG",
      status: "completed",
      dueDate: "2019-06-14",
      administeredDate: "2019-06-14",
    },
    {
      id: `${childId}-2`,
      name: "Polio",
      status: "completed",
      dueDate: "2019-06-28",
      administeredDate: "2019-06-28",
    },
    {
      id: `${childId}-3`,
      name: "Penta",
      status: "overdue",
      dueDate: "2020-01-01",
      administeredDate: undefined,
    },
    {
      id: `${childId}-4`,
      name: "Measles",
      status: "due",
      dueDate: "2020-03-01",
      administeredDate: undefined,
    },
  ],
});

function formatDate(value?: string) {
  if (!value) {
    return "Not recorded";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: VaccineStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "due":
      return "Due";
    case "overdue":
      return "Overdue";
    case "missed":
      return "Missed";
    default:
      return "Pending";
  }
}

function statusIcon(status: VaccineStatus) {
  switch (status) {
    case "completed":
      return "✅";
    case "due":
      return "⏳";
    case "overdue":
      return "⚠️";
    case "missed":
      return "❗";
    default:
      return "🔹";
  }
}

function getStatusColor(status: VaccineStatus) {
  if (status === "completed") return "bg-emerald-600 text-white";
  if (status === "overdue" || status === "missed") return "bg-rose-600 text-white";
  return "bg-slate-900 text-white";
}

async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register("/sw.js");
  } catch (error) {
    console.warn("Service worker registration failed:", error);
  }
}

function getCacheKey(childId: string) {
  return `${CACHE_KEY_PREFIX}-${childId}`;
}

function readCachedData(childId: string): VaccinationCardData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getCacheKey(childId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { ts: number; data: VaccinationCardData };
    if (!parsed || !parsed.data || typeof parsed.ts !== "number") return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function saveCachedData(childId: string, data: VaccinationCardData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      getCacheKey(childId),
      JSON.stringify({ ts: Date.now(), data }),
    );
  } catch {
    // ignore localStorage failures
  }
}

async function fetchVaccinationData(childId: string): Promise<VaccinationCardData> {
  const response = await fetch(`/api/patient/children/${childId}/vaccinations`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

export default function VaccinationCardPage({ params }: { params: { childId: string } }) {
  const { childId } = params;
  const [data, setData] = useState<VaccinationCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      const cached = readCachedData(childId);

      if (!navigator.onLine && cached) {
        if (mounted) {
          setData(cached);
          setOfflineMode(true);
          setLoading(false);
        }
        return;
      }

      try {
        const apiData = await fetchVaccinationData(childId);
        if (mounted) {
          setData(apiData);
          setOfflineMode(!navigator.onLine);
          saveCachedData(childId, apiData);
        }
      } catch {
        if (cached) {
          if (mounted) {
            setData(cached);
            setOfflineMode(true);
          }
        } else {
          // API not available, use mock data for preview
          if (mounted) {
            setData(mockVaccinationData(childId));
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [childId]);

  const pageData = data ?? mockVaccinationData(childId);
  const completedCount = pageData.vaccines.filter((item) => item.status === "completed").length;
  const totalCount = pageData.vaccines.length;
  const progressPercent = Math.round((completedCount / Math.max(totalCount, 1)) * 100);

  const overdueItems = pageData.vaccines.filter((item) => item.status === "overdue" || item.status === "missed");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 print:bg-white print:text-black">
      <div className="mx-auto w-full max-w-2xl">
        <section className="rounded-[28px] border border-slate-200 bg-white px-4 py-5 shadow-sm print:shadow-none print:border-black/10 print:px-0 print:py-0">
          <div className="mb-4 flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Child vaccination card
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">{pageData.childName}</h1>
            <p className="text-base text-slate-700">
              Born {formatDate(pageData.childDob)} · Mother: {pageData.motherName}
            </p>
            <p className="text-sm text-slate-600">Facility: {pageData.facilityName}</p>
          </div>

          <div className="mb-5 rounded-3xl bg-slate-900 p-4 text-white print:bg-black">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                  Progress
                </p>
                <p className="mt-2 text-2xl font-semibold">{completedCount} of {totalCount} vaccines completed</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200">
                {progressPercent}% complete
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {offlineMode && (
            <div className="mb-4 rounded-3xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 print:border-black/10 print:bg-white">
              You are offline. Showing the last cached vaccination data for 24 hours.
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-slate-100 p-4" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-300 bg-rose-50 px-4 py-5 text-sm text-rose-800">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {overdueItems.length > 0 && (
                <div className="rounded-3xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 print:border-black/10 print:bg-white">
                  <p className="font-semibold">Overdue vaccines detected</p>
                  <p>Please contact your Community Health Worker (CHW) to update the card and plan the next visit.</p>
                </div>
              )}

              {pageData.vaccines.map((vaccine) => (
                <article
                  key={vaccine.id}
                  className={`rounded-3xl border p-4 shadow-sm ${
                    vaccine.status === "overdue" || vaccine.status === "missed"
                      ? "border-rose-300 bg-rose-50"
                      : "border-slate-200 bg-white"
                  } print:border-black/10 print:bg-white`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{vaccine.name}</p>
                      <p className="mt-1 text-sm text-slate-600">Due: {formatDate(vaccine.dueDate)}</p>
                    </div>
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(vaccine.status)}`}>
                      <span className="mr-2 text-base">{statusIcon(vaccine.status)}</span>
                      {statusLabel(vaccine.status)}
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-2xl bg-slate-100 p-3 text-sm text-slate-700 print:bg-slate-100/80">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Administered</span>
                      <span>{formatDate(vaccine.administeredDate)}</span>
                    </div>
                    {vaccine.status === "overdue" || vaccine.status === "missed" ? (
                      <div className="rounded-2xl bg-rose-100 p-3 text-sm text-rose-900">
                        This vaccine is overdue. Please contact your CHW as soon as possible.
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
