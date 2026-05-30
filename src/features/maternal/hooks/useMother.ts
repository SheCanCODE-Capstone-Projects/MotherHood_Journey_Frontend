"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { registerMother, searchMothers, getMothers } from "../api/mothers.api";
import type { MotherRegistrationRequest, MotherRegistrationResponse, MotherPageResponse } from "../types";

export function useMother() {
  const mutation = useMutation<
    MotherRegistrationResponse,
    Error,
    MotherRegistrationRequest
  >({
    mutationFn: registerMother,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}

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

export function useMothers(page: number = 1, size: number = 10) {
  return useQuery<MotherPageResponse, Error>({
    queryKey: ["mothers", "list", page, size],
    queryFn: () => getMothers(page, size),
  });
}
