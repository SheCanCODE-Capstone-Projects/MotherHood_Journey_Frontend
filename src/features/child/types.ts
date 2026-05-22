export interface ChildDTO {
  id: string;
  mother_id: string;
  first_name: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
  birth_weight: number;
  delivery_type: "NORMAL" | "CAESAREAN" | "ASSISTED";
  birth_certificate_number?: string;
  created_at: string;
}

export interface VaccinationScheduleDTO {
  id: string;
  vaccine_name: string;
  due_date: string;
  status: "pending" | "administered" | "missed";
}

export interface ChildRegistrationResponse {
  child: ChildDTO;
  vaccination_schedule: VaccinationScheduleDTO[];
}

export interface MotherSearchResult {
  health_id: string;
  name: string;
  phone: string;
}
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

// Backwards-compatible aliases used by validators and other modules
export type VaccinationSessionChild = ChildVaccinationSessionChild;
export type VaccinationSessionData = ChildVaccinationSessionResponse;
export type VaccinationSessionRecord = ChildVaccinationSessionRecord;

export type AdministerVaccinationRequest = {
	lotNumber: string;
};
