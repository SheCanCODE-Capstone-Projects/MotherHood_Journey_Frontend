"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getMotherProfile, openPregnancy, closePregnancy } from "@/lib/api/mothers";
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
  Plus,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ motherId: string }> };

// ─── Pregnancy card ───────────────────────────────────────────────────────────

function PregnancyCard({
  pregnancy,
  isActive,
  motherId,
  facilityId,
  onClose,
}: {
  pregnancy: PregnancyDTO;
  isActive: boolean;
  motherId: string;
  facilityId: string;
  onClose: () => void;
}) {
  const statusConfig: Record<string, { className: string; dot: string }> = {
    active: { className: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    completed: { className: "bg-[#E8F4F4] text-[#2C6F73] border-[#B9D8D5]", dot: "bg-[#2C6F73]" },
    lost: { className: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
    referred: { className: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  };
  const cfg = statusConfig[pregnancy.status] ?? statusConfig.completed;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${
        isActive
          ? "border-[#2C6F73] bg-gradient-to-r from-[#F0F9F9] to-white ring-1 ring-[#2C6F73]/20"
          : "border-[#D5E9E6] bg-white"
      }`}
    >
      {isActive && <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#2C6F73] to-[#5B8784]" />}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-[#2C6F73]" : "bg-[#F0F9F9]"}`}>
            <Baby className={`h-4 w-4 ${isActive ? "text-white" : "text-[#2C6F73]"}`} />
          </div>
          <div className="min-w-[80px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5B8784]">Gravida · Para</p>
            <p className="font-bold text-[#1D5052]">G{pregnancy.gravida} · P{pregnancy.para}</p>
          </div>
        </div>

        <div className="hidden h-8 w-px bg-[#D5E9E6] sm:block" />
        <div className="min-w-[100px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5B8784]">LMP Date</p>
          <p className="text-sm font-semibold text-[#1D5052]">
            {new Date(pregnancy.lmpDate + "T00:00:00").toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>

        <div className="hidden h-8 w-px bg-[#D5E9E6] sm:block" />
        <div className="min-w-[100px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5B8784]">Due Date (EDD)</p>
          <p className="text-sm font-semibold text-[#1D5052]">
            {new Date(pregnancy.eddDate + "T00:00:00").toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>

        <div className="hidden h-8 w-px bg-[#D5E9E6] sm:block" />
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${cfg.className}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {pregnancy.status}
        </span>

        <div className="ml-auto flex items-center gap-3">
          {isActive && (
            <>
              <span className="rounded-full bg-[#2C6F73] px-2.5 py-0.5 text-xs font-semibold text-white">Current</span>
              <button
                onClick={onClose}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                Close Pregnancy
              </button>
            </>
          )}
          <Link
            href={`/mothers/${motherId}/pregnancies/${pregnancy.id}/visits`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2C6F73] hover:underline"
          >
            Visit History <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Open Pregnancy Modal ─────────────────────────────────────────────────────

function OpenPregnancyModal({
  motherId,
  facilityId,
  onSuccess,
  onCancel,
}: {
  motherId: string;
  facilityId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [lmpDate, setLmpDate] = useState("");
  const [gravida, setGravida] = useState(1);
  const [para, setPara] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calcEdd = (lmp: string) => {
    const d = new Date(lmp);
    d.setDate(d.getDate() + 280);
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (!lmpDate) { setError("LMP date is required."); return; }
    setError(null);
    setLoading(true);
    try {
      await openPregnancy(motherId, facilityId, { lmpDate, gravida, para });
      onSuccess();
    } catch (e: any) {
      setError(e?.message || "Failed to open pregnancy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1D5052]">Open New Pregnancy</h3>
          <button onClick={onCancel} className="rounded-full p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Menstrual Period (LMP) <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {lmpDate && (
              <p className="mt-1 text-xs text-gray-500">
                Estimated Due Date: <strong>{calcEdd(lmpDate)}</strong>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gravida</label>
              <input
                type="number" min={1} max={20} value={gravida}
                onChange={(e) => setGravida(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Para</label>
              <input
                type="number" min={0} max={20} value={para}
                onChange={(e) => setPara(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !lmpDate}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2C6F73] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052] disabled:opacity-50"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : "Open Pregnancy"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MotherProfilePage({ params }: Props) {
  const { motherId } = use(params);
  const { data: session } = useSession();
  const facilityId = session?.user?.facilityId ? String(session.user.facilityId) : "";
  const qc = useQueryClient();

  const [showOpenModal, setShowOpenModal] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["mother-profile", motherId],
    queryFn: () => getMotherProfile(motherId),
    retry: 1,
  });

  const handleClosePregnancy = async (pregnancyId: string) => {
    if (!confirm("Close this pregnancy record?")) return;
    setClosingId(pregnancyId);
    try {
      await closePregnancy(pregnancyId, facilityId);
      qc.invalidateQueries({ queryKey: ["mother-profile", motherId] });
    } catch (e: any) {
      alert(e?.message || "Failed to close pregnancy.");
    } finally {
      setClosingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2C6F73]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="font-semibold text-gray-700">Could not load mother profile.</p>
        <p className="text-sm text-gray-400">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
        <Link href="/mothers" className="mt-2 text-sm font-semibold text-[#2C6F73] hover:underline">
          ← Back to Mothers List
        </Link>
      </div>
    );
  }

  const { mother, pregnancies, activePregnancy } = profile;

  const initials = mother.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {showOpenModal && (
        <OpenPregnancyModal
          motherId={motherId}
          facilityId={facilityId}
          onSuccess={() => {
            setShowOpenModal(false);
            qc.invalidateQueries({ queryKey: ["mother-profile", motherId] });
          }}
          onCancel={() => setShowOpenModal(false)}
        />
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* ── Main column ── */}
        <div className="min-w-0 flex-1 space-y-5">

          {/* Identity card */}
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
                    <h1 className="text-2xl font-bold text-[#1D5052]">{mother.name}</h1>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                      Health ID: <span className="font-bold text-[#2C6F73]">{mother.id}</span>
                    </p>
                  </div>
                  {activePregnancy ? (
                    <button
                      onClick={() => handleClosePregnancy(activePregnancy.id)}
                      disabled={closingId === activePregnancy.id}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                    >
                      {closingId === activePregnancy.id ? "Closing…" : "Close Pregnancy"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowOpenModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#2C6F73] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D5052]"
                    >
                      <Plus className="h-3.5 w-3.5" /> New Pregnancy
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#5B8784]">Contact</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#2C6F73]" />
                      <span className="text-sm font-semibold text-[#1D5052]">{mother.phone || "—"}</span>
                      <NidaStatusBadge status={mother.nidaStatus} />
                    </div>
                  </div>

                  {(mother.location.sector || mother.location.district) && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#5B8784]">Location</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#2C6F73]" />
                        <span className="text-sm font-semibold text-[#1D5052]">
                          {[mother.location.village, mother.location.sector, mother.location.district]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Pregnancy timeline */}
          <section className="rounded-3xl border border-[#D5E9E6] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1D5052]">Pregnancy Timeline</h2>
                <p className="text-sm text-[#5B8784]">
                  {pregnancies.length} record{pregnancies.length !== 1 ? "s" : ""} found
                </p>
              </div>
              {!activePregnancy && (
                <button
                  onClick={() => setShowOpenModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#2C6F73] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]"
                >
                  <Plus className="h-4 w-4" /> Open Pregnancy
                </button>
              )}
            </div>

            {pregnancies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#B9D8D5] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F9F9]">
                  <Calendar className="h-7 w-7 text-[#2C6F73]" />
                </div>
                <p className="mt-3 font-semibold text-[#1D5052]">No pregnancies recorded</p>
                <p className="mt-1 text-sm text-[#5B8784]">Register the first pregnancy to start ANC tracking.</p>
                <button
                  onClick={() => setShowOpenModal(true)}
                  className="mt-5 rounded-full bg-[#2C6F73] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]"
                >
                  + Open New Pregnancy
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pregnancies.map((p) => (
                  <PregnancyCard
                    key={p.id}
                    pregnancy={p}
                    isActive={p.id === activePregnancy?.id}
                    motherId={motherId}
                    facilityId={facilityId}
                    onClose={() => handleClosePregnancy(p.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Sidebar ── */}
        <div className="w-full space-y-4 lg:w-72 lg:shrink-0">

          {/* Active pregnancy widget */}
          {activePregnancy ? (
            <div className="rounded-3xl bg-gradient-to-br from-[#1D5052] to-[#2C6F73] p-5 shadow-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B9D8D5]">Active Pregnancy</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="rounded-xl bg-white/20 px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-white">G{activePregnancy.gravida}</p>
                  <p className="text-xs text-[#B9D8D5]">Gravida</p>
                </div>
                <div className="rounded-xl bg-white/20 px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-white">P{activePregnancy.para}</p>
                  <p className="text-xs text-[#B9D8D5]">Para</p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5 border-t border-white/20 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#B9D8D5]">LMP</p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(activePregnancy.lmpDate + "T00:00:00").toLocaleDateString("en-RW", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#B9D8D5]">EDD</p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(activePregnancy.eddDate + "T00:00:00").toLocaleDateString("en-RW", {
                      day: "numeric", month: "short", year: "numeric",
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
              <p className="mt-2 font-semibold text-[#1D5052]">No Active Pregnancy</p>
              <button
                onClick={() => setShowOpenModal(true)}
                className="mt-3 w-full rounded-full bg-[#2C6F73] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D5052]"
              >
                + Open Pregnancy
              </button>
            </div>
          )}

          {/* CHW card */}
          {mother.chw?.name && (
            <div className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5B8784]">Assigned CHW</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1D5052] to-[#2C6F73]">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1D5052]">{mother.chw.name}</p>
                  <p className="text-xs text-[#5B8784]">Community Health Worker</p>
                </div>
              </div>
              {mother.chw.phone && (
                <div className="mt-4 border-t border-[#D5E9E6] pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F9F9]">
                      <Phone className="h-3.5 w-3.5 text-[#2C6F73]" />
                    </div>
                    <p className="text-sm font-medium text-[#1D5052]">{mother.chw.phone}</p>
                  </div>
                  <a
                    href={`tel:${mother.chw.phone.replace(/\s/g, "")}`}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#2C6F73] py-2 text-xs font-semibold text-[#2C6F73] transition-colors hover:bg-[#F0F9F9]"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call CHW
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
