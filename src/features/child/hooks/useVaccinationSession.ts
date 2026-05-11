"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	searchChildVaccinationSession,
	administerVaccination,
} from "@/lib/api/children";
import { queryKeys } from "@/shared/config/query-keys";
import type { VaccinationSessionData } from "@/features/child/types";

/**
 * Hook to search for a child by health ID or birth certificate
 * Returns vaccination session data with due vaccines
 */
export function useVaccinationSessionSearch(searchTerm: string) {
	return useQuery({
		queryKey: queryKeys.child.vaccinationSession(searchTerm),
		queryFn: () => searchChildVaccinationSession(searchTerm),
		enabled: searchTerm.length > 0,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
		retry: 1,
		refetchOnWindowFocus: false,
	});
}

/**
 * Mutation to administer a vaccination
 * Invalidates the vaccination query cache on success
 */
export function useAdministerVaccination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			vaccinationId,
			lotNumber,
		}: {
			vaccinationId: string;
			lotNumber: string;
		}) => administerVaccination(vaccinationId, lotNumber),
		onSuccess: () => {
			// Invalidate all child vaccination queries to force refresh
			queryClient.invalidateQueries({
				queryKey: queryKeys.child.vaccinations,
			});
		},
		retry: 1,
	});
}
