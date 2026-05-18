"use client";

import { useMutation } from "@tanstack/react-query";
import { registerMother } from "../api/mothers.api";
import type { MotherRegistrationRequest, MotherRegistrationResponse } from "../types";

/**
 * Custom hook for mother registration
 * Handles loading, error, and success states
 * Usage: const { mutate, isPending, data, error } = useMother();
 */
export function useMother() {
  const mutation = useMutation<
    MotherRegistrationResponse,
    Error,
    MotherRegistrationRequest
  >({
    mutationFn: registerMother,
  });

  return {
    // Trigger the registration
    mutate: mutation.mutate,
    // Loading state while request is in progress
    isPending: mutation.isPending,
    // Successful response data with health_id
    data: mutation.data,
    // Error if registration fails
    error: mutation.error,
    // Reset state if needed
    reset: mutation.reset,
    // Check if request was successful
    isSuccess: mutation.isSuccess,
    // Check if request failed
    isError: mutation.isError,
  };
}
