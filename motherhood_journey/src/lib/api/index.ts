/**
 * API Client Module
 * 
 * Typed fetch wrapper with automatic bearer token attachment and error handling.
 * All non-2xx responses throw ApiError with status code and error message.
 * 
 * @example
 * // Using the singleton client
 * import { apiClient } from '@/lib/api/client';
 * 
 * const users = await apiClient.get<User[]>('/api/users');
 * const newUser = await apiClient.post<User>('/api/users', { name: 'John' });
 * 
 * @example
 * // Using the React hook in components
 * 'use client';
 * import { useApi } from '@/lib/api/useApi';
 * 
 * export function UserProfile() {
 *   const api = useApi();
 *   const [user, setUser] = useState<User | null>(null);
 *   const [error, setError] = useState<string | null>(null);
 * 
 *   useEffect(() => {
 *     api.get<User>('/api/users/profile')
 *       .then(setUser)
 *       .catch((err) => {
 *         if (api.isError(err)) {
 *           setError(`Error ${err.statusCode}: ${err.message}`);
 *         }
 *       });
 *   }, [api]);
 * 
 *   return error ? <div>{error}</div> : <div>{user?.name}</div>;
 * }
 * 
 * @example
 * // Error handling with type guards
 * import { apiClient, isApiError } from '@/lib/api/client';
 * 
 * try {
 *   await apiClient.post('/api/items', { name: 'test' });
 * } catch (error) {
 *   if (isApiError(error)) {
 *     if (error.isUnauthorized()) {
 *       // Handle 401 - redirect to login
 *     } else if (error.isClientError()) {
 *       // Handle 4xx - show validation error
 *     } else if (error.isServerError()) {
 *       // Handle 5xx - show server error message
 *     }
 *   }
 * }
 */

export { apiClient, createApiClient, isApiError } from "./client";
export type { ApiClient } from "./client";
export { useApi } from "./useApi";

export type {
  ApiError,
  ApiResponse,
  ApiResponse as ApiResponseEnvelope,
  ErrorResponseDTO,
  AuthTokenResponse,
  AuthenticatedUserInfo,
  PageResponse,
} from "@/shared/types/api";

export { ApiError } from "@/shared/types/api";
