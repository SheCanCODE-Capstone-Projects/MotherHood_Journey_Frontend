import { apiClient } from "@/lib/api/client";

import type {
	AdministerVaccinationRequest,
	ChildVaccinationSessionResponse,
	VaccinationCardData,
} from "@/features/child/types";

export async function searchChildVaccinationSession(
	searchTerm: string,
): Promise<ChildVaccinationSessionResponse> {
	const params = new URLSearchParams();
	params.set("search_term", searchTerm.trim());

	return apiClient.get<ChildVaccinationSessionResponse>(
		`/api/v1/children/search?${params.toString()}`,
	);
}

export async function getChildVaccinationSession(
	childId: string,
): Promise<ChildVaccinationSessionResponse> {
	return apiClient.get<ChildVaccinationSessionResponse>(
		`/api/v1/children/${encodeURIComponent(childId)}/vaccinations`,
	);
}

export async function administerVaccination(
	vaccinationId: string,
	body: AdministerVaccinationRequest,
): Promise<{ success: boolean; message: string }> {
	return apiClient.put<{ success: boolean; message: string }>(
		`/api/v1/vaccinations/${encodeURIComponent(vaccinationId)}/administer`,
		body,
	);
}

export async function getChildVaccinationCard(
	childId: string,
): Promise<VaccinationCardData> {
	return apiClient.get<VaccinationCardData>(
		`/api/v1/children/${encodeURIComponent(childId)}/vaccinations`,
	);
}

export async function getChildVaccinationRecords(
	childId: string,
	status?: "pending" | "administered" | "overdue",
): Promise<VaccinationCardData> {
	const params = new URLSearchParams();
	if (status) {
		params.set("status", status);
	}

	return apiClient.get<VaccinationCardData>(
		`/api/v1/children/${encodeURIComponent(
			childId,
		)}/vaccinations/records?${params.toString()}`,
	);
}
