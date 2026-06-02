"use client";

import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { PageHeader } from "@/shared/components/layout";
import { AncAttendanceTrend } from "@/components/charts/AncAttendanceTrend";
import { VaccinationCoverageChart } from "@/components/charts/VaccinationCoverageChart";
import { ServiceRequestsTable } from "@/components/tables/ServiceRequestsTable";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Activity, AlertCircle, CalendarClock, Clock, TrendingDown, TrendingUp, Users } from "lucide-react";

// Types
interface FacilityStats {
  ancAttendanceRate: number;
  vaccinationCoverage: number;
  noShowRate: number;
  serviceRequestBacklog: number;
}

interface AncAttendanceData {
  month: string;
  attendance: number;
}

interface VaccinationData {
  vaccineType: string;
  coverage: number;
}

interface ServiceRequest {
  id: string;
  patientName: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}

// Mock data generator
const generateMockStats = (facilityId: string): FacilityStats => {
  // Simulate API response with consistent but varied data
  const seed = facilityId.charCodeAt(facilityId.length - 1);
  return {
    ancAttendanceRate: 75 + (seed % 20),
    vaccinationCoverage: 80 + (seed % 15),
    noShowRate: 5 + (seed % 10),
    serviceRequestBacklog: 10 + (seed % 15),
  };
};

const generateMockAncData = (months: number = 12): AncAttendanceData[] => {
  const data: AncAttendanceData[] = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const monthName = format(date, "MMM yyyy");
    const seed = i * 7;
    data.push({
      month: monthName,
      attendance: 60 + (seed % 35) + Math.random() * 10,
    });
  }
  
  return data;
};

const generateMockVaccinationData = (): VaccinationData[] => {
  return [
    { vaccineType: "BCG", coverage: 92 },
    { vaccineType: "DPT-HepB-Hib", coverage: 88 },
    { vaccineType: "Polio", coverage: 90 },
    { vaccineType: "Pneumococcal", coverage: 85 },
    { vaccineType: "Rotavirus", coverage: 82 },
    { vaccineType: "Measles", coverage: 87 },
  ];
};

