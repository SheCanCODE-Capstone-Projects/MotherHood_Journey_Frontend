import { SubmitPayload, SubmitResponse } from "@/features/service-requests/types";
 
export async function submitServiceRequest(
  payload: SubmitPayload
): Promise<SubmitResponse> {
  await new Promise((res) => setTimeout(res, 1800));
  return {
    referenceNumber: `SR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
  };
}