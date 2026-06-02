import { apiClient } from "./client";
import type {
  ServiceRequestResponse,
  CreateServiceRequestRequest,
  ServiceRequestStatus,
  BackendPage,
} from "@/shared/types/backend";

const BASE = "/api/v1/service-requests";

export async function createServiceRequest(
  data: CreateServiceRequestRequest
): Promise<ServiceRequestResponse> {
  return apiClient.post<ServiceRequestResponse>(BASE, data);
}

export async function getServiceRequestById(id: string): Promise<ServiceRequestResponse> {
  return apiClient.get<ServiceRequestResponse>(`${BASE}/${encodeURIComponent(id)}`);
}

export async function getServiceRequestsByStatus(
  status: ServiceRequestStatus,
  page = 0,
  size = 20
): Promise<BackendPage<ServiceRequestResponse>> {
  const params = new URLSearchParams({ status, page: String(page), size: String(size) });
  return apiClient.get<BackendPage<ServiceRequestResponse>>(`${BASE}/by-status?${params.toString()}`);
}

export async function getServiceRequestsByFacility(
  facilityId: string,
  page = 0,
  size = 20
): Promise<BackendPage<ServiceRequestResponse>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiClient.get<BackendPage<ServiceRequestResponse>>(
    `${BASE}/by-facility/${encodeURIComponent(facilityId)}?${params.toString()}`
  );
}

export async function approveServiceRequest(id: string): Promise<ServiceRequestResponse> {
  return apiClient.patch<ServiceRequestResponse>(`${BASE}/${encodeURIComponent(id)}/approve`);
}

export async function rejectServiceRequest(id: string, reason: string): Promise<ServiceRequestResponse> {
  return apiClient.patch<ServiceRequestResponse>(
    `${BASE}/${encodeURIComponent(id)}/reject?reason=${encodeURIComponent(reason)}`
  );
}

export async function attachDocumentToServiceRequest(
  requestId: string,
  file: File,
  documentType: "ID_COPY" | "BIRTH_PROOF" | "FACILITY_LETTER" | "OTHER"
): Promise<{ id: string; documentType: string; url: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("documentType", documentType);
  return apiClient.postForm<{ id: string; documentType: string; url: string }>(
    `${BASE}/${encodeURIComponent(requestId)}/documents`,
    form
  );
}
