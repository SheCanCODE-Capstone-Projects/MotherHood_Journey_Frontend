/**
 * API Constants for Vaccination Module
 * Centralized endpoint definitions and error messages
 */

export const VACCINATION_API = {
  ENDPOINTS: {
    SESSION_SEARCH: "/api/v1/children/vaccinations/session",
    ADMINISTER: (id: string) => `/api/v1/vaccinations/${encodeURIComponent(id)}/administer`,
    VACCINATION_CARD: (childId: string) =>
      `/api/v1/children/${encodeURIComponent(childId)}/vaccinations`,
    VACCINATION_RECORDS: (childId: string) =>
      `/api/v1/children/${encodeURIComponent(childId)}/vaccinations/records`,
  },

  QUERY_PARAMS: {
    SEARCH_TERM: "search_term",
    STATUS: "status",
  },

  ERROR_MESSAGES: {
    UNABLE_TO_ADMINISTER: "Unable to administer vaccination.",
    UNABLE_TO_LOAD_SESSION: "Unable to load the vaccination session.",
    CHILD_NOT_FOUND: "No child record matched this search. Try the child health ID or birth certificate number again.",
    LOT_NUMBER_REQUIRED: "Lot number is required.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
  },

  SUCCESS_MESSAGES: {
    VACCINATION_ADMINISTERED: (vaccineName: string) =>
      `${vaccineName} marked as administered.`,
  },

  CACHE_CONFIG: {
    STALE_TIME_MS: 5 * 60 * 1000, // 5 minutes
    GC_TIME_MS: 10 * 60 * 1000, // 10 minutes
    DEBOUNCE_MS: 300, // Search debounce
    TOAST_DURATION_MS: 3000, // Toast auto-hide
  },

  STATUS: {
    PENDING: "PENDING",
    OVERDUE: "OVERDUE",
    ADMINISTERED: "ADMINISTERED",
  },
} as const;
