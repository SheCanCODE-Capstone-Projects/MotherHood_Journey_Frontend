"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, UserPlus, Phone, MapPin, Loader2, XCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { NidaStatusBadge } from "@/shared/components/status/NidaStatusBadge";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import { getMothers } from "@/lib/api/mothers";
import type { MotherDTO } from "@/shared/types/mother";

function useDebounce(value: string, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useState(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  });
  return debounced;
}

function MotherRow({ mother, accentColor, borderColor }: { mother: MotherDTO; accentColor: string; borderColor: string }) {
  const initials = mother.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const age = mother.dateOfBirth
    ? Math.floor((Date.now() - new Date(mother.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <tr className="hover:bg-gray-50/60 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-800">{mother.name}</p>
            <p className="text-xs text-gray-400">{mother.id}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">
        {age !== null ? `${age} yrs` : "—"}
      </td>
      <td className="px-5 py-3.5">
        <NidaStatusBadge status={mother.nidaStatus.toUpperCase()} />
      </td>
      <td className="hidden px-5 py-3.5 md:table-cell">
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
          <Phone className="size-3.5 text-gray-400" />
          {mother.phone}
        </span>
      </td>
      <td className="hidden px-5 py-3.5 lg:table-cell">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="size-3.5 text-gray-400" />
          {mother.location.sector}, {mother.location.district}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <Link href={`/mothers/${mother.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl px-3 text-xs font-medium"
            style={{ color: accentColor }}
          >
            View Profile
          </Button>
        </Link>
      </td>
    </tr>
  );
}

export default function MothersListPage() {
  const { roleTheme } = useRole({ fallbackRole: "health_worker" });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data: mothers, isLoading, isError, refetch } = useQuery({
    queryKey: ["mothers", debouncedSearch],
    queryFn: () => getMothers(debouncedSearch || undefined),
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mothers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search and manage registered mothers at your facility.
          </p>
        </div>
        <Link href="/mothers/register">
          <Button
            className="inline-flex items-center gap-2 rounded-xl text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            <UserPlus className="size-4" />
            Register New Mother
          </Button>
        </Link>
      </div>

      {/* Table card */}
      <div
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        style={{ borderColor: roleTheme.border }}
      >
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-3 border-b px-5 py-4"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="flex items-center gap-2">
            <Users className="size-4" style={{ color: roleTheme.accent }} />
            <h2 className="text-base font-semibold text-gray-800">
              {isLoading ? "Loading…" : `${mothers?.length ?? 0} mothers`}
            </h2>
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or phone…"
              className="h-9 w-56 rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-[#2A7F8A] focus:ring-1 focus:ring-[#2A7F8A]/30 sm:w-72"
            />
          </div>
        </div>

        {/* Table body */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
            <Loader2 className="size-4 animate-spin" /> Loading mothers…
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-gray-400">
            <XCircle className="size-6 text-red-400" />
            <p>Failed to load mothers.</p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : !mothers?.length ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-gray-400">
            <Users className="size-8 text-gray-300" />
            <p>{search ? "No mothers match your search." : "No mothers registered yet."}</p>
            {!search && (
              <Link href="/mothers/register">
                <Button variant="outline" size="sm" className="rounded-xl">
                  Register first mother
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead
                className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400"
                style={{ borderColor: roleTheme.border }}
              >
                <tr>
                  <th className="px-5 py-3">Mother</th>
                  <th className="px-5 py-3">Age</th>
                  <th className="px-5 py-3">NIDA Status</th>
                  <th className="hidden px-5 py-3 md:table-cell">Phone</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Location</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mothers.map((mother) => (
                  <MotherRow
                    key={mother.id}
                    mother={mother}
                    accentColor={roleTheme.accent}
                    borderColor={roleTheme.border}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
