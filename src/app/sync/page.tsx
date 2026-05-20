"use client";

import { useState } from "react";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { CheckCircle, Clock, AlertCircle, Zap, Download, Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { triggerFullSync, exportGovData } from "@/lib/api/government";

export default function SyncPage() {
  const roleTheme = ROLE_THEMES.government;
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const syncStatus = [
    { label: "Synced Districts", value: "30", icon: CheckCircle, color: "#10B981" },
    { label: "Last Sync", value: "2 min ago", icon: Clock },
    { label: "Pending Syncs", value: "2", icon: AlertCircle, color: "#F59E0B" },
    { label: "Sync Success Rate", value: "99.8%", icon: Zap, color: "#3B82F6" },
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sync"
        subtitle="Manage data synchronization across the national health system."
      />

      {/* Sync Status Overview */}
      <section className="grid gap-4 md:grid-cols-4">
        {syncStatus.map((status) => {
          const Icon = status.icon;
          return (
            <div key={status.label} className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>
                    {status.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: status.color || roleTheme.accent }}>
                    {status.value}
                  </p>
                </div>
                <Icon className="size-6" style={{ color: status.color || roleTheme.accent }} />
              </div>
            </div>
          );
        })}
      </section>

      {/* District Sync Status */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: roleTheme.text }}>District Synchronization Status</h2>
          <button
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: roleTheme.accent, color: "white" }}
            onClick={() => void triggerMutation.mutate()}
            disabled={triggerMutation.isLoading}
          >
            {triggerMutation.isLoading ? "Syncing..." : "Sync All"}
          </button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-4 rounded-2xl border-2 p-4 font-semibold text-sm" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>
            <div>District</div>
            <div>Facilities</div>
            <div>Records</div>
            <div>Last Sync</div>
            <div>Status</div>
          </div>
          {districtSyncStatus.map((item, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-4 rounded-2xl border p-4 items-center text-sm" style={{ borderColor: roleTheme.border }}>
              <div className="font-medium" style={{ color: roleTheme.text }}>{item.district}</div>
              <div style={{ color: roleTheme.text }}>{item.facilities} facilities</div>
              <div style={{ color: roleTheme.text }}>{item.records}</div>
              <div style={{ color: roleTheme.text }}>{item.lastSync}</div>
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.status === "Synced" ? "bg-green-100 text-green-700" :
                  item.status === "Syncing" ? "bg-blue-100 text-blue-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Sync Activity */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Recent Sync Activity</h2>
        <div className="space-y-3">
          {recentSync.map((sync, idx) => (
            <div key={idx} className="flex items-start justify-between rounded-2xl border p-4" style={{ borderColor: roleTheme.border }}>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: roleTheme.text }}>{sync.district}</h3>
                <p className="text-sm" style={{ color: roleTheme.text }}>⏰ {sync.timestamp}</p>
                <p className="text-sm" style={{ color: roleTheme.text }}>📊 {sync.records} records | Completed in {sync.duration}</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✓ {sync.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Sync Controls */}
      <section className="rounded-2xl border-2 p-6" style={{ borderColor: roleTheme.border, backgroundColor: roleTheme.accentSoft }}>
        <h3 className="text-lg font-semibold" style={{ color: roleTheme.text }}>Sync Controls</h3>
        <p className="mt-2 text-sm" style={{ color: roleTheme.text }}>Manage system-wide synchronization settings and manual sync operations.</p>
          <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: roleTheme.accent, color: "white" }}
            onClick={() => void triggerMutation.mutate()}
            disabled={triggerMutation.isLoading}
          >
            <Upload className="size-4" /> {triggerMutation.isLoading ? "Running..." : "Full Sync"}
          </button>
          <button
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ borderColor: roleTheme.border, border: "2px solid", color: roleTheme.text }}
            onClick={async () => {
              const res = await exportMutation.mutateAsync();
              if (res && res.content) {
                const blob = new Blob([res.content], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = res.filename ?? "export.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } else {
                alert("Export not available in demo mode.");
              }
            }}
            disabled={exportMutation.isLoading}
          >
            <Download className="size-4" /> Export Data
          </button>
          <button
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ borderColor: roleTheme.border, border: "2px solid", color: roleTheme.text }}
            onClick={() => window.location.assign('/sync-log')}
          >
            View Logs
          </button>
        </div>
        {syncNotice ? (
          <p className="mt-3 text-sm font-medium" style={{ color: roleTheme.text }}>
            {syncNotice}
          </p>
        ) : null}
      </section>
    </div>
  );
}

// Hook up mutations after component to avoid hoisting errors
const triggerMutation = {
  isLoading: false,
  mutateAsync: async () => {
    return await triggerFullSync();
  },
};

const exportMutation = {
  isLoading: false,
  mutateAsync: async () => {
    return await exportGovData();
  },
};
