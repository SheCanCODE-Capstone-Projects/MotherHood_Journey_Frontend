"use client";

import { useEffect, useMemo, useState } from "react";
import { getSession } from "next-auth/react";
import { AlertCircle, RefreshCcw, RotateCcw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SyncStatusIndicator } from "@/components/status/SyncStatusIndicator";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { queryKeys } from "@/shared/config/query-keys";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import {
  getGovDeadLetterLogs,
  getGovSyncLogs,
  getGovSyncStatus,
  retryGovSyncLog,
  type GovSyncLog,
  type GovSyncTargetSystem,
} from "@/lib/api/government";

const ERROR_PREVIEW_LENGTH = 72;

function truncateUuid(id: string) {
  if (id.length <= 13) {
    return id;
  }

  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

function formatCreatedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function truncateError(message: string) {
  if (message.length <= ERROR_PREVIEW_LENGTH) {
    return message;
  }

  return `${message.slice(0, ERROR_PREVIEW_LENGTH).trim()}...`;
}

function getTargetSystemClassName(targetSystem: GovSyncTargetSystem) {
  switch (targetSystem) {
    case "NIDA":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "IREMBO":
      return "bg-cyan-50 text-cyan-700 ring-cyan-200";
    case "HMIS":
    default:
      return "bg-teal-50 text-teal-700 ring-teal-200";
  }
}

function sortLogs(logs: GovSyncLog[]) {
  return [...logs].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function updateRetriedLog(logs: GovSyncLog[] | undefined, id: string) {
  return logs?.map((log) =>
    log.id === id
      ? {
          ...log,
          status: "PENDING" as const,
          retryCount: log.retryCount + 1,
          lastErrorMessage: null,
        }
      : log,
  );
}

export default function GovernmentSyncLogPage() {
  const { roleTheme, currentUser } = useRole({ fallbackRole: "government" });
  const queryClient = useQueryClient();
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(() => new Set());
  const [sessionRole, setSessionRole] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getSession().then((session) => {
      if (mounted) {
        setSessionRole(session?.user?.role ?? null);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const syncLogsQuery = useQuery({
    queryKey: queryKeys.government.syncLogs,
    queryFn: getGovSyncLogs,
    refetchInterval: 30_000,
  });

  const deadLetterQuery = useQuery({
    queryKey: [...queryKeys.government.syncLogs, "dead-letter"],
    queryFn: getGovDeadLetterLogs,
    refetchInterval: 30_000,
  });

  const syncStatusQuery = useQuery({
    queryKey: [...queryKeys.government.sync, "status"],
    queryFn: getGovSyncStatus,
    refetchInterval: 30_000,
  });

  const retryMutation = useMutation({
    mutationFn: retryGovSyncLog,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.government.syncLogs });
      const previous = queryClient.getQueryData<GovSyncLog[]>(queryKeys.government.syncLogs);
      queryClient.setQueryData<GovSyncLog[]>(
        queryKeys.government.syncLogs,
        updateRetriedLog(previous, id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.government.syncLogs, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.government.syncLogs });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.government.sync, "status"] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.government.syncLogs, "dead-letter"] });
    },
  });

  const logs = useMemo(() => sortLogs(syncLogsQuery.data ?? []), [syncLogsQuery.data]);
  const deadLetterLogs = useMemo(() => sortLogs(deadLetterQuery.data ?? []), [deadLetterQuery.data]);
  const canRetryDeadLetters =
    sessionRole === "MOH_ADMIN" || String(currentUser?.role ?? "").toUpperCase() === "MOH_ADMIN";

  const statusCounts = useMemo(() => syncStatusQuery.data ?? {}, [syncStatusQuery.data]);
  const summary = useMemo(
    () => ({
      total: Object.values(statusCounts).reduce((accumulator, value) => accumulator + Number(value ?? 0), 0) || logs.length,
      pending: Number(statusCounts.PENDING ?? 0),
      inFlight: Number(statusCounts.IN_FLIGHT ?? 0),
      deadLetter: Number(statusCounts.DEAD_LETTER ?? 0) || deadLetterLogs.length,
    }),
    [deadLetterLogs.length, logs.length, statusCounts],
  );

  const toggleError = (id: string) => {
    setExpandedErrors((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Government"
        title="Sync Log Monitoring"
        subtitle="Monitor government integration attempts across NIDA, HMIS, and IREMBO."
        action={
          <Button
            className="h-10 rounded-full px-5"
            disabled={syncLogsQuery.isFetching}
            onClick={() => syncLogsQuery.refetch()}
          >
            <RefreshCcw className={cn("size-4", syncLogsQuery.isFetching && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: roleTheme.border }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Total entries</p>
          <p className="mt-2 text-3xl font-semibold" style={{ color: roleTheme.text }}>{summary.total}</p>
        </article>
        <article className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: roleTheme.border }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-blue-700">{summary.pending}</p>
        </article>
        <article className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: roleTheme.border }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">In flight</p>
          <p className="mt-2 text-3xl font-semibold text-amber-700">{summary.inFlight}</p>
        </article>
        <article className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: roleTheme.border }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">Dead letter</p>
          <p className="mt-2 text-3xl font-semibold text-red-700">{summary.deadLetter}</p>
        </article>
      </section>

      {syncStatusQuery.error || syncLogsQuery.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Unable to load one or more sync sources. Refresh to try again.
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm" style={{ borderColor: roleTheme.border }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: roleTheme.border }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: roleTheme.text }}>GovSyncLog entries</h2>
            <p className="mt-1 text-sm text-slate-500">Auto-refreshes every 30 seconds.</p>
          </div>
          {syncLogsQuery.error ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
              <AlertCircle className="size-4" />
              Unable to refresh
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ minWidth: 980 }}>
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4">Target</th>
                <th className="px-5 py-4">Sync type</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Retries</th>
                <th className="px-5 py-4">Last error</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => {
                const hasError = Boolean(log.lastErrorMessage);
                const isExpanded = expandedErrors.has(log.id);
                const retryingThisRow = retryMutation.isPending && retryMutation.variables === log.id;

                return (
                  <tr key={log.id} className={cn(log.status === "DEAD_LETTER" && "bg-red-50/40")}>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600" title={log.id}>
                      {truncateUuid(log.id)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">
                      {formatCreatedDate(log.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1", getTargetSystemClassName(log.targetSystem))}>
                        {log.targetSystem}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">{log.syncType}</td>
                    <td className="px-5 py-4">
                      <SyncStatusIndicator status={log.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-700">{log.retryCount}</td>
                    <td className="max-w-[320px] px-5 py-4 text-slate-600">
                      {hasError ? (
                        <button
                          className="text-left text-sm leading-5 hover:text-slate-900"
                          onClick={() => toggleError(log.id)}
                          title={log.lastErrorMessage ?? undefined}
                          type="button"
                        >
                          {isExpanded ? log.lastErrorMessage : truncateError(log.lastErrorMessage ?? "")}
                          {log.lastErrorMessage && log.lastErrorMessage.length > ERROR_PREVIEW_LENGTH ? (
                            <span className="ml-1 font-semibold text-[#1F7280]">
                              {isExpanded ? "Show less" : "Expand"}
                            </span>
                          ) : null}
                        </button>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {canRetryDeadLetters && log.status === "DEAD_LETTER" ? (
                        <Button
                          className="h-8 rounded-full px-3"
                          disabled={retryingThisRow}
                          onClick={() => retryMutation.mutate(log.id)}
                          size="sm"
                        >
                          <RotateCcw className={cn("size-3.5", retryingThisRow && "animate-spin")} />
                          Retry
                        </Button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {syncLogsQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-slate-500">
            <RefreshCcw className="size-4 animate-spin" />
            Loading sync logs
          </div>
        ) : null}

        {!syncLogsQuery.isLoading && logs.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">No sync log entries found.</div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm" style={{ borderColor: roleTheme.border }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: roleTheme.border }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: roleTheme.text }}>Dead-letter queue</h2>
            <p className="mt-1 text-sm text-slate-500">Entries that exhausted retries and need manual intervention.</p>
          </div>
          {deadLetterQuery.error ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
              <AlertCircle className="size-4" />
              Unable to load queue
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ minWidth: 980 }}>
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4">Target</th>
                <th className="px-5 py-4">Sync type</th>
                <th className="px-5 py-4">Retries</th>
                <th className="px-5 py-4">Last error</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deadLetterLogs.map((log) => {
                const hasError = Boolean(log.lastErrorMessage);
                const isExpanded = expandedErrors.has(log.id);
                const retryingThisRow = retryMutation.isPending && retryMutation.variables === log.id;

                return (
                  <tr key={log.id} className="bg-red-50/40">
                    <td className="px-5 py-4 font-mono text-xs text-slate-600" title={log.id}>
                      {truncateUuid(log.id)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">
                      {formatCreatedDate(log.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1", getTargetSystemClassName(log.targetSystem))}>
                        {log.targetSystem}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">{log.syncType}</td>
                    <td className="px-5 py-4 text-slate-700">{log.retryCount}</td>
                    <td className="max-w-[320px] px-5 py-4 text-slate-600">
                      {hasError ? (
                        <button
                          className="text-left text-sm leading-5 hover:text-slate-900"
                          onClick={() => toggleError(log.id)}
                          title={log.lastErrorMessage ?? undefined}
                          type="button"
                        >
                          {isExpanded ? log.lastErrorMessage : truncateError(log.lastErrorMessage ?? "")}
                          {log.lastErrorMessage && log.lastErrorMessage.length > ERROR_PREVIEW_LENGTH ? (
                            <span className="ml-1 font-semibold text-[#1F7280]">
                              {isExpanded ? "Show less" : "Expand"}
                            </span>
                          ) : null}
                        </button>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {canRetryDeadLetters ? (
                        <Button
                          className="h-8 rounded-full px-3"
                          disabled={retryingThisRow}
                          onClick={() => retryMutation.mutate(log.id)}
                          size="sm"
                        >
                          <RotateCcw className={cn("size-3.5", retryingThisRow && "animate-spin")} />
                          Retry
                        </Button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {deadLetterQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-slate-500">
            <RefreshCcw className="size-4 animate-spin" />
            Loading dead-letter queue
          </div>
        ) : null}

        {!deadLetterQuery.isLoading && deadLetterLogs.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">Dead-letter queue is empty.</div>
        ) : null}
      </section>
    </div>
  );
}