const generateMockServiceRequests = (): ServiceRequest[] => {
  return [
    {
      id: "SR-001",
      patientName: "Grace Mukamana",
      type: "ANC Follow-up",
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "SR-002",
      patientName: "Marie Uwase",
      type: "Vaccination",
      status: "in_progress",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "SR-003",
      patientName: "Jeanne d'Arc Umutoni",
      type: "Postnatal Check",
      status: "completed",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "SR-004",
      patientName: "Emilie Nyiraneza",
      type: "Emergency Consultation",
      status: "pending",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "SR-005",
      patientName: "Claire Umulisa",
      type: "Laboratory Tests",
      status: "cancelled",
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

// API functions (attempt real API, fall back to mock)
const fetchFacilityStats = async (facilityId: string): Promise<FacilityStats> => {
  try {
    const res = await fetch(`/api/v1/facilities/${facilityId}/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    // Expecting { ancAttendanceRate, vaccinationCoverage, noShowRate, serviceRequestBacklog }
    if (
      typeof body.ancAttendanceRate === "number" &&
      typeof body.vaccinationCoverage === "number" &&
      typeof body.noShowRate === "number" &&
      typeof body.serviceRequestBacklog === "number"
    ) {
      return body as FacilityStats;
    }
    // If shape is unexpected, fall through to mock
  } catch (err) {
    // network or parse error - fall back to mock
    // console.warn should remain during development
    console.warn("fetchFacilityStats failed, using mock data:", err);
  }

  // fallback
  await new Promise((resolve) => setTimeout(resolve, 200));
  return generateMockStats(facilityId);
};

const fetchAncAttendanceData = async (
  facilityId: string,
  startDate: Date,
  endDate: Date
): Promise<AncAttendanceData[]> => {
  try {
    const url = `/api/v1/facilities/${facilityId}/anc-attendance?start=${encodeURIComponent(
      startDate.toISOString()
    )}&end=${encodeURIComponent(endDate.toISOString())}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (Array.isArray(body)) return body as AncAttendanceData[];
  } catch (err) {
    console.warn("fetchAncAttendanceData failed, using mock:", err);
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
  return generateMockAncData(12);
};

const fetchVaccinationData = async (
  facilityId: string,
  startDate: Date,
  endDate: Date
): Promise<VaccinationData[]> => {
  try {
    const url = `/api/v1/facilities/${facilityId}/vaccination-coverage?start=${encodeURIComponent(
      startDate.toISOString()
    )}&end=${encodeURIComponent(endDate.toISOString())}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (Array.isArray(body)) return body as VaccinationData[];
  } catch (err) {
    console.warn("fetchVaccinationData failed, using mock:", err);
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
  return generateMockVaccinationData();
};

const fetchServiceRequests = async (facilityId: string): Promise<ServiceRequest[]> => {
  try {
    const url = `/api/v1/facilities/${facilityId}/service-requests?limit=5`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (Array.isArray(body)) return body as ServiceRequest[];
  } catch (err) {
    console.warn("fetchServiceRequests failed, using mock:", err);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return generateMockServiceRequests();
};

export default function FacilityAdminDashboard() {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(subMonths(new Date(), 11)),
    end: endOfMonth(new Date()),
  });
  
  // Assume facility ID is 1 for demo purposes
  const facilityId = "1";

  // Fetch facility stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["facilityStats", facilityId],
    queryFn: () => fetchFacilityStats(facilityId),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch ANC attendance data
  const { data: ancData, isLoading: ancLoading } = useQuery({
    queryKey: ["ancAttendance", facilityId, dateRange],
    queryFn: () => fetchAncAttendanceData(facilityId, dateRange.start, dateRange.end),
    refetchInterval: 5 * 60 * 1000,
  });

  // Fetch vaccination data
  const { data: vaccinationData, isLoading: vaccinationLoading } = useQuery({
    queryKey: ["vaccinationCoverage", facilityId, dateRange],
    queryFn: () => fetchVaccinationData(facilityId, dateRange.start, dateRange.end),
    refetchInterval: 5 * 60 * 1000,
  });

  // Fetch service requests
  const { data: serviceRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["serviceRequests", facilityId],
    queryFn: () => fetchServiceRequests(facilityId),
    refetchInterval: 5 * 60 * 1000,
  });

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Facility management and operational overview for attendance, coverage, and request flow."
        action={
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onRangeChange={handleDateRangeChange}
          />
        }
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Activity className="size-5" />}
          label="ANC Attendance Rate"
          value={statsLoading ? "..." : `${stats?.ancAttendanceRate.toFixed(1)}%`}
          description="Average monthly attendance"
          trend="up"
          trendValue="+2.5%"
        />
        <StatCard
          icon={<Users className="size-5" />}
          label="Vaccination Coverage"
          value={statsLoading ? "..." : `${stats?.vaccinationCoverage.toFixed(1)}%`}
          description="Overall coverage rate"
          trend="up"
          trendValue="+1.2%"
        />
        <StatCard
          icon={<Clock className="size-5" />}
          label="No-Show Rate"
          value={statsLoading ? "..." : `${stats?.noShowRate.toFixed(1)}%`}
          description="Missed appointments"
          trend="down"
          trendValue="-0.8%"
        />
        <StatCard
          icon={<AlertCircle className="size-5" />}
          label="Service Request Backlog"
          value={statsLoading ? "..." : stats?.serviceRequestBacklog.toString() || "0"}
          description="Pending requests"
          trend="neutral"
          trendValue="0%"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardPanel
          title="ANC Attendance Trend"
          subtitle="Last 12 months"
          icon={<TrendingUp className="size-5" />}
        >
          {ancLoading ? (
            <LoadingState />
          ) : (
            <AncAttendanceTrend data={ancData || []} />
          )}
        </DashboardPanel>

        <DashboardPanel
          title="Vaccination Coverage"
          subtitle="By vaccine type"
          icon={<CalendarClock className="size-5" />}
        >
          {vaccinationLoading ? (
            <LoadingState />
          ) : (
            <VaccinationCoverageChart data={vaccinationData || []} />
          )}
        </DashboardPanel>
      </section>

      <DashboardPanel
        title="Recent Service Requests"
        subtitle="Latest facility support requests"
        icon={<AlertCircle className="size-5" />}
      >
        {requestsLoading ? (
          <LoadingState compact />
        ) : (
          <ServiceRequestsTable requests={serviceRequests || []} />
        )}
      </DashboardPanel>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

function StatCard({ icon, label, value, description, trend, trendValue }: StatCardProps) {
  const trendColors = {
    up: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    down: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    neutral: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
  };
  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Activity,
  };
  const Icon = TrendIcon[trend];

  return (
    <article className="rounded-[8px] border border-[#D5E7E4] bg-white/[0.94] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-30px_rgba(22,63,66,0.75)]">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">
            {label}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#163F42]">{value}</h2>
          <p className="text-sm text-[#54797C]">{description}</p>
        </div>
        <div className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-[#E1F2EF] text-[#226D68]">{icon}</div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-xs font-semibold ${trendColors[trend]}`}>
          <Icon className="size-3.5" />
          {trendValue}
        </span>
        <span className="text-xs text-[#54797C]">vs last month</span>
      </div>
    </article>
  );
}

function DashboardPanel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-[#D5E7E4] bg-white/[0.94] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5B8784]">{subtitle}</p>
          <h3 className="mt-1 text-lg font-semibold text-[#163F42]">{title}</h3>
        </div>
        <div className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-[#E1F2EF] text-[#226D68]">
          {icon}
        </div>
      </div>
      {children}
    </section>
  );
}

function LoadingState({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${compact ? "h-32" : "h-64"}`}>
      <div className="size-8 animate-spin rounded-full border-4 border-[#D5E9E6] border-t-[#226D68]" />
    </div>
  );
}
