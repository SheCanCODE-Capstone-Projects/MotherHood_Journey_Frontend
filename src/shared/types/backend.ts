/**
 * Backend API DTOs — aligned with the Swagger specification at
 * https://motherhoodjourneybackend-production.up.railway.app/v3/api-docs
 */

/* ─────────────────────────────────────────
   Shared / pagination
───────────────────────────────────────── */
export interface BackendPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
  last: boolean;
}

/* ─────────────────────────────────────────
   Auth
───────────────────────────────────────── */
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  userId?: string;
  facilityId?: string | null;
  geoScopeIds?: string[];
  canExport?: boolean;
  canPushHmis?: boolean;
}

export interface RegisterRequest {
  phoneNumber: string;
  nationalId: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  geoLocationId?: string;
  facilityId?: string;
}

/* ─────────────────────────────────────────
   Geo
───────────────────────────────────────── */
export interface GeoResolveResponse {
  id: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

/* ─────────────────────────────────────────
   Mothers
───────────────────────────────────────── */
export type NidaVerifiedStatus = "VERIFIED" | "PENDING" | "PARTIAL_MATCH" | "FAILED" | "NOT_CHECKED";

export interface MotherResponse {
  id: string;
  healthId: string;
  userId: string;
  facilityId?: string;
  nationalId?: string;
  nidaVerifiedStatus: NidaVerifiedStatus;
  dateOfBirth: string;
  educationLevel?: string;
  facilityName?: string;
  sector?: string;
  cell?: string;
  village?: string;
  registeredAt: string;
}

export interface CreateMotherRequest {
  userId: string;
  facilityId: string;
  nationalId: string;
  geoLocationId: string;
  dateOfBirth: string;
  educationLevel?: string;
}

/* ─────────────────────────────────────────
   Pregnancies
───────────────────────────────────────── */
export type PregnancyStatus = "ACTIVE" | "DELIVERED" | "LOST" | "TRANSFERRED";

export interface PregnancyResponse {
  id: string;
  motherId: string;
  lmpDate: string;
  edd: string;
  gravida: number;
  para: number;
  status: PregnancyStatus;
  assignedChwId?: string;
  outcomeNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePregnancyRequest {
  motherId: string;
  facilityId?: string;
  lmpDate: string;
  edd: string;
  gravida: number;
  para: number;
  assignedChwId?: string;
}

export interface UpdatePregnancyRequest {
  status?: PregnancyStatus;
  outcomeNotes?: string;
  edd?: string;
  assignedChwId?: string;
}

/* ─────────────────────────────────────────
   Children
───────────────────────────────────────── */
export type ChildGender     = "MALE" | "FEMALE";
export type DeliveryType    = "VAGINAL" | "CAESAREAN" | "ASSISTED";
export type ChildHealthStatus = "HEALTHY" | "AT_RISK" | "MALNOURISHED" | "SICK";

export interface ChildResponse {
  id: string;
  motherId: string;
  facilityId: string;
  firstName: string;
  gender: ChildGender;
  dateOfBirth: string;
  birthWeightKg?: number;
  deliveryType?: DeliveryType;
  birthCertificateNo?: string;
  healthStatus?: ChildHealthStatus;
  createdAt: string;
}

export interface CreateChildRequest {
  motherId: string;
  facilityId: string;
  geoLocationId: string;
  birthCertificateNo?: string;
  firstName: string;
  gender: ChildGender;
  dateOfBirth: string;
  birthWeightKg?: number;
  deliveryType?: DeliveryType;
}

/* ─────────────────────────────────────────
   Vaccinations
───────────────────────────────────────── */
export type VaccineStatus = "SCHEDULED" | "ADMINISTERED" | "OVERDUE" | "SKIPPED";

export interface VaccinationRecordResponse {
  id: string;
  childId: string;
  vaccineName: string;
  vaccineCode: string;
  scheduledDate: string;
  administeredDate?: string;
  status: VaccineStatus;
  administeredById?: string;
  lotNumber?: string;
  notes?: string;
  dueAgeWeeks?: number;
}

export interface AdministerVaccinationRequest {
  administeredById: string;
  administeredDate: string;
  lotNumber?: string;
  notes?: string;
}

/* ─────────────────────────────────────────
   Health Visits
───────────────────────────────────────── */
export type VisitType  = "ANC" | "PNC" | "IMMUNIZATION" | "SICK_CHILD" | "GROWTH_MONITORING";
export type PatientType = "MOTHER" | "CHILD";

export interface DiagnosisEntry {
  icd10Code: string;
  icd10Name: string;
  isPrimary: boolean;
  notes?: string;
}

export interface PrescriptionEntry {
  medication: string;
  dosage: string;
  duration: string;
  notes?: string;
}

export interface HealthVisitResponse {
  id: string;
  patientRefId: string;
  patientType: PatientType;
  facilityId: string;
  healthWorkerId: string;
  visitDatetime: string;
  visitType: VisitType;
  chiefComplaint?: string;
  weightKg?: number;
  heightCm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  muacCm?: number;
  notes?: string;
  diagnoses: DiagnosisEntry[];
  prescriptions: PrescriptionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthVisitRequest {
  patientRefId: string;
  patientType: PatientType;
  facilityId: string;
  healthWorkerId: string;
  visitDatetime: string;
  visitType: VisitType;
  chiefComplaint?: string;
  weightKg?: number;
  heightCm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  muacCm?: number;
  notes?: string;
  diagnoses?: DiagnosisEntry[];
  prescriptions?: PrescriptionEntry[];
}

export type UpdateHealthVisitRequest = Partial<CreateHealthVisitRequest>;

/* ─────────────────────────────────────────
   Appointments
───────────────────────────────────────── */
export type AppointmentType   = "ANC" | "PNC" | "IMMUNIZATION" | "GENERAL" | "FOLLOW_UP";
export type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface AppointmentResponse {
  id: string;
  patientRefId: string;
  patientType: PatientType;
  facilityId: string;
  healthWorkerId?: string;
  geoLocationId?: string;
  scheduledAt: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  patientRefId: string;
  patientType: PatientType;
  facilityId: string;
  healthWorkerId?: string;
  geoLocationId?: string;
  scheduledAt: string;
  appointmentType: AppointmentType;
  notes?: string;
}

/* ─────────────────────────────────────────
   Consent
───────────────────────────────────────── */
export type ConsentType = "DATA_SHARING" | "RESEARCH" | "HMIS_SYNC" | "THIRD_PARTY";

export interface ConsentResponse {
  id: string;
  motherId: string;
  consentType: ConsentType;
  granted: boolean;
  grantedByRole: string;
  legalBasis?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface CreateConsentRequest {
  motherId: string;
  consentType: ConsentType;
  granted: boolean;
  grantedByRole: string;
  legalBasis?: string;
  expiresAt?: string;
}

/* ─────────────────────────────────────────
   Service Requests
───────────────────────────────────────── */
export type ServiceRequestType   = "BIRTH_CERT" | "VACCINATION_CARD" | "REFERRAL" | "HEALTH_SUMMARY" | "REPRINT";
export type ServiceRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED";

export interface ServiceRequestResponse {
  id: string;
  serviceType: ServiceRequestType;
  status: ServiceRequestStatus;
  facilityId: string;
  geoLocationId: string;
  payload: Record<string, unknown>;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestRequest {
  serviceType: ServiceRequestType;
  facilityId: string;
  geoLocationId: string;
  payload: Record<string, unknown>;
}

/* ─────────────────────────────────────────
   Facilities
───────────────────────────────────────── */
export type FacilityType = "HEALTH_CENTER" | "DISTRICT_HOSPITAL" | "REFERRAL_HOSPITAL" | "CLINIC" | "CHW_POST";

export interface FacilityResponse {
  id: string;
  name: string;
  facilityCode: string;
  facilityType: FacilityType;
  district: string;
  phone?: string;
  geoLocationId?: string;
  createdAt: string;
}

export interface FacilityAnalyticsResponse {
  facilityId: string;
  totalMothers: number;
  totalChildren: number;
  activePregnancies: number;
  ancVisitsThisMonth: number;
  vaccinationsDue: number;
  pendingServiceRequests: number;
}

/* ─────────────────────────────────────────
   Users / Me
───────────────────────────────────────── */
export interface MeResponse {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  facilityId?: string;
  geoLocationId?: string;
  language?: string;
  createdAt: string;
}

export interface UserResponse {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  facilityId?: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  language?: string;
}

/* ─────────────────────────────────────────
   Admin Dashboard
───────────────────────────────────────── */
export interface AdminDashboardResponse {
  totalFacilities: number;
  totalMothers: number;
  totalChildren: number;
  totalHealthWorkers: number;
  totalAppointments: number;
  activePregnancies: number;
  recentRegistrations: number;
}

/* ─────────────────────────────────────────
   Government Users
───────────────────────────────────────── */
export type GovRole = "GOVERNMENT_ANALYST" | "MOH_ADMIN" | "DISTRICT_OFFICER";

export interface GovernmentResponse {
  id: string;
  userId: string;
  govRole: GovRole;
  ministry?: string;
  employeeId?: string;
  scopedGeoIds: string[];
  canExport: boolean;
  canPushHmis: boolean;
  active: boolean;
  createdAt: string;
}

/* ─────────────────────────────────────────
   Gov Sync
───────────────────────────────────────── */
export type SyncStatus   = "PENDING" | "SUCCESS" | "FAILED" | "DEAD_LETTER";
export type TargetSystem = "NIDA" | "HMIS" | "IREMBO";

export interface GovSyncEntry {
  id: string;
  targetSystem: TargetSystem;
  status: SyncStatus;
  payload: Record<string, unknown>;
  responseCode?: number;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
}

export interface GovSyncStatusResponse {
  pending: number;
  success: number;
  failed: number;
  deadLetter: number;
}

/* ─────────────────────────────────────────
   Government Reports
───────────────────────────────────────── */
export type GovReportType = "VACCINATION_COVERAGE" | "ANC_ATTENDANCE" | "BIRTH_REGISTRATION" | "MATERNAL_HEALTH";

export interface CreateGovReportRequest {
  reportType: GovReportType;
  period: string;
  scopeLevel: string;
  geoLocationId?: string;
  aggregates?: string[];
}

export interface GovReportResponse {
  id: string;
  reportType: GovReportType;
  period: string;
  scopeLevel: string;
  geoLocationId?: string;
  data: Record<string, unknown>;
  generatedAt: string;
}

/* ─────────────────────────────────────────
   Notifications
───────────────────────────────────────── */
export type NotificationType = "APPOINTMENT_REMINDER" | "VACCINATION_DUE" | "GENERAL" | "EMERGENCY";

export interface SendNotificationRequest {
  recipientUserId: string;
  phoneNumber: string;
  message: string;
  notificationType: NotificationType;
  scheduledAt?: string;
}

export interface NotificationResponse {
  id: string;
  recipientUserId: string;
  phoneNumber: string;
  message: string;
  notificationType: NotificationType;
  status: string;
  scheduledAt?: string;
  sentAt?: string;
}
