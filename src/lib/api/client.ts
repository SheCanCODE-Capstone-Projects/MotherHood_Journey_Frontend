"use client";

import { ApiError as ApiErrorClass } from "@/shared/types/api";
import type { ErrorResponseDTO } from "@/shared/types/api";

type RequestInit = Omit<globalThis.RequestInit, "headers">;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

function isErrorResponseDTO(value: unknown): value is ErrorResponseDTO {
  return Boolean(value && typeof value === "object" && "message" in value);
}

export interface ApiClient {
  get<T>(endpoint: string, options?: FetchOptions): Promise<T>;
  post<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T>;
  put<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T>;
  patch<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T>;
  delete<T = void>(endpoint: string, options?: FetchOptions): Promise<T>;
  postForm<T>(endpoint: string, form: FormData, options?: FetchOptions): Promise<T>;
  getToken(): string | null;
}

/* ── Token resolution ──────────────────────────────────────────────
   Priority order:
   1. next-auth session (primary — populated after real login)
   2. in-memory override (set by token-refresh logic)
   3. localStorage fallback (legacy zustand store)
──────────────────────────────────────────────────────────────────── */
let _tokenOverride: string | null = null;

export function setClientToken(token: string | null) {
  _tokenOverride = token;
}

async function resolveToken(): Promise<string | null> {
  // 1. In-memory override (e.g. freshly refreshed token)
  if (_tokenOverride) return _tokenOverride;

  // 2. next-auth session via dynamic import (safe in RSC + client)
  try {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    const t = session?.user?.accessToken;
    if (t) return t;
  } catch {
    // not in a browser context or next-auth not initialised
  }

  // 3. Legacy localStorage fallback
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_token");
      if (stored) return stored;
    }
  } catch {
    // localStorage blocked
  }

  return null;
}

/* ── Response parsing ────────────────────────────────────────────── */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  let data: unknown;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = await response.text().catch(() => "");
    }
  } else {
    data = await response.text().catch(() => "");
  }

  if (!response.ok) {
    const errorData = isErrorResponseDTO(data) ? data : null;
    const statusCode = errorData?.statusCode ?? errorData?.status ?? response.status;
    const errorMessage =
      errorData?.message ??
      (typeof data === "string" && data.length > 0 ? data : `HTTP ${response.status}`);
    throw new ApiErrorClass(statusCode, errorMessage, errorData ?? undefined);
  }

  // Unwrap backend ApiResponse<T> envelope: { success, message, data }
  if (
    data !== null &&
    typeof data === "object" &&
    "success" in (data as object) &&
    "data" in (data as object)
  ) {
    const envelope = data as { success: boolean; message?: string; data: unknown };
    if (!envelope.success) {
      throw new ApiErrorClass(
        response.status,
        envelope.message ?? "Request failed",
      );
    }
    return envelope.data as T;
  }

  return data as T;
}

/* ── Core request function ───────────────────────────────────────── */
async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "https://motherhoodjourneybackend-production.up.railway.app";

  const url = endpoint.startsWith("http") ? endpoint : `${apiBase}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = await resolveToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { ...options, headers });
    return await parseResponse<T>(response);
  } catch (err) {
    if (err instanceof ApiErrorClass) throw err;
    if (err instanceof TypeError) {
      throw new ApiErrorClass(0, `Network error: ${err.message}`);
    }
    throw new ApiErrorClass(500, err instanceof Error ? err.message : "Unknown error");
  }
}

/* ── Multipart/form-data request ─────────────────────────────────── */
async function requestForm<T>(endpoint: string, form: FormData, options: FetchOptions = {}): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "https://motherhoodjourneybackend-production.up.railway.app";
  const url = endpoint.startsWith("http") ? endpoint : `${apiBase}${endpoint}`;

  // Do NOT set Content-Type — browser sets it with the boundary automatically
  const headers: Record<string, string> = { ...options.headers };
  const token = await resolveToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { ...options, method: "POST", headers, body: form });
    return await parseResponse<T>(response);
  } catch (err) {
    if (err instanceof ApiErrorClass) throw err;
    throw new ApiErrorClass(0, err instanceof Error ? err.message : "Network error");
  }
}

/* ── Public singleton ────────────────────────────────────────────── */
export function createApiClient(): ApiClient {
  return {
    get:    <T>(e: string, o?: FetchOptions) => request<T>(e, { ...o, method: "GET" }),
    post:   <T>(e: string, b?: unknown, o?: FetchOptions) => request<T>(e, { ...o, method: "POST",  body: b ? JSON.stringify(b) : undefined }),
    put:    <T>(e: string, b?: unknown, o?: FetchOptions) => request<T>(e, { ...o, method: "PUT",   body: b ? JSON.stringify(b) : undefined }),
    patch:  <T>(e: string, b?: unknown, o?: FetchOptions) => request<T>(e, { ...o, method: "PATCH", body: b ? JSON.stringify(b) : undefined }),
    delete: <T = void>(e: string, o?: FetchOptions)       => request<T>(e, { ...o, method: "DELETE" }),
    postForm: <T>(e: string, f: FormData, o?: FetchOptions) => requestForm<T>(e, f, o),
    getToken: () => _tokenOverride ?? null,
  };
}

export const apiClient = createApiClient();

export function isApiError(error: unknown): error is ApiErrorClass {
  return error instanceof ApiErrorClass;
}
