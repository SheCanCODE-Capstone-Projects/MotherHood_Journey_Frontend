"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  getGovUsers,
  updateGovUserStatus,
  type GovUser,
  type GovUserStatus,
} from "@/lib/api/gov-users";
import type { UserRole } from "@/shared/types/auth";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_FILTERS: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "government", label: "Government" },
  { value: "district_officer", label: "District Officer" },
  { value: "facility_admin", label: "Facility Admin" },
  { value: "health_worker", label: "Health Worker" },
  { value: "patient", label: "Patient" },
];

const ROLE_LABELS: Record<UserRole, string> = {
  government: "Government",
  district_officer: "District Officer",
  facility_admin: "Facility Admin",
  health_worker: "Health Worker",
  patient: "Patient",
};

const ROLE_COLORS: Record<UserRole, string> = {
  government: "bg-purple-50 text-purple-700",
  district_officer: "bg-blue-50 text-blue-700",
  facility_admin: "bg-teal-50 text-teal-700",
  health_worker: "bg-emerald-50 text-emerald-700",
  patient: "bg-gray-100 text-gray-600",
};

const STATUS_CONFIG: Record<GovUserStatus, { label: string; className: string; Icon: React.ElementType }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700", Icon: CheckCircle2 },
  SUSPENDED: { label: "Suspended", className: "bg-red-50 text-red-700", Icon: XCircle },
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700", Icon: Clock },
};

// ─── Row action menu ──────────────────────────────────────────────────────────

function ActionMenu({
  user,
  isMohAdmin,
  onStatusChange,
  isPending,
}: {
  user: GovUser;
  isMohAdmin: boolean;
  onStatusChange: (userId: string, status: GovUserStatus) => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!isMohAdmin) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-40 rounded-2xl border border-gray-100 bg-white py-1 shadow-lg">
            {user.status !== "ACTIVE" && (
              <button
                onClick={() => { onStatusChange(user.id, "ACTIVE"); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
              >
                <CheckCircle2 className="size-3.5" /> Activate
              </button>
            )}
            {user.status !== "SUSPENDED" && (
              <button
                onClick={() => { onStatusChange(user.id, "SUSPENDED"); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                <XCircle className="size-3.5" /> Suspend
              </button>
            )}
            {user.status !== "PENDING" && (
              <button
                onClick={() => { onStatusChange(user.id, "PENDING"); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
              >
                <Clock className="size-3.5" /> Set Pending
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GovernmentUsersPage() {
  const { roleTheme } = useRole({ fallbackRole: "government" });
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const isMohAdmin = currentUser?.role === "government";

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const usersQuery = useQuery({
    queryKey: ["gov-users", roleFilter],
    queryFn: () =>
      getGovUsers(roleFilter === "all" ? undefined : roleFilter),
    refetchInterval: 5 * 60_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: GovUserStatus }) =>
      updateGovUserStatus(userId, status),
    onMutate: ({ userId }) => setPendingId(userId),
    onSettled: () => {
      setPendingId(null);
      void queryClient.invalidateQueries({ queryKey: ["gov-users"] });
    },
  });

  const filtered = (usersQuery.data ?? []).filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.organizationName.toLowerCase().includes(q)
    );
  });

  const summary = {
    total: usersQuery.data?.length ?? 0,
    active: usersQuery.data?.filter((u) => u.status === "ACTIVE").length ?? 0,
    suspended: usersQuery.data?.filter((u) => u.status === "SUSPENDED").length ?? 0,
    pending: usersQuery.data?.filter((u) => u.status === "PENDING").length ?? 0,
  };

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "Never";

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all system users across roles and facilities.
        </p>
      </div>

      {/* MOH_ADMIN notice */}
      {!isMohAdmin && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <ShieldAlert className="size-4 shrink-0" />
          You have read-only access. Status changes require MOH_ADMIN privileges.
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: summary.total, color: roleTheme.accent },
          { label: "Active", value: summary.active, color: "#10B981" },
          { label: "Suspended", value: summary.suspended, color: "#EF4444" },
          { label: "Pending", value: summary.pending, color: "#F59E0B" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border bg-white p-5 shadow-sm"
            style={{ borderColor: roleTheme.border }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: stat.color }}>
              {usersQuery.isPending ? "—" : stat.value}
            </p>
          </div>
        ))}
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
            <h2 className="text-base font-semibold text-gray-800">All Users</h2>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users…"
                className="h-9 rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-[#3A8F85] focus:ring-1 focus:ring-[#3A8F85]/30 w-48"
              />
            </div>
            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#3A8F85]"
            >
              {ROLE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {usersQuery.isPending ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
            <Loader2 className="size-4 animate-spin" />
            Loading users…
          </div>
        ) : usersQuery.isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-gray-400">
            <XCircle className="size-6 text-red-400" />
            <p>Failed to load users.</p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => void usersQuery.refetch()}>
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No users match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ borderColor: roleTheme.border }}>
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="hidden px-5 py-3 md:table-cell">Organization</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Last Login</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const { label: statusLabel, className: statusCls, Icon: StatusIcon } = STATUS_CONFIG[user.status];
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="grid size-8 shrink-0 place-items-center rounded-lg text-sm font-semibold text-white"
                            style={{ backgroundColor: roleTheme.accent }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", ROLE_COLORS[user.role])}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3.5 text-gray-600 md:table-cell">
                        <span className="truncate">{user.organizationName}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", statusCls)}>
                          <StatusIcon className="size-3" />
                          {statusLabel}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3.5 text-gray-400 lg:table-cell text-xs">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ActionMenu
                          user={user}
                          isMohAdmin={isMohAdmin}
                          onStatusChange={(userId, status) =>
                            statusMutation.mutate({ userId, status })
                          }
                          isPending={pendingId === user.id}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
