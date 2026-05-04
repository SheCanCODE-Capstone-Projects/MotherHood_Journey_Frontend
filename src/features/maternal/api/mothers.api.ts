/**
 * Mothers API endpoints
 * Handles all mother/patient data operations
 * Based on backend: com.motherhood.journey.maternal.controller.MotherController
 */

import { apiClient } from "@/lib/api/client";
import type { PageResponse } from "@/shared/types/api";
import type { Mother, MotherPageResponse } from "../types";

/**
 * Search mothers by health_id, name, or NID
 * Endpoint: GET /api/v1/mothers/search
 * Returns paginated results using backend PageResponse shape
 */
export async function searchMothers(
  searchTerm?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<MotherPageResponse> {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append("search_term", searchTerm);
  }
  // Backend typically uses 0-based page indexing
  params.append("page", (page - 1).toString());
  params.append("page_size", pageSize.toString());

  const response = await apiClient.get<MotherPageResponse>(
    `/api/v1/mothers/search?${params.toString()}`
  );
  return response;
}

/**
 * Get all mothers with pagination
 * Endpoint: GET /api/v1/mothers
 */
export async function getMothers(
  page: number = 1,
  pageSize: number = 10
): Promise<MotherPageResponse> {
  const params = new URLSearchParams();
  params.append("page", (page - 1).toString());
  params.append("page_size", pageSize.toString());

  return apiClient.get<MotherPageResponse>(
    `/api/v1/mothers?${params.toString()}`
  );
}

/**
 * Get a single mother by ID
 * Endpoint: GET /api/v1/mothers/{id}
 */
export async function getMotherById(id: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/${id}`);
}

/**
 * Get mother by health ID
 * Endpoint: GET /api/v1/mothers/health-id/{healthId}
 */
export async function getMotherByHealthId(healthId: string): Promise<Mother> {
  return apiClient.get<Mother>(`/api/v1/mothers/health-id/${healthId}`);
}
