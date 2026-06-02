"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Users, AlertCircle, CheckCircle, Loader2, Search, UserPlus } from "lucide-react";
import { getMothers } from "@/lib/api/mothers";
import type { MotherDTO } from "@/shared/types/mother";

function NidaBadge({ status }: { status: MotherDTO["nidaStatus"] }) {
  const styles: Record<string, string> = {
    verified: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    unverified: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function MothersPage() {
  const router = useRouter();
  const roleTheme = ROLE_THEMES.health_worker;
  const [search, setSearch] = useState("");

  const { data: mothers = [], isLoading } = useQuery({
    queryKey: ["mothers", search],
    queryFn: () => getMothers(search || undefined),
    staleTime: 30_000,
  });

  const verified = mothers.filter((m) => m.nidaStatus === "verified").length;
  const pending = mothers.filter((m) => m.nidaStatus === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Health Worker"
        title="Mothers"
        subtitle="Manage and monitor mothers registered at your facility"
        action={
          <button
            onClick={() => router.push("/mothers/register")}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <UserPlus className="size-4" />
            Register Mother
          </button>
        }
      />

      {/* Statistics */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Registered", value: isLoading ? "—" : String(mothers.length), icon: Users, color: roleTheme.accent },
          { label: "NIDA Verified", value: isLoading ? "—" : String(verified), icon: CheckCircle, color: "#10B981" },
          { label: "Pending Verification", value: isLoading ? "—" : String(pending), icon: AlertCircle, color: "#F59E0B" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <Icon className="size-6" style={{ color: stat.color }} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-full border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />
      </div>

      {/* Mothers List */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>
          Mothers Under Care
          {!isLoading && <span className="ml-2 text-sm font-normal text-gray-400">({mothers.length})</span>}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin" style={{ color: roleTheme.accent }} />
          </div>
        ) : mothers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed p-10 text-center" style={{ borderColor: roleTheme.border }}>
            <Users className="mx-auto size-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-400">
              {search ? "No mothers match your search." : "No mothers registered yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mothers.map((mother) => (
              <button
                key={mother.id}
                type="button"
                onClick={() => router.push(`/mothers/${mother.id}`)}
                className="w-full rounded-2xl border-2 p-5 text-left transition-shadow hover:shadow-md"
                style={{ borderColor: roleTheme.border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid size-10 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: roleTheme.accent }}
                    >
                      {mother.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: roleTheme.text }}>{mother.name}</p>
                      {mother.phone && (
                        <p className="text-sm text-gray-500">{mother.phone}</p>
                      )}
                    </div>
                  </div>
                  <NidaBadge status={mother.nidaStatus} />
                </div>

                {(mother.location.sector || mother.location.district) && (
                  <p className="mt-2 text-xs text-gray-400">
                    {[mother.location.village, mother.location.sector, mother.location.district]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
