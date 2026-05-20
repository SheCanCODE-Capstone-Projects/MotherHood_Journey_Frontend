"use client";

import { AlertCircle, CheckCircle, Download, RefreshCcw, Upload, Zap, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

type Metric = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "success" | "warning" | "info";
};

const syncStatus: Metric[] = [
  { label: "Synced Districts", value: "30", icon: CheckCircle, tone: "success" },
  { label: "Last Sync", value: "2 min ago", icon: RefreshCcw },
  { label: "Pending Syncs", value: "2", icon: AlertCircle, tone: "warning" },
  { label: "Success Rate", value: "99.8%", icon: Zap, tone: "info" },
];

const districtSyncStatus = [
  { district: "Kigali", facilities: 24, lastSync: "2 min ago", status: "Synced", records: 2456 },
  { district: "Bugesera", facilities: 18, lastSync: "5 min ago", status: "Synced", records: 1892 },
  { district: "Nyarugenge", facilities: 16, lastSync: "8 min ago", status: "Synced", records: 1654 },
  { district: "Gasabo", facilities: 22, lastSync: "12 min ago", status: "Syncing", records: 1998 },
  { district: "Rwamagana", facilities: 14, lastSync: "Failed", status: "Error", records: 1234 },
];

const statusStyles: Record<string, string> = {
  Synced: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Syncing: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Error: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const toneColor = {
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  default: "#1F7280",
};

export default function SyncPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Government"
        title="National Sync"
        subtitle="Manage data synchronization across the national health system."
        action={
          <Button className="h-10 rounded-[8px] bg-[#064F56] px-4 text-white">
            <Upload className="size-4" />
            Sync all
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {syncStatus.map((status) => {
          const Icon = status.icon;
          const color = toneColor[status.tone ?? "default"];

          return (
            <article key={status.label} className="rounded-[8px] border border-[#D5E7E4] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">{status.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#153F42]">{status.value}</p>
                </div>
                <div className="grid size-11 place-items-center rounded-[8px] bg-[#EAF4F2]" style={{ color }}>
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
              <Button className="h-10 w-full rounded-[8px] bg-[#064F56] text-white">
                <Upload className="size-4" />
                Full Sync
              </Button>
              <Button variant="outline" className="h-10 w-full rounded-[8px] border-[#D5E7E4] text-[#153F42]">
                <Download className="size-4" />
                Export Data
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
