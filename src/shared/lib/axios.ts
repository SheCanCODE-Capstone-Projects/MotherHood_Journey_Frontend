// Compatibility shim: re-export the centralized API client implementation
// Several modules import from "@/shared/lib/axios" — provide a thin
// adapter that forwards to the real implementation in `src/lib/api/client.ts`.

export { apiClient, createApiClient, isApiError } from "@/lib/api/client";

export type { ApiClient } from "@/lib/api/client";
