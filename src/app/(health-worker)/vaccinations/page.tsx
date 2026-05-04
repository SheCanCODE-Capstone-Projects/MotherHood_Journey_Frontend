"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Search, X } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { VaccinationStatusPill } from "@/shared/components/status";
import { ApiError } from "@/shared/types/api";
import type { ChildVaccinationSessionRecord } from "@/features/child/types";
import {
  useAdministerVaccination,
  useVaccinationSessionSearch,
} from "@/features/child/hooks/useVaccinationSession";
import { cn } from "@/shared/lib/utils";

type ToastState = {
  message: string;
  tone: "success" | "error";
} | null;

type AdminDialogState = {
  vaccination: ChildVaccinationSessionRecord;
  lotNumber: string;
} | null;

function formatAge(years: number, months: number) {
  const ageParts = [years > 0 ? `${years} year${years === 1 ? "" : "s"}` : null, months > 0 ? `${months} month${months === 1 ? "" : "s"}` : null].filter(Boolean);

  return ageParts.length > 0 ? ageParts.join(" ") : "Newborn";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function SessionLoadingCard() {
  return (
    <div className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function VaccinationSessionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [adminDialog, setAdminDialog] = useState<AdminDialogState>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!adminDialog) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAdminDialog(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [adminDialog]);

  const sessionQuery = useVaccinationSessionSearch(debouncedSearchTerm);
  const administerMutation = useAdministerVaccination();

  const session = sessionQuery.data;
  const dueVaccines = session?.dueVaccines ?? [];
  const notFound = sessionQuery.isError && sessionQuery.error instanceof ApiError && sessionQuery.error.statusCode === 404;

  const handleConfirmAdministration = useCallback(() => {
    if (!adminDialog) {
      return;
    }

    administerMutation.mutate(
      {
      vaccinationId: adminDialog.vaccination.id,
      lotNumber: adminDialog.lotNumber.trim(),
      },
      {
        onSuccess: () => {
          setAdminDialog(null);
          setToast({
            tone: "success",
            message: `${adminDialog.vaccination.vaccineName} marked as administered.`,
          });
        },
        onError: (error) => {
          const message = error instanceof ApiError ? error.message : "Unable to administer vaccination.";
          setToast({ tone: "error", message });
        },
      },
    );
  }, [adminDialog, administerMutation]);

  const canConfirmAdministration = useMemo(() => {
    return Boolean(adminDialog?.lotNumber.trim()) && !administerMutation.isPending;
  }, [adminDialog, administerMutation.isPending]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-8">
      <PageHeader
        eyebrow="Health Worker"
        title="Vaccination Session"
        subtitle="Search a child by health ID or birth certificate number, review due vaccines, and record administered doses without leaving the session."
      />

      <section className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
        <label className="text-sm font-semibold text-[#1D5052]" htmlFor="child-search">
          Find child
        </label>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#54797C]" />
          <input
            id="child-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by health ID or birth certificate number"
            className="h-12 w-full rounded-2xl border border-[#D5E9E6] bg-white pl-11 pr-12 text-sm text-slate-950 shadow-sm outline-none transition focus:border-[#1D5551] focus:ring-2 focus:ring-[#1D5551]/15"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-xl text-[#54797C] transition hover:bg-[#F3FAF9] hover:text-[#1D5551]"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-[#54797C]">
          {debouncedSearchTerm.length === 0
            ? "Enter a child health ID or birth certificate number to load the vaccination session."
            : sessionQuery.isFetching
              ? "Searching for the child record..."
              : session
                ? `Loaded session for ${session.child.fullName}.`
                : "Waiting for the backend response."}
        </p>
      </section>

      {sessionQuery.isLoading ? <SessionLoadingCard /> : null}

      {sessionQuery.isError && !notFound ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
          {sessionQuery.error instanceof Error ? sessionQuery.error.message : "Unable to load the vaccination session."}
        </section>
      ) : null}

      {notFound ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 shadow-sm">
          No child record matched this search. Try the child health ID or birth certificate number again.
        </section>
      ) : null}

      {session ? (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <article className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">Child</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#1D5052]">{session.child.fullName}</h2>
              <p className="mt-2 text-sm text-[#54797C]">
                Age {formatAge(session.child.ageInYears, session.child.ageInMonths)} · {session.child.motherName}
              </p>
            </article>

            <article className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">Health ID</p>
              <p className="mt-2 text-lg font-semibold text-[#1D5052]">{session.child.healthId}</p>
              <p className="mt-1 text-sm text-[#54797C]">Birth cert: {session.child.birthCertificateNo}</p>
            </article>

            <article className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">DOB</p>
              <p className="mt-2 text-lg font-semibold text-[#1D5052]">{formatDate(session.child.dateOfBirth)}</p>
              <p className="mt-1 text-sm text-[#54797C]">{session.child.facilityName}</p>
            </article>
          </section>

          <section className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">Today’s due vaccines</p>
                <h2 className="mt-2 text-xl font-semibold text-[#1D5052]">Vaccination session checklist</h2>
              </div>
              <span className="rounded-full bg-[#F3FAF9] px-3 py-1 text-xs font-semibold text-[#1D5551]">
                {dueVaccines.length} due today
              </span>
            </div>

            <div className="mt-5 grid gap-4">
              {dueVaccines.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D5E9E6] bg-[#FAFCFC] p-6 text-sm text-[#54797C]">
                  No vaccines are due right now for this child.
                </div>
              ) : (
                dueVaccines.map((vaccine) => (
                  <article
                    key={vaccine.id}
                    className={cn(
                      "rounded-[1.6rem] border p-4 shadow-sm transition",
                      vaccine.status === "OVERDUE" ? "border-red-200 bg-red-50" : "border-[#D5E9E6] bg-white",
                    )}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5B8784]">{vaccine.doseLabel}</p>
                        <h3 className="text-xl font-semibold text-[#1D5052]">{vaccine.vaccineName}</h3>
                        <p className="text-sm text-[#54797C]">Due on {formatDate(vaccine.dueDate)}</p>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <VaccinationStatusPill status={vaccine.status} />
                        {vaccine.status !== "ADMINISTERED" ? (
                          <Button
                            type="button"
                            className="rounded-xl bg-[#1D5551] px-4 text-white hover:bg-[#154844]"
                            onClick={() => setAdminDialog({ vaccination: vaccine, lotNumber: "" })}
                          >
                            Mark administered
                          </Button>
                        ) : (
                          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="size-4" />
                            Administered
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#54797C]">
                      <span>Record ID: {vaccine.id}</span>
                      {vaccine.note ? <span>{vaccine.note}</span> : null}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </>
      ) : null}

      {toast ? (
        <div
          className={cn(
            "fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg",
            toast.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/70">
            {toast.tone === "success" ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
          </span>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ) : null}

      {adminDialog ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
          onClick={() => setAdminDialog(null)}
        >
          <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">Mark administered</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#1D5052]">{adminDialog.vaccination.vaccineName}</h2>
                <p className="mt-2 text-sm text-[#54797C]">
                  Enter the lot number used during today’s vaccination session.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setAdminDialog(null)}
                aria-label="Close administer dialog"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-5 space-y-2">
              <label htmlFor="lot-number" className="text-sm font-semibold text-[#1D5052]">
                Lot number
              </label>
              <input
                id="lot-number"
                value={adminDialog.lotNumber}
                onChange={(event) => setAdminDialog((current) => (current ? { ...current, lotNumber: event.target.value } : current))}
                placeholder="Enter lot number"
                className="h-12 w-full rounded-2xl border border-[#D5E9E6] px-4 text-sm outline-none transition focus:border-[#1D5551] focus:ring-2 focus:ring-[#1D5551]/15"
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setAdminDialog(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-[#1D5551] text-white hover:bg-[#154844]"
                disabled={!canConfirmAdministration}
                onClick={handleConfirmAdministration}
              >
                {administerMutation.isPending ? "Saving..." : "Confirm administration"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
