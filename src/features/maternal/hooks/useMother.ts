"use client";

<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import { searchMothers, getMothers, getMotherById } from "../api/mothers.api";
=======
import { useMutation, useQuery } from "@tanstack/react-query";
import { registerMother, searchMothers, getMothers } from "../api/mothers.api";
import type { MotherRegistrationRequest, MotherRegistrationResponse, MotherPageResponse } from "../types";
>>>>>>> main

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

/**
 * Custom hook for searching mothers
 * Usage: const { data, isLoading, error } = useMotherSearch("searchTerm");
 */
export function useMotherSearch(
  searchTerm?: string,
  page: number = 1,
  size: number = 10
) {
  return useQuery<MotherPageResponse, Error>({
    queryKey: ["mothers", "search", searchTerm, page, size],
    queryFn: () => searchMothers(searchTerm, page, size),
    enabled: !!searchTerm,
  });
}

/**
 * Custom hook for listing all mothers
 * Usage: const { data, isLoading, error } = useMothers();
 */
export function useMothers(page: number = 1, size: number = 10) {
  return useQuery<MotherPageResponse, Error>({
    queryKey: ["mothers", "list", page, size],
    queryFn: () => getMothers(page, size),
  });
}
