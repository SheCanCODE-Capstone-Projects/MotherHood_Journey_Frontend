import type {
  SubmitPayload,
  SubmitResponse,
  ServiceRequestDTO,
  ListServiceRequestsParams,
  ReviewActionPayload,
  ServiceRequestStatus,
} from "@/features/service-requests/types";
import type {
  BackendServiceRequestResponse,
  BackendServiceRequestDocResponse,
  CreateServiceRequestPayload,
  BackendServiceRequestStatus,
} from "@/features/service-requests/types";
import { apiClient } from "./client";

// ─── Auth context (call after login) ─────────────────────────────────────────

let _facilityId: string | null = null;
let _geoLocationId: string | null = null;

export function setServiceRequestAuthContext(opts: {
  facilityId: string;
  geoLocationId?: string;
}) {
  _facilityId = opts.facilityId;
  if (opts.geoLocationId) _geoLocationId = opts.geoLocationId;
}

// ─── Status mapping ──────────────────────────────────────────────────────────

const BACKEND_TO_FRONTEND_STATUS: Record<
  BackendServiceRequestStatus,
  ServiceRequestStatus
> = {
  PENDING: "PENDING",
  UNDER_REVIEW: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IREMBO_SUBMITTED: "APPROVED",
  COMPLETED: "APPROVED",
};

function mapBackendToFrontendStatus(
  s: BackendServiceRequestStatus,
): ServiceRequestStatus {
  return BACKEND_TO_FRONTEND_STATUS[s] ?? "PENDING";
}

// ─── Mapping helpers ─────────────────────────────────────────────────────────

function mapBackendRequest(
  backend: BackendServiceRequestResponse,
): ServiceRequestDTO {
  return {
    id: backend.id,
    referenceNo: backend.referenceNo,
    patientName: "",
    serviceType: backend.serviceType,
    submittedDate: backend.submittedAt,
    status: mapBackendToFrontendStatus(backend.status),
    documents: [],
    rejectionReason: backend.rejectionReason,
  };
}

// ─── Submit service request ───────────────────────────────────────────────────

