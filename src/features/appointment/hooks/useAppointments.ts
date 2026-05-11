"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelAppointment,
  getAppointments,
  getAppointmentDetail,
  getPastAppointments,
  getUpcomingAppointments,
} from "@/lib/api/appointments";
import type {
  Appointment,
  AppointmentDetail,
  AppointmentListResponse,
  CancelAppointmentRequest,
  CancelAppointmentResponse,
  CategorizedAppointments,
} from "../types";
import { APPOINTMENT_DEFAULTS } from "../constants";
import {
  cancelStoredDemoAppointment,
  getStoredDemoAppointments,
  setStoredDemoAppointments,
} from "../mock";
import { categorizeAppointments } from "../utils";
import { queryKeys } from "@/shared/config/query-keys";

/**
 * Hook to fetch all appointments with pagination
 */
export function useAppointments(page: number = 1, pageSize: number = APPOINTMENT_DEFAULTS.PAGE_SIZE) {
  return useQuery({
    queryKey: [...queryKeys.appointment.appointments, page, pageSize],
    queryFn: () => getAppointments(page, pageSize),
    staleTime: APPOINTMENT_DEFAULTS.STALE_TIME_MS,
    gcTime: APPOINTMENT_DEFAULTS.CACHE_TIME_MS,
  });
}

/**
 * Hook to fetch a specific appointment by ID
 */
export function useAppointmentDetail(appointmentId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.appointment.appointments, appointmentId],
    queryFn: () => {
      if (!appointmentId) {
        throw new Error("Appointment ID is required");
      }
      return getAppointmentDetail(appointmentId);
    },
    enabled: !!appointmentId,
    staleTime: APPOINTMENT_DEFAULTS.STALE_TIME_MS,
    gcTime: APPOINTMENT_DEFAULTS.CACHE_TIME_MS,
  });
}

/**
 * Hook to fetch upcoming (future) appointments
 */
export function useUpcomingAppointments(pageSize: number = APPOINTMENT_DEFAULTS.PAGE_SIZE) {
  return useQuery({
    queryKey: [...queryKeys.appointment.appointments, "upcoming"],
    queryFn: () => getUpcomingAppointments(pageSize),
    staleTime: APPOINTMENT_DEFAULTS.STALE_TIME_MS,
    gcTime: APPOINTMENT_DEFAULTS.CACHE_TIME_MS,
  });
}

/**
 * Hook to fetch past appointments
 */
export function usePastAppointments(pageSize: number = APPOINTMENT_DEFAULTS.PAGE_SIZE) {
  return useQuery({
    queryKey: [...queryKeys.appointment.appointments, "past"],
    queryFn: () => getPastAppointments(pageSize),
    staleTime: APPOINTMENT_DEFAULTS.STALE_TIME_MS,
    gcTime: APPOINTMENT_DEFAULTS.CACHE_TIME_MS,
  });
}

/**
 * Hook to fetch and categorize appointments into future and past
 */
export function useCategorizedAppointments() {
  return useQuery({
    queryKey: [...queryKeys.appointment.appointments, "categorized"],
    queryFn: async (): Promise<CategorizedAppointments> => {
      const response = await getAppointments(1, 100);
      return categorizeAppointments(response.content);
    },
    staleTime: APPOINTMENT_DEFAULTS.STALE_TIME_MS,
    gcTime: APPOINTMENT_DEFAULTS.CACHE_TIME_MS,
  });
}

/**
 * Hook to cancel an appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      request,
    }: {
      appointmentId: string;
      request?: CancelAppointmentRequest;
    }) => cancelAppointment(appointmentId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointment.appointments,
      });
    },
    onError: async (_error, variables) => {
      const updatedAppointments = cancelStoredDemoAppointment(variables.appointmentId);
      setStoredDemoAppointments(updatedAppointments);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.appointment.appointments,
      });
    },
  });
}

/**
 * Hook to fetch all appointments and automatically categorize them
 * This hook combines appointment fetching with categorization logic
 */
export function useAllAppointments() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.appointment.appointments,
    queryFn: async () => {
      try {
        return await getAppointments(1, 100);
      } catch {
        const demoAppointments = getStoredDemoAppointments();

        return {
          content: demoAppointments,
          totalPages: 1,
          totalElements: demoAppointments.length,
          pageNumber: 1,
          pageSize: demoAppointments.length,
        };
      }
    },
    staleTime: APPOINTMENT_DEFAULTS.STALE_TIME_MS,
    gcTime: APPOINTMENT_DEFAULTS.CACHE_TIME_MS,
  });

  const categorized = data ? categorizeAppointments(data.content) : { future: [], past: [] };

  return {
    allAppointments: data?.content || [],
    futureAppointments: categorized.future,
    pastAppointments: categorized.past,
    isLoading,
    error,
    refetch,
  };
}
