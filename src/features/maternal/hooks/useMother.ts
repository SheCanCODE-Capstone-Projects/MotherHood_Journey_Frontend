"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMothers, getMothers, getMotherById } from "../api/mothers.api";
import type { Mother, MotherPageResponse } from "../types";

/**
 * Query key factory for mother-related queries
 */
export const motherQueryKeys = {
  all: ["mothers"] as const,
  search: (searchTerm: string | undefined, page: number, pageSize: number) => [
    "mothers",
    "search",
    searchTerm,
    page,
    pageSize,
  ] as const,
  list: (page: number, pageSize: number) => [
    "mothers",
    "list",
    page,
    pageSize,
  ] as const,
  detail: (id: string) => ["mothers", "detail", id] as const,
  byHealthId: (healthId: string) => ["mothers", "healthId", healthId] as const,
};

/**
 * Hook to search mothers by health_id, name, or NID
 * Debounced 300ms via the search input component
 * Returns paginated results with loading/error states
 */
export function useMotherSearch(
  searchTerm: string | undefined,
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: motherQueryKeys.search(searchTerm, page, pageSize),
    queryFn: () => searchMothers(searchTerm, page, pageSize),
    enabled: true, // Always enabled, but search input should debounce before calling
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch mothers list with pagination
 */
export function useMothers(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: motherQueryKeys.list(page, pageSize),
    queryFn: () => getMothers(page, pageSize),
  });
}

/**
 * Hook to fetch a single mother by ID
 */
export function useMotherById(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: motherQueryKeys.detail(id),
    queryFn: () => getMotherById(id),
    enabled,
  });
}

/**
 * Hook to fetch a mother by health ID
 */
export function useMotherByHealthId(
  healthId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: motherQueryKeys.byHealthId(healthId),
    queryFn: () => getMotherById(healthId),
    enabled,
  });
}
