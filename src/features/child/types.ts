export type VaccinationStatus = "completed" | "due" | "overdue" | "upcoming";

export type VaccinationSessionStatus = "PENDING" | "ADMINISTERED" | "MISSED" | "OVERDUE";

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

export type ChildVaccinationSessionRecord = {
	id: string;
	vaccineName: string;
	doseLabel: string;
	status: VaccinationSessionStatus;
	dueDate: string;
	administeredDate?: string | null;
	note?: string;
};

export type ChildVaccinationSessionChild = {
	id: string;
	fullName: string;
	healthId: string;
	birthCertificateNo: string;
	dateOfBirth: string;
	ageInYears: number;
	ageInMonths: number;
	motherName: string;
	facilityName: string;
};

export type ChildVaccinationSessionResponse = {
	child: ChildVaccinationSessionChild;
	dueVaccines: ChildVaccinationSessionRecord[];
	searchMatchedBy: "healthId" | "birthCertificateNo";
};

export type AdministerVaccinationRequest = {
	lotNumber: string;
};
