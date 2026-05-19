"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  administerVaccination,
  searchChildVaccinationSession,
} from "@/lib/api/children";

export const vaccinationSessionQueryKeys = {
  all: ["vaccination-session"] as const,
  search: (searchTerm: string) => [
    "vaccination-session",
    "search",
    searchTerm,
  ] as const,
};

export function useVaccinationSessionSearch(searchTerm: string) {
  return useQuery({
    queryKey: vaccinationSessionQueryKeys.search(searchTerm),
    queryFn: () => searchChildVaccinationSession(searchTerm),
    enabled: searchTerm.trim().length > 0,
    retry: false,
  });
}

export function useAdministerVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vaccinationId, lotNumber }: { vaccinationId: string; lotNumber: string }) =>
      administerVaccination(vaccinationId, { lotNumber }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vaccinationSessionQueryKeys.all });
    },
  });
}
