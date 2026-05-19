"use client";

import { useState, useEffect, useCallback } from "react";
import type { Report, ReportStatus, PushHmisResponse, ReportType } from "@/shared/types/report";

// Mock data for different report types
const mockReports: Record<string, Report> = {
  "rpt-vaccination-001": {
    id: "rpt-vaccination-001",
    reportType: "VACCINATION_COVERAGE",
    status: "NOT_PUSHED",
    title: "Vaccination Coverage Report - Q1 2024",
    description: "Comprehensive vaccination coverage analysis across all facilities",
    generatedAt: "2024-03-31T10:00:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-03-31T23:59:59Z",
    districtName: "Bugesera District",
    data: {
      byVaccineType: [
        { vaccineType: "BCG", coverage: 92, target: 95 },
        { vaccineType: "DPT-HepB-Hib", coverage: 88, target: 90 },
        { vaccineType: "Polio", coverage: 91, target: 95 },
        { vaccineType: "Pentavalent", coverage: 87, target: 90 },
        { vaccineType: "Measles", coverage: 85, target: 90 },
        { vaccineType: "TT", coverage: 78, target: 85 },
      ],
    },
  },
  "rpt-anc-002": {
    id: "rpt-anc-002",
    reportType: "ANC_ATTENDANCE",
    status: "QUEUED",
    title: "ANC Attendance Report - 2024",
    description: "Monthly antenatal care attendance trends",
    generatedAt: "2024-06-15T14:30:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-06-30T23:59:59Z",
    facilityName: "Nyamata District Hospital",
    data: {
      monthlyAttendance: [
        { month: "Jan", attendance: 342 },
        { month: "Feb", attendance: 378 },
        { month: "Mar", attendance: 395 },
        { month: "Apr", attendance: 412 },
        { month: "May", attendance: 438 },
        { month: "Jun", attendance: 456 },
      ],
    },
  },
  "rpt-birth-003": {
    id: "rpt-birth-003",
    reportType: "BIRTH_REGISTRATION",
    status: "PUSHED",
    title: "Birth Registration Report - Q2 2024",
    description: "Birth registrations by district",
    generatedAt: "2024-07-01T09:00:00Z",
    periodStart: "2024-04-01T00:00:00Z",
    periodEnd: "2024-06-30T23:59:59Z",
    districtName: "Bugesera District",
    data: {
      byDistrict: [
        { district: "Nyamata", registrations: 523 },
        { district: "Rweru", registrations: 312 },
        { district: "Gashora", registrations: 418 },
        { district: "Ntarama", registrations: 287 },
        { district: "Mareba", registrations: 195 },
        { district: "Rilima", registrations: 234 },
      ],
    },
  },
  "rpt-maternal-004": {
    id: "rpt-maternal-004",
    reportType: "MATERNAL_HEALTH",
    status: "FAILED",
    title: "Maternal Health Report - 2024",
    description: "Key maternal health indicators and outcomes",
    generatedAt: "2024-08-10T11:00:00Z",
    periodStart: "2024-01-01T00:00:00Z",
    periodEnd: "2024-07-31T23:59:59Z",
    districtName: "Bugesera District",
    data: {
      stats: {
        maternalMortalityProxy: 0.12,
        ancCoverage: 89.5,
        institutionalDeliveryRate: 91.2,
      },
    },
  },
};

/**
 * Custom hook for managing report data and operations
 */
export function useReports(reportId: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pushing, setPushing] = useState(false);

  // Fetch report data
  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockReport = mockReports[reportId];
      if (!mockReport) {
        throw new Error("Report not found");
      }
      
      setReport(mockReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Push report to HMIS
  const pushToHmis = useCallback(async (): Promise<PushHmisResponse> => {
    if (!report) {
      throw new Error("No report to push");
    }

    setPushing(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate random success/failure
      const success = Math.random() > 0.2;
      
      if (success) {
        // Update local state to reflect pushed status
        setReport((prev) => prev ? { ...prev, status: "PUSHED" as ReportStatus } : null);
        
        return {
          success: true,
          message: "Report successfully pushed to HMIS",
          pushedAt: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          message: "Failed to push report to HMIS. Please try again.",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "An error occurred while pushing",
      };
    } finally {
      setPushing(false);
    }
  }, [report]);

  // Initial fetch
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    report,
    loading,
    error,
    pushing,
    pushToHmis,
    refetch: fetchReport,
  };
}

/**
 * Hook to get all reports (for listing)
 */
export function useReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Return all mock reports as an array
        setReports(Object.values(mockReports));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
  };
}

/**
 * Get report type label
 */
export function getReportTypeLabel(type: ReportType): string {
  const labels: Record<ReportType, string> = {
    VACCINATION_COVERAGE: "Vaccination Coverage",
    ANC_ATTENDANCE: "ANC Attendance",
    BIRTH_REGISTRATION: "Birth Registration",
    MATERNAL_HEALTH: "Maternal Health",
  };
  return labels[type];
}

/**
 * Get status label
 */
export function getStatusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    NOT_PUSHED: "Not Pushed",
    QUEUED: "Queued",
    PUSHED: "Pushed",
    FAILED: "Failed",
  };
  return labels[status];
}