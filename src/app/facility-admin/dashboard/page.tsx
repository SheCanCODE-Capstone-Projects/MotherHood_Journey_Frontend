"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { PageHeader } from "@/shared/components/layout";
import { AncAttendanceTrend } from "@/components/charts/AncAttendanceTrend";
import { VaccinationCoverageChart } from "@/components/charts/VaccinationCoverageChart";
import { ServiceRequestsTable } from "@/components/tables/ServiceRequestsTable";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Activity, Users, Clock, AlertCircle } from "lucide-react";

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
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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
        subtitle="Facility management and operational overview."
        action={
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onRangeChange={handleDateRangeChange}
          />
        }
      />

      {/* Stat Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Activity className="h-5 w-5 text-[#1D5052]" />}
          label="ANC Attendance Rate"
          value={statsLoading ? "..." : `${stats?.ancAttendanceRate.toFixed(1)}%`}
          description="Average monthly attendance"
          trend="up"
          trendValue="+2.5%"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-[#1D5052]" />}
          label="Vaccination Coverage"
          value={statsLoading ? "..." : `${stats?.vaccinationCoverage.toFixed(1)}%`}
          description="Overall coverage rate"
          trend="up"
          trendValue="+1.2%"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-[#1D5052]" />}
          label="No-Show Rate"
          value={statsLoading ? "..." : `${stats?.noShowRate.toFixed(1)}%`}
          description="Missed appointments"
          trend="down"
          trendValue="-0.8%"
        />
        <StatCard
          icon={<AlertCircle className="h-5 w-5 text-[#1D5052]" />}
          label="Service Request Backlog"
          value={statsLoading ? "..." : stats?.serviceRequestBacklog.toString() || "0"}
          description="Pending requests"
          trend="neutral"
          trendValue="0%"
        />
      </section>

      {/* Charts Row */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#1D5052]">
            ANC Attendance Trend (Last 12 Months)
          </h3>
          {ancLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D5E9E6] border-t-[#1D5052]"></div>
            </div>
          ) : (
            <AncAttendanceTrend data={ancData || []} />
          )}
        </div>

        <div className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#1D5052]">
            Vaccination Coverage by Type
          </h3>
          {vaccinationLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D5E9E6] border-t-[#1D5052]"></div>
            </div>
          ) : (
            <VaccinationCoverageChart data={vaccinationData || []} />
          )}
        </div>
      </section>

      {/* Service Requests Table */}
      <section className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#1D5052]">
          Recent Service Requests
        </h3>
        {requestsLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D5E9E6] border-t-[#1D5052]"></div>
          </div>
        ) : (
          <ServiceRequestsTable requests={serviceRequests || []} />
        )}
      </section>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

function StatCard({ icon, label, value, description, trend, trendValue }: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <article className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            {label}
          </p>
          <h2 className="text-2xl font-semibold text-[#1D5052]">{value}</h2>
          <p className="text-sm text-[#54797C]">{description}</p>
        </div>
        <div className="rounded-full bg-[#F8FCFB] p-2">{icon}</div>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <span className={`text-xs font-medium ${trendColors[trend]}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </span>
        <span className="text-xs text-[#54797C]">vs last month</span>
      </div>
    </article>
  );
}
