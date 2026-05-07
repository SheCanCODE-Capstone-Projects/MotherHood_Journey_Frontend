import { createApiClient } from "@/lib/api/client";
import type {
  MotherRegistrationRequest,
  MotherRegistrationResponse,
} from "../types";

/**
 * Create a new mother registration
 * Sends POST request to /api/v1/mothers with mother data
 * Returns health_id and other registration details
 */
export async function registerMother(
  data: MotherRegistrationRequest
): Promise<MotherRegistrationResponse> {
  const client = createApiClient();

  const response = await client.post<MotherRegistrationResponse>(
    "/api/v1/mothers",
    {
      national_id: data.national_id,
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      phone_number: data.phone_number,
      home_location: data.home_location,
      education_level: data.education_level,
    }
  );

  return response;
}

/**
 * Get mother details by health ID
 * Used for verification or display purposes
 */
export async function getMotherByHealthId(
  healthId: string
): Promise<MotherRegistrationResponse> {
  const client = createApiClient();

  const response = await client.get<MotherRegistrationResponse>(
    `/api/v1/mothers/${healthId}`
  );

  return response;
}
