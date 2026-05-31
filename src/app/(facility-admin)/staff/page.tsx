"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  ShieldAlert,
  UserCog,
  Users,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import {
  activateStaffAccount,
  deactivateStaffAccount,
  getFacilityStaffMembers,
  type FacilityStaffMember,
} from "@/lib/api/users";

const staffQueryKey = ["facility-admin", "staff-members"] as const;

function formatLastLogin(lastLogin: string | null) {
  if (!lastLogin) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(lastLogin));
}

function sortStaffMembers(members: FacilityStaffMember[]) {
  return [...members].sort((left, right) => {
    if (left.active !== right.active) {
      return left.active ? -1 : 1;
    }

    const leftTime = left.lastLogin ? new Date(left.lastLogin).getTime() : 0;
    const rightTime = right.lastLogin ? new Date(right.lastLogin).getTime() : 0;

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return left.fullName.localeCompare(right.fullName);
  });
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function updateCachedStaffMembers(
  queryClient: ReturnType<typeof useQueryClient>,
  memberId: string,
  active: boolean,
) {
  queryClient.setQueryData<FacilityStaffMember[]>(staffQueryKey, (current) =>
    current?.map((member) =>
      member.id === memberId
        ? {
            ...member,
            active,
            lastLogin: active && !member.lastLogin ? new Date().toISOString() : member.lastLogin,
          }
        : member,
    ),
  );
}

function StaffStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600",
      )}
    >
      {active ? <CheckCircle2 className="size-3.5" /> : <ShieldAlert className="size-3.5" />}
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function FacilityStaffPage() {
  const { roleTheme, organizationName } = useRole({ fallbackRole: "facility_admin" });
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<FacilityStaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const staffQuery = useQuery({
    queryKey: staffQueryKey,
    queryFn: getFacilityStaffMembers,
    staleTime: 5 * 60 * 1000,
  });

  const activateMutation = useMutation({
    mutationFn: activateStaffAccount,
    onMutate: async (memberId: string) => {
      await queryClient.cancelQueries({ queryKey: staffQueryKey });
      const previous = queryClient.getQueryData<FacilityStaffMember[]>(staffQueryKey);
      updateCachedStaffMembers(queryClient, memberId, true);
      return { previous };
    },
    onError: (_error, _memberId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(staffQueryKey, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffQueryKey });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateStaffAccount,
    onMutate: async (memberId: string) => {
      await queryClient.cancelQueries({ queryKey: staffQueryKey });
      const previous = queryClient.getQueryData<FacilityStaffMember[]>(staffQueryKey);
      updateCachedStaffMembers(queryClient, memberId, false);
      return { previous };
    },
    onError: (_error, _memberId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(staffQueryKey, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffQueryKey });
    },
  });

  const staffMembers = useMemo(
    () => sortStaffMembers(staffQuery.data ?? []),
    [staffQuery.data],
  );

  const visibleStaffMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return staffMembers;
    }

    return staffMembers.filter((member) => {
      const searchableValues = [member.fullName, member.phoneNumber, member.nationalId];
      return searchableValues.some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [searchTerm, staffMembers]);

  const activeCount = useMemo(
    () => staffMembers.filter((member) => member.active).length,
    [staffMembers],
  );

  const inactiveCount = staffMembers.length - activeCount;

  const lastLoginLabel = useMemo(() => {
    const latestLogin = visibleStaffMembers
      .map((member) => member.lastLogin)
      .filter((value): value is string => Boolean(value))
      .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

    return latestLogin ? formatLastLogin(latestLogin) : "No logins yet";
  }, [visibleStaffMembers]);

  const openDeactivateDialog = (member: FacilityStaffMember) => {
    setSelectedMember(member);
  };

  const closeDeactivateDialog = () => {
    if (!deactivateMutation.isPending) {
      setSelectedMember(null);
    }
  };

  const confirmDeactivate = async () => {
    if (!selectedMember) {
      return;
    }

    await deactivateMutation.mutateAsync(selectedMember.id);
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Facility Admin"
        title="Staff Management"
        subtitle={`Review and manage HEALTH_WORKER accounts for ${organizationName}. Deactivated staff are kept at the bottom for quick scanning.`}
        action={
          <Button asChild className="h-10 rounded-[8px] bg-[#064F56] px-5 text-white">
            <Link href="/login?mode=signup">
              <UserCog className="size-4" />
              New staff account
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article
          className="rounded-[8px] border bg-white p-5 shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
                Active accounts
              </p>
              <p className="mt-2 text-3xl font-semibold" style={{ color: roleTheme.text }}>
                {activeCount}
              </p>
            </div>
            <div className="grid size-11 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700">
              <Users className="size-5" />
            </div>
          </div>
        </article>

        <article
          className="rounded-[8px] border bg-white p-5 shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
                Inactive accounts
              </p>
              <p className="mt-2 text-3xl font-semibold" style={{ color: roleTheme.text }}>
                {inactiveCount}
              </p>
            </div>
            <div className="grid size-11 place-items-center rounded-[8px] bg-slate-100 text-slate-600">
              <ShieldAlert className="size-5" />
            </div>
          </div>
        </article>

        <article
          className="rounded-[8px] border bg-white p-5 shadow-sm"
          style={{ borderColor: roleTheme.border }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
                Latest login
              </p>
              <p className="mt-2 text-sm font-semibold leading-6" style={{ color: roleTheme.text }}>
                {lastLoginLabel}
              </p>
            </div>
            <div className="grid size-11 place-items-center rounded-[8px] bg-[#E7F3F1]" style={{ color: roleTheme.accent }}>
              <Clock3 className="size-5" />
            </div>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-[8px] border border-[#D5E7E4] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#D5E9E6] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5B8784]">
              Facility team
            </p>
            <h2 className="mt-1 text-lg font-semibold" style={{ color: roleTheme.text }}>
              HEALTH_WORKER Accounts
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-[8px] bg-[#F3FAF8] px-4 py-2 text-sm text-[#54797C]">
            <CalendarClock className="size-4" />
            <span>{visibleStaffMembers.length} visible / {staffMembers.length} total members</span>
          </div>
        </div>

        <div className="px-5 pt-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
            Search roster
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-[8px] border border-[#D5E9E6] bg-[#F8FCFB] px-4 py-3 shadow-sm">
            <Users className="size-4 shrink-0 text-[#5B8784]" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, phone number, or national ID"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#8AA3A5]"
            />
            {searchTerm ? (
              <button
                type="button"
                className="text-sm font-semibold text-[#2F7F7A] hover:underline"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {staffQuery.isPending ? (
          <div className="flex min-h-72 items-center justify-center text-[#54797C]">
            <Loader2 className="mr-2 size-5 animate-spin" />
            Loading staff accounts...
          </div>
        ) : staffQuery.isError ? (
          <div className="space-y-3 px-5 py-12 text-center">
            <p className="text-lg font-semibold" style={{ color: roleTheme.text }}>
              We could not load the live roster.
            </p>
            <p className="text-sm text-[#54797C]">
              Demo data is still available, so you can continue managing staff while the backend catches up.
            </p>
            <div className="flex justify-center">
              <Button asChild variant="outline" className="rounded-[8px]">
                <Link href="/login?mode=signup">
                  <ArrowRight className="size-4" />
                  Continue to new staff account
                </Link>
              </Button>
            </div>
          </div>
        ) : staffMembers.length === 0 ? (
          <div className="space-y-3 px-5 py-12 text-center">
            <p className="text-lg font-semibold" style={{ color: roleTheme.text }}>
              No HEALTH_WORKER accounts found.
            </p>
            <p className="text-sm text-[#54797C]">
              Create the first staff account to start assigning facility users.
            </p>
            <div className="flex justify-center">
              <Button asChild className="rounded-[8px] bg-[#064F56] text-white">
                <Link href="/login?mode=signup">
                  <UserCog className="size-4" />
                  New staff account
                </Link>
              </Button>
            </div>
          </div>
        ) : visibleStaffMembers.length === 0 ? (
          <div className="space-y-3 px-5 py-12 text-center">
            <p className="text-lg font-semibold" style={{ color: roleTheme.text }}>
              No staff members match your search.
            </p>
            <p className="text-sm text-[#54797C]">
              Try a different name, phone number, or national ID.
            </p>
            {searchTerm ? (
              <div className="flex justify-center">
                <Button variant="outline" className="rounded-[8px]" onClick={() => setSearchTerm("") }>
                  Clear search
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D5E9E6]">
              <thead className="bg-[#F7FBFA]">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#5B8784]">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Phone number</th>
                  <th className="px-5 py-4">National ID</th>
                  <th className="px-5 py-4">Account status</th>
                  <th className="px-5 py-4">Last login date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EEEC]">
                {visibleStaffMembers.map((member) => {
                  const rowMuted = !member.active;

                  return (
                    <tr
                      key={member.id}
                      className={cn(
                        "transition-colors hover:bg-[#FAFCFB]",
                        rowMuted && "bg-[#FAFBFB] text-slate-500",
                      )}
                    >
                      <td className={cn("px-5 py-4", rowMuted && "opacity-75")}>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-11 shrink-0 items-center justify-center rounded-[8px] text-sm font-semibold",
                              member.active
                                ? "bg-[#E3F3F0] text-[#1D5551]"
                                : "bg-slate-100 text-slate-500",
                            )}
                          >
                            {getInitials(member.fullName)}
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: rowMuted ? undefined : roleTheme.text }}>
                              {member.fullName}
                            </p>
                            <p className="text-xs text-[#6C8587]">{member.facilityName ?? organizationName}</p>
                          </div>
                        </div>
                      </td>
                      <td className={cn("px-5 py-4 text-sm", rowMuted && "opacity-75")}>
                        <a className="font-medium text-[#1D5052] hover:underline" href={`tel:${member.phoneNumber}`}>
                          {member.phoneNumber}
                        </a>
                      </td>
                      <td className={cn("px-5 py-4 text-sm text-[#4F6E71]", rowMuted && "opacity-75")}>
                        {member.nationalId}
                      </td>
                      <td className="px-5 py-4">
                        <StaffStatusBadge active={member.active} />
                      </td>
                      <td className={cn("px-5 py-4 text-sm text-[#4F6E71]", rowMuted && "opacity-75")}>
                        {formatLastLogin(member.lastLogin)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {member.active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-[8px] border-[#D5E9E6] bg-white text-[#1D5052]"
                              onClick={() => openDeactivateDialog(member)}
                              disabled={deactivateMutation.isPending}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="rounded-[8px] bg-[#064F56] text-white"
                              onClick={() => activateMutation.mutate(member.id)}
                              disabled={activateMutation.isPending}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedMember ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[8px] border border-[#D5E9E6] bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="rounded-[8px] bg-amber-50 p-3 text-amber-700">
                <AlertTriangle className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B8784]">
                  Confirm deactivation
                </p>
                <h2 className="mt-2 text-xl font-semibold" style={{ color: roleTheme.text }}>
                  Remove access for {selectedMember.fullName}?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#54797C]">
                  This will mark the account inactive immediately. The health worker will lose access to the facility portal until you activate the account again.
                </p>

                <div className="mt-5 rounded-[8px] border border-amber-100 bg-amber-50/70 p-4 text-sm text-amber-900">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                    <p>
                      Use deactivation for staff who are on leave or should no longer manage facility records.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    className="rounded-[8px] border-[#D5E9E6]"
                    onClick={closeDeactivateDialog}
                    disabled={deactivateMutation.isPending}
                  >
                    <ArrowLeft className="size-4" />
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-[8px]"
                    onClick={confirmDeactivate}
                    disabled={deactivateMutation.isPending}
                  >
                    {deactivateMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ShieldAlert className="size-4" />
                    )}
                    Deactivate access
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
