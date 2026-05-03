export type VaccinationStatus = "completed" | "due" | "overdue" | "upcoming";

export type VaccinationRecord = {
	id: string;
	name: string;
	doseLabel: string;
	status: VaccinationStatus;
	dueDate: string;
	administeredDate: string | null;
	note?: string;
};

export type VaccinationCardChild = {
	id: string;
	fullName: string;
	dateOfBirth: string;
	motherName: string;
	facilityName: string;
	householdPhone?: string;
};

export type VaccinationCardData = {
	child: VaccinationCardChild;
	lastUpdatedAt: string;
	vaccines: VaccinationRecord[];
};

export type VaccinationCardCache = {
	savedAt: string;
	source: "live" | "demo" | "cache";
	payload: VaccinationCardData;
};
