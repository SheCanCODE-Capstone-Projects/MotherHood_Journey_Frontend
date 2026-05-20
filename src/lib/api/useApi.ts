"use client";

import { useCallback } from "react";
import { apiClient } from "./client";
import type { ApiError } from "@/shared/types/api";

/**
 * Hook for using the typed API client in React components
 * Provides convenient access to all HTTP methods with automatic error handling
 * 
 * Usage:
 *   const api = useApi();
 *   
 *   // Simple GET
 *   const data = await api.get<User>('/api/users/profile');
 *   
 *   // With error handling
 *   try {
 *     const result = await api.post<CreateResponse>('/api/items', { name: 'test' });
 *   } catch (error) {
 *     if (api.isError(error)) {
 *       console.error(`API error ${error.statusCode}: ${error.message}`);
 *     }
 *   }
 */
export function useApi() {
  const get = useCallback(
    async <T,>(endpoint: string) => apiClient.get<T>(endpoint),
    [],
  );

  const post = useCallback(
    async <T,>(endpoint: string, body?: unknown) =>
      apiClient.post<T>(endpoint, body),
    [],
  );

  const put = useCallback(
    async <T,>(endpoint: string, body?: unknown) =>
      apiClient.put<T>(endpoint, body),
    [],
  );

  const patch = useCallback(
    async <T,>(endpoint: string, body?: unknown) =>
      apiClient.patch<T>(endpoint, body),
    [],
  );

  const del = useCallback(
    async <T = void,>(endpoint: string) => apiClient.delete<T>(endpoint),
    [],
  );

  const getToken = useCallback(() => apiClient.getToken(), []);

  const isError = useCallback((error: unknown): error is ApiError => {
    return error instanceof Error && "statusCode" in error;
  }, []);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    getToken,
    isError,
  };
}
