/**
 * Children API endpoints
 * Handles all child data operations including vaccination sessions
 */

import { apiClient } from "@/lib/api/client";
import type {
	VaccinationSessionData,
	VaccinationCardData,
} from "@/features/child/types";

/**
 * Search for a child by health ID or birth certificate number
 * Returns vaccination session data with due vaccines for today
 * Endpoint: GET /api/v1/children/vaccinations/session?search_term={searchTerm}
 */
export async function searchChildVaccinationSession(
	searchTerm: string
): Promise<VaccinationSessionData> {
	const params = new URLSearchParams();
	params.append("search_term", searchTerm.trim());

	const response = await apiClient.get<VaccinationSessionData>(
		`/api/v1/children/vaccinations/session?${params.toString()}`
	);

	return response;
}

/**
 * Get vaccination card for a specific child
 * Endpoint: GET /api/v1/children/{childId}/vaccinations
 */
export async function getChildVaccinationCard(
	childId: string
): Promise<VaccinationCardData> {
	const response = await apiClient.get<VaccinationCardData>(
		`/api/v1/children/${encodeURIComponent(childId)}/vaccinations`
	);

	return response;
}

/**
 * Mark a vaccination as administered
 * Endpoint: PUT /api/v1/vaccinations/{id}/administer
 * Body: { lot_number: string }
 */
export async function administerVaccination(
	vaccinationId: string,
	lotNumber: string
): Promise<void> {
	await apiClient.put<void>(
		`/api/v1/vaccinations/${encodeURIComponent(vaccinationId)}/administer`,
		{
			lot_number: lotNumber,
		}
	);
}

/**
 * Get vaccination records for a child with filtering
 * Endpoint: GET /api/v1/children/{childId}/vaccinations/records
 */
export async function getChildVaccinationRecords(
	childId: string,
	status?: "pending" | "administered" | "overdue"
): Promise<VaccinationCardData> {
	const params = new URLSearchParams();
	if (status) {
		params.append("status", status);
	}

	const response = await apiClient.get<VaccinationCardData>(
		`/api/v1/children/${encodeURIComponent(
			childId
		)}/vaccinations/records?${params.toString()}`
	);

	return response;
}