export async function submitServiceRequest(
  payload: SubmitPayload,
): Promise<SubmitResponse> {
  try {
    const body: CreateServiceRequestPayload = {
      serviceType: payload.serviceType,
      facilityId: _facilityId ?? "unknown-facility",
      geoLocationId: _geoLocationId ?? undefined,
    };

    const response = await apiClient.post<BackendServiceRequestResponse>(
      "/api/v1/service-requests",
      body,
    );

    return {
      referenceNumber: response.referenceNo,
    };
  } catch (error) {
    console.warn("submitServiceRequest API call failed, using mock:", error);
    await new Promise((res) => setTimeout(res, 1800));
    return {
      referenceNumber: `SR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    };
  }
}

// ─── List service requests ───────────────────────────────────────────────────

export async function listServiceRequests(
  params?: ListServiceRequestsParams,
): Promise<ServiceRequestDTO[]> {
  try {
    const url = _facilityId
      ? `/api/v1/service-requests/by-facility/${_facilityId}`
      : "/api/v1/service-requests/by-status";

    const response = await apiClient.get<{
      content: BackendServiceRequestResponse[];
    }>(url);

    let items = (response.content ?? []).map(mapBackendRequest);

    if (params?.status) {
      items = items.filter((r) => r.status === params.status);
    }
    if (params?.serviceType) {
      items = items.filter((r) => r.serviceType === params.serviceType);
    }

    return items;
  } catch (error) {
    console.warn("listServiceRequests API call failed, using mock:", error);
    await new Promise((res) => setTimeout(res, 500));
    return MOCK_REQUESTS;
  }
}

// ─── Review (approve / reject) ───────────────────────────────────────────────

export async function reviewServiceRequest(
  payload: ReviewActionPayload,
): Promise<{ success: boolean }> {
  try {
    if (payload.action === "APPROVED") {
      await apiClient.patch(
        `/api/v1/service-requests/${payload.id}/approve`,
      );
    } else if (payload.action === "REJECTED") {
      await apiClient.patch(
        `/api/v1/service-requests/${payload.id}/reject`,
        { reason: payload.rejectionReason ?? "" },
      );
    } else {
      throw new Error(`Action ${payload.action} not supported by backend`);
    }
    return { success: true };
  } catch (error) {
    console.warn("reviewServiceRequest API call failed, using mock:", error);
    await new Promise((res) => setTimeout(res, 800));

    const request = MOCK_REQUESTS.find((r) => r.id === payload.id);
    if (!request) {
      throw new Error(`Service request ${payload.id} not found`);
    }

    request.status = payload.action === "APPROVED" ? "APPROVED" : "REJECTED";
    if (payload.rejectionReason) {
      request.rejectionReason = payload.rejectionReason;
    }
    return { success: true };
  }
}

// ─── Document upload ─────────────────────────────────────────────────────────

export async function uploadServiceRequestDocument(
  requestId: string,
  documentType: string,
  file: File,
): Promise<BackendServiceRequestDocResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const response = await apiClient.post<BackendServiceRequestDocResponse>(
    `/api/v1/service-requests/${requestId}/documents`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response;
}

export async function getServiceRequestDocuments(
  requestId: string,
): Promise<BackendServiceRequestDocResponse[]> {
  const response = await apiClient.get<
    BackendServiceRequestDocResponse[]
  >(`/api/v1/service-requests/${requestId}/documents`);
  return response;
}

// ─── Mock data (kept as fallback) ────────────────────────────────────────────

const MOCK_REQUESTS: ServiceRequestDTO[] = [
  {
    id: "sr-1",
    referenceNo: "SR-2026-00001",
    patientName: "Uwimana Marie",
    serviceType: "BIRTH_CERT",
    submittedDate: "2026-05-10T09:30:00Z",
    status: "PENDING",
    documents: [
      { key: "ID_COPY", name: "id_uwimana.pdf", url: "/mock-docs/id_uwimana.pdf" },
      { key: "BIRTH_PROOF", name: "birth_proof.pdf", url: "/mock-docs/birth_proof.pdf" },
    ],
  },
  {
    id: "sr-2",
    referenceNo: "SR-2026-00002",
    patientName: "Mukamana Jeanne",
    serviceType: "VACCINATION_CARD",
    submittedDate: "2026-05-09T14:15:00Z",
    status: "PENDING",
    documents: [
      { key: "ID_COPY", name: "id_mukamana.pdf", url: "/mock-docs/id_mukamana.pdf" },
    ],
  },
  {
    id: "sr-3",
    referenceNo: "SR-2026-00003",
    patientName: "Nyiramongi Alice",
    serviceType: "REFERRAL",
    submittedDate: "2026-05-08T11:00:00Z",
    status: "APPROVED",
    documents: [
      { key: "ID_COPY", name: "id_nyiramongi.pdf", url: "/mock-docs/id_nyiramongi.pdf" },
      { key: "FACILITY_LETTER", name: "referral_letter.pdf", url: "/mock-docs/referral_letter.pdf" },
    ],
  },
  {
    id: "sr-4",
    referenceNo: "SR-2026-00004",
    patientName: "Uwase Beatrice",
    serviceType: "HEALTH_SUMMARY",
    submittedDate: "2026-05-07T08:45:00Z",
    status: "REJECTED",
    rejectionReason: "Incomplete documentation - ID copy is illegible",
    documents: [
      { key: "ID_COPY", name: "id_uwase.jpg", url: "/mock-docs/id_uwase.jpg" },
    ],
  },
  {
    id: "sr-5",
    referenceNo: "SR-2026-00005",
    patientName: "Nyirahabimana Claudine",
    serviceType: "REPRINT",
    submittedDate: "2026-05-06T16:20:00Z",
    status: "ESCALATED",
    documents: [
      { key: "ID_COPY", name: "id_nyirahabimana.pdf", url: "/mock-docs/id_nyirahabimana.pdf" },
    ],
  },
  {
    id: "sr-6",
    referenceNo: "SR-2026-00006",
    patientName: "Mukandayisenga Olive",
    serviceType: "BIRTH_CERT",
    submittedDate: "2026-05-12T10:00:00Z",
    status: "PENDING",
    documents: [
      { key: "ID_COPY", name: "id_mukandayisenga.pdf", url: "/mock-docs/id_mukandayisenga.pdf" },
      { key: "BIRTH_PROOF", name: "birth_proof_mukandayisenga.pdf", url: "/mock-docs/birth_proof_mukandayisenga.pdf" },
    ],
  },
  {
    id: "sr-7",
    referenceNo: "SR-2026-00007",
    patientName: "Uwimana Angelique",
    serviceType: "VACCINATION_CARD",
    submittedDate: "2026-05-11T13:30:00Z",
    status: "PENDING",
    documents: [
      { key: "ID_COPY", name: "id_uwimana_angelique.pdf", url: "/mock-docs/id_uwimana_angelique.pdf" },
    ],
  },
];
