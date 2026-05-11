"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	administerVaccination,
	searchChildVaccinationSession,
} from "@/lib/api/children";
import { queryKeys } from "@/shared/config/query-keys";
import type {
	AdministerVaccinationRequest,
	ChildVaccinationSessionResponse,
} from "@/features/child/types";

export function useVaccinationSessionSearch(searchTerm: string) {
	return useQuery<ChildVaccinationSessionResponse>({
		queryKey: queryKeys.child.vaccinationSession(searchTerm),
		queryFn: () => searchChildVaccinationSession(searchTerm),
		enabled: searchTerm.trim().length > 0,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		retry: 1,
		refetchOnWindowFocus: false,
	});
}

export function useAdministerVaccination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			vaccinationId,
			lotNumber,
		}: {
			vaccinationId: string;
			lotNumber: string;
		}) =>
			administerVaccination(vaccinationId, {
				lotNumber,
			} satisfies AdministerVaccinationRequest),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: queryKeys.child.vaccinations,
			});
		},
		retry: 1,
	});
}
