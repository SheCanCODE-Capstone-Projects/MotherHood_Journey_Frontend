const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.trim() ??
  "https://motherhoodjourneybackend-production.up.railway.app";

export interface RegisterPayload {
  phoneNumber: string;
  nationalId: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;           // backend expects uppercase: PATIENT, HEALTH_WORKER …
  geoLocationId?: string;
  facilityId?: string;
}

export interface RegisterResult {
  userId: string;
  phoneNumber: string;
  role: string;
  firstName: string;
  lastName: string;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResult> {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  const data = body?.data ?? body;

  if (!res.ok) {
    throw new Error(body?.message ?? `Registration failed (${res.status})`);
  }

  if (body?.success === false) {
    throw new Error(body?.message ?? "Registration failed");
  }

  return data as RegisterResult;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await fetch(`${API_BASE}/api/v1/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => {/* best-effort */});
}
