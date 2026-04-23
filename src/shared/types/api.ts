/**
 * API Response and Error Types
 * Typed DTOs for all API responses and error handling
 */

/**
 * Standardized error response from API
 * Matches backend ErrorResponseDTO structure
 */
export type ErrorResponseDTO = {
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
};

/**
 * Typed API Error thrown by fetch client on non-2xx responses
 * Includes HTTP status code and error message from backend
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly originalError?: ErrorResponseDTO,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Check if error is client error (4xx)
   */
  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Check if error is authentication error (401)
   */
  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is forbidden (403)
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }
}

/**
 * Generic API response envelope
 * Used for wrapping API responses
 */
export type ApiResponse<T> = {
  data?: T;
  error?: ErrorResponseDTO;
  success: boolean;
  timestamp: string;
};

/**
 * Paginated response wrapper
 * Used for list endpoints
 */
export type PageResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

/**
 * JWT token response from authentication
 * Returned on successful login
 */
export type AuthTokenResponse = {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: "Bearer";
};

/**
 * User info in authentication response
 */
export type AuthenticatedUserInfo = {
  id: string;
  email: string;
  role: "MOTHER" | "NURSE" | "CHW" | "ADMIN";
  phone?: string;
  name?: string;
};
