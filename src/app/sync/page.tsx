"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Clock, Download, RefreshCcw, Upload, Zap, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { triggerFullSync, exportGovData } from "@/lib/api/government";

type Metric = {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
};

const syncStatus: Metric[] = [
  { label: "Synced Districts", value: "30", icon: CheckCircle, color: "#10B981" },
  { label: "Last Sync", value: "2 min ago", icon: Clock, color: "#1F7280" },
  { label: "Pending Syncs", value: "2", icon: AlertCircle, color: "#F59E0B" },
  { label: "Success Rate", value: "99.8%", icon: Zap, color: "#3B82F6" },
];

const districtSyncStatus = [
  { district: "Kigali", facilities: 24, lastSync: "2 min ago", status: "Synced", records: 2456 },
  { district: "Bugesera", facilities: 18, lastSync: "5 min ago", status: "Synced", records: 1892 },
  { district: "Nyarugenge", facilities: 16, lastSync: "8 min ago", status: "Synced", records: 1654 },
  { district: "Gasabo", facilities: 22, lastSync: "12 min ago", status: "Syncing", records: 1998 },
  { district: "Rwamagana", facilities: 14, lastSync: "Failed", status: "Error", records: 1234 },
];

const recentSync = [
  { district: "Kigali", timestamp: "Apr 12, 2024 - 2:34 PM", records: 156, status: "Success", duration: "4.2s" },
  { district: "Bugesera", timestamp: "Apr 12, 2024 - 2:29 PM", records: 89, status: "Success", duration: "2.1s" },
  { district: "Nyarugenge", timestamp: "Apr 12, 2024 - 2:24 PM", records: 134, status: "Success", duration: "3.8s" },
  { district: "Gasabo", timestamp: "Apr 12, 2024 - 2:18 PM", records: 98, status: "Success", duration: "2.9s" },
];

const statusStyles: Record<string, string> = {
  Synced: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Syncing: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Error: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  Success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export default function SyncPage() {
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const triggerMutation = useMutation({
    mutationFn: triggerFullSync,
    onMutate: () => {
      setSyncNotice(null);
    },
    onSuccess: (result) => {
      setSyncNotice(
        result.source === "demo"
          ? `Full sync queued in demo mode at ${new Date(result.startedAt).toLocaleTimeString()}.`
          : `Full sync started at ${new Date(result.startedAt).toLocaleTimeString()}.`,
      );
    },
    onError: () => {
      setSyncNotice("Unable to start full sync.");
    },
  });

  const exportMutation = useMutation({
    mutationFn: exportGovData,
  });

  const handleExport = async () => {
    const res = await exportMutation.mutateAsync(undefined);
    if (res?.content) {
      const blob = new Blob([res.content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = res.filename ?? "export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      return;
    }

    setSyncNotice("Export not available in demo mode.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Government"
        title="National Sync"
        subtitle="Manage data synchronization across the national health system."
        action={
          <Button
            className="h-10 rounded-[8px] bg-[#064F56] px-4 text-white"
            disabled={triggerMutation.isPending}
            onClick={() => triggerMutation.mutate(undefined)}
          >
            <Upload className="size-4" />
            {triggerMutation.isPending ? "Syncing..." : "Sync all"}
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {syncStatus.map((status) => {
          const Icon = status.icon;

          return (
            <article key={status.label} className="rounded-[8px] border border-[#D5E7E4] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">{status.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#153F42]">{status.value}</p>
                </div>
                <div
                  className="grid size-11 place-items-center rounded-[8px] bg-[#EAF4F2]"
                  style={{ color: status.color ?? "#1F7280" }}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_18rem]">
        <div className="rounded-[8px] border border-[#D5E7E4] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">Districts</p>
              <h2 className="mt-1 text-lg font-semibold text-[#153F42]">Synchronization Status</h2>
            </div>
            <RefreshCcw className="size-5 text-[#0B5554]" />
          </div>

          <div className="overflow-hidden rounded-[8px] border border-[#E4EFED]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F7FBFA] text-xs uppercase tracking-[0.14em] text-[#5B8784]">
                <tr>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Facilities</th>
                  <th className="px-4 py-3">Records</th>
                  <th className="px-4 py-3">Last Sync</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9F2F1]">
                {districtSyncStatus.map((item) => (
                  <tr key={item.district} className="hover:bg-[#F7FBFA]">
                    <td className="px-4 py-4 font-medium text-[#153F42]">{item.district}</td>
                    <td className="px-4 py-4 text-[#54797C]">{item.facilities}</td>
                    <td className="px-4 py-4 text-[#54797C]">{item.records.toLocaleString()}</td>
                    <td className="px-4 py-4 text-[#54797C]">{item.lastSync}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-[8px] px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[8px] bg-[#064F56] p-5 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">API activity</p>
            <p className="mt-3 text-3xl font-semibold">14,802</p>
            <p className="mt-2 text-sm text-white/70">records exchanged today</p>
          </div>
          <div className="rounded-[8px] border border-[#D5E7E4] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#153F42]">Sync Controls</h3>
            <div className="mt-4 space-y-2">
              <Button
                className="h-10 w-full rounded-[8px] bg-[#064F56] text-white"
                disabled={triggerMutation.isPending}
                onClick={() => triggerMutation.mutate(undefined)}
              >
                <Upload className="size-4" />
                {triggerMutation.isPending ? "Running..." : "Full Sync"}
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full rounded-[8px] border-[#D5E7E4] text-[#153F42]"
                disabled={exportMutation.isPending}
                onClick={() => void handleExport()}
              >
                <Download className="size-4" />
                Export Data
              </Button>
            </div>
            {syncNotice ? <p className="mt-3 text-sm font-medium text-[#315F62]">{syncNotice}</p> : null}
          </div>
        </aside>
      </section>

      <section className="rounded-[8px] border border-[#D5E7E4] bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">Audit trail</p>
          <h2 className="mt-1 text-lg font-semibold text-[#153F42]">Recent Syncs</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {recentSync.map((item) => (
            <article key={`${item.district}-${item.timestamp}`} className="rounded-[8px] border border-[#E4EFED] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#153F42]">{item.district}</h3>
                  <p className="mt-1 text-sm text-[#54797C]">{item.timestamp}</p>
                </div>
                <span className={`rounded-[8px] px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#54797C]">
                {item.records} records in {item.duration}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
