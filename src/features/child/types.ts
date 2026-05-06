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
