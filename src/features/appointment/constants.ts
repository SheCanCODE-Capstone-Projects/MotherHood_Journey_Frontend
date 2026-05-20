import type { AppointmentStatus, AppointmentType } from "./types";

/**
 * API Endpoints for Appointments
 */
export const APPOINTMENT_ENDPOINTS = {
  BASE: "/api/v1/appointments",
  LIST: "/api/v1/appointments",
  DETAIL: (id: string) => `/api/v1/appointments/${id}`,
  CANCEL: (id: string) => `/api/v1/appointments/${id}/cancel`,
  DELETE: (id: string) => `/api/v1/appointments/${id}`,
} as const;

/**
 * Appointment Status Metadata
 */
export const APPOINTMENT_STATUS_CONFIG: Record<
  AppointmentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
    icon: string;
  }
> = {
  SCHEDULED: {
    label: "Scheduled",
    color: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    icon: "🗓️",
  },
  COMPLETED: {
    label: "Completed",
    color: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    icon: "✓",
  },
  NO_SHOW: {
    label: "No Show",
    color: "amber",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    icon: "⚠️",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "gray",
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    icon: "✕",
  },
} as const;

/**
 * Appointment Type Labels
 */
export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  PRENATAL_CHECKUP: "Prenatal Checkup",
  POSTNATAL_CHECKUP: "Postnatal Checkup",
  IMMUNIZATION: "Immunization",
  NUTRITIONAL_COUNSELING: "Nutritional Counseling",
  MENTAL_HEALTH: "Mental Health Consultation",
  LABORATORY_TEST: "Laboratory Test",
  ULTRASOUND: "Ultrasound",
  OTHER: "Other Service",
} as const;

/**
 * Appointment List Defaults
 */
export const APPOINTMENT_DEFAULTS = {
  PAGE_SIZE: 10,
  CACHE_TIME_MS: 5 * 60 * 1000, // 5 minutes
  STALE_TIME_MS: 2 * 60 * 1000, // 2 minutes
} as const;
