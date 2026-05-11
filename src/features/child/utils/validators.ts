/**
 * Vaccination Session Validation Utilities
 * Validators for vaccination session data integrity
 */

import type {
	ChildVaccinationSessionRecord,
	VaccinationSessionChild,
	VaccinationSessionData,
} from "../types";

/**
 * Validate lot number format
 * Lot numbers should be non-empty trimmed strings
 */
export function validateLotNumber(lotNumber: unknown): boolean {
	if (typeof lotNumber !== "string") {
		return false;
	}
	return lotNumber.trim().length > 0;
}

/**
 * Validate search term
 * Search term must be non-empty after trimming
 */
export function validateSearchTerm(searchTerm: unknown): boolean {
	if (typeof searchTerm !== "string") {
		return false;
	}
	return searchTerm.trim().length > 0;
}

/**
 * Validate child vaccination session data structure
 */
export function isValidVaccinationSessionChild(
	data: unknown
): data is VaccinationSessionChild {
	if (!data || typeof data !== "object") return false;

	const obj = data as Record<string, unknown>;

	return (
		typeof obj.id === "string" &&
		typeof obj.fullName === "string" &&
		typeof obj.healthId === "string" &&
		typeof obj.birthCertificateNo === "string" &&
		typeof obj.dateOfBirth === "string" &&
		typeof obj.ageInYears === "number" &&
		typeof obj.ageInMonths === "number" &&
		typeof obj.motherName === "string" &&
		typeof obj.facilityName === "string"
	);
}

/**
 * Validate vaccination record structure
 */
export function isValidVaccinationRecord(
	data: unknown
): data is ChildVaccinationSessionRecord {
	if (!data || typeof data !== "object") return false;

	const obj = data as Record<string, unknown>;
	const validStatuses = ["PENDING", "OVERDUE", "ADMINISTERED"];

	return (
		typeof obj.id === "string" &&
		typeof obj.vaccineName === "string" &&
		typeof obj.doseLabel === "string" &&
		validStatuses.includes(obj.status as string) &&
		typeof obj.dueDate === "string" &&
		(typeof obj.note === "string" || obj.note === undefined)
	);
}

/**
 * Validate complete vaccination session data
 */
export function isValidVaccinationSessionData(
	data: unknown
): data is VaccinationSessionData {
	if (!data || typeof data !== "object") return false;

	const obj = data as Record<string, unknown>;

	return (
		isValidVaccinationSessionChild(obj.child) &&
		Array.isArray(obj.dueVaccines) &&
		obj.dueVaccines.every((vaccine) => isValidVaccinationRecord(vaccine))
	);
}

/**
 * Check if a vaccination can be administered
 * Can only administer if status is PENDING or OVERDUE
 */
export function canAdministerVaccine(
	vaccine: ChildVaccinationSessionRecord
): boolean {
	return vaccine.status === "PENDING" || vaccine.status === "OVERDUE";
}

/**
 * Check if child has any due vaccines
 */
export function hasDueVaccines(session: VaccinationSessionData): boolean {
	return session.dueVaccines.length > 0;
}

/**
 * Get count of overdue vaccines
 */
export function getOverdueVaccineCount(
	session: VaccinationSessionData
): number {
	return session.dueVaccines.filter((v) => v.status === "OVERDUE").length;
}

/**
 * Get count of pending vaccines
 */
export function getPendingVaccineCount(
	session: VaccinationSessionData
): number {
	return session.dueVaccines.filter((v) => v.status === "PENDING").length;
}

/**
 * Calculate child age in months from date of birth
 */
export function calculateAgeInMonths(dateOfBirth: string): number {
	const dob = new Date(dateOfBirth);
	const today = new Date();

	let months =
		(today.getFullYear() - dob.getFullYear()) * 12 +
		(today.getMonth() - dob.getMonth());

	// Adjust if birthday hasn't occurred this month
	if (today.getDate() < dob.getDate()) {
		months--;
	}

	return Math.max(0, months);
}

/**
 * Calculate child age in years and months
 */
export function calculateAge(dateOfBirth: string): {
	years: number;
	months: number;
} {
	const totalMonths = calculateAgeInMonths(dateOfBirth);
	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	return { years, months };
}
