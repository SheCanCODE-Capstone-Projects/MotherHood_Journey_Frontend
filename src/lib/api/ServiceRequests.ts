import type {
  SubmitPayload,
  SubmitResponse,
  ServiceRequestDTO,
  ListServiceRequestsParams,
  ReviewActionPayload,
  ServiceTypeId,
  ServiceRequestStatus,
} from "@/features/service-requests/types";

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

export async function submitServiceRequest(
  payload: SubmitPayload
): Promise<SubmitResponse> {
  await new Promise((res) => setTimeout(res, 1800));
  return {
    referenceNumber: `SR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
  };
}

export async function listServiceRequests(
  params?: ListServiceRequestsParams,
): Promise<ServiceRequestDTO[]> {
  await new Promise((res) => setTimeout(res, 500));

  let filtered = [...MOCK_REQUESTS];

  if (params?.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }

  if (params?.serviceType) {
    filtered = filtered.filter((r) => r.serviceType === params.serviceType);
  }

  return filtered;
}

export async function reviewServiceRequest(
  payload: ReviewActionPayload,
): Promise<{ success: boolean }> {
  await new Promise((res) => setTimeout(res, 800));

  const request = MOCK_REQUESTS.find((r) => r.id === payload.id);
  if (!request) {
    throw new Error(`Service request ${payload.id} not found`);
  }

  request.status = payload.action;
  if (payload.rejectionReason) {
    request.rejectionReason = payload.rejectionReason;
  }

  return { success: true };
}