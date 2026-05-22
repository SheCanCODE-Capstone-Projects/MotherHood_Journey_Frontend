// Compatibility shim for the nested `motherhood_journey` package.
// Re-export the central API client implementation from the workspace root.

export { apiClient, createApiClient, isApiError } from '../../../../src/lib/api/client';

export type { ApiClient } from '../../../../src/lib/api/client';
