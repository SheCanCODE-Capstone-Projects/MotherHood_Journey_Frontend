"use client";

import { ApiError as ApiErrorClass } from "@/shared/types/api";
import type { ErrorResponseDTO } from "@/shared/types/api";
import { useAuth } from "@/shared/hooks/useAuth";

type SessionTokenCarrier = {
  accessToken?: string;
  token?: string;
  user?: {
    accessToken?: string;
    token?: string;
  };
};

/**
 * Typed fetch client with automatic bearer token attachment
 * Throws ApiError on non-2xx responses with detailed error information
 * 
 * Usage:
 *   const client = createApiClient();
 *   const data = await client.get<UserResponse>('/api/users/profile');
 *   const created = await client.post<CreatedItem>('/api/items', { name: 'test' });
 */

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
  getToken(): string | null;
}

export function createApiClient(): ApiClient {
  /**
   * Resolve token from local persisted auth state.
   */
  function getFallbackToken(): string | null {
    try {
      const authStore = useAuth.getState();
      if (authStore.currentUser) {
        return localStorage.getItem("auth_token");
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Resolve bearer token from persisted auth state.
   *
   * The app currently serves local demo API routes for routes that do not have
   * backend coverage yet, so we avoid probing NextAuth session endpoints here.
   */
  async function getBearerToken(): Promise<string | null> {
    return getFallbackToken();
  }

  /**
   * Parse response and handle errors
   */
  async function parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // If response is not OK (non-2xx), throw ApiError
    if (!response.ok) {
      const errorData = isErrorResponseDTO(data) ? data : null;
      const statusCode = errorData?.statusCode ?? errorData?.status ?? response.status;
      const errorMessage =
        errorData?.message ||
        (typeof data === "string" ? data : `HTTP ${response.status}`);

      const normalizedError = errorData
        ? {
            ...errorData,
            statusCode,
          }
        : undefined;

      throw new ApiErrorClass(statusCode, errorMessage, normalizedError);
    }

    return data as T;
  }

  /**
   * Make a typed fetch request with automatic bearer token attachment
   */
  async function request<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Auto-attach bearer token if available
    const token = await getBearerToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      return await parseResponse<T>(response);
    } catch (error) {
      // Re-throw ApiError as-is, wrap other errors
      if (error instanceof ApiErrorClass) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new ApiErrorClass(
          0,
          `Network error: ${error.message}`,
        );
      }

      throw new ApiErrorClass(
        500,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  return {
    /**
     * GET request
     * @example
     *   const users = await client.get<User[]>('/api/users');
     */
    async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
      return request<T>(endpoint, { ...options, method: "GET" });
    },

    /**
     * POST request with body
     * @example
     *   const created = await client.post<User>('/api/users', { name: 'John' });
     */
    async post<T>(
      endpoint: string,
      body?: unknown,
      options?: FetchOptions,
    ): Promise<T> {
      return request<T>(endpoint, {
        ...options,
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
    },

    /**
     * PUT request with body
     * @example
     *   const updated = await client.put<User>('/api/users/123', { name: 'Jane' });
     */
    async put<T>(
      endpoint: string,
      body?: unknown,
      options?: FetchOptions,
    ): Promise<T> {
      return request<T>(endpoint, {
        ...options,
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      });
    },

    /**
     * PATCH request with body
     * @example
     *   const patched = await client.patch<User>('/api/users/123', { role: 'admin' });
     */
    async patch<T>(
      endpoint: string,
      body?: unknown,
      options?: FetchOptions,
    ): Promise<T> {
      return request<T>(endpoint, {
        ...options,
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
      });
    },

    /**
     * DELETE request
     * @example
     *   await client.delete('/api/users/123');
     */
    async delete<T = void>(endpoint: string, options?: FetchOptions): Promise<T> {
      return request<T>(endpoint, { ...options, method: "DELETE" });
    },

    /**
     * Get current bearer token
     * Useful for direct fetch or debugging
     */
    getToken(): string | null {
      return getFallbackToken();
    },
  };
}

/**
 * Singleton API client instance
 * Use this instead of creating new instances
 */
export const apiClient = createApiClient();

/**
 * Type helper for API errors
 */
export function isApiError(error: unknown): error is ApiErrorClass {
  return error instanceof ApiErrorClass;
}
