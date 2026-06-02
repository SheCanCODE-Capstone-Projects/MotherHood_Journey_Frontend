# Vaccination API Integration Guide

## Overview
The vaccination module has been successfully integrated with the backend API. All vaccination-related operations now use real API endpoints instead of mock data.

## Backend API Configuration

### Environment Setup
The application uses the following environment variable to connect to the backend:

```env
NEXT_PUBLIC_API_URL=https://motherhoodjourneybackend-production.up.railway.app
```

This is configured in:
- `.env.local` - Local development configuration
- `.env.example` - Example configuration for documentation

### API Client Configuration
The API client (`src/lib/api/client.ts`) automatically:
- Attaches bearer tokens from authentication state
- Handles error responses with detailed error messages
- Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)

## Vaccination API Endpoints

### 1. Search Child Vaccination Session
**Endpoint:** `GET /api/v1/children/search?search_term={healthIdOrBirthCert}`

**Description:** Search for a child by health ID or birth certificate number to load their vaccination session.

**Usage:**
```typescript
import { searchChildVaccinationSession } from '@/lib/api/children';

const response = await searchChildVaccinationSession('CHILD-001');
// Returns: ChildVaccinationSessionResponse
```

**Response Type:** `ChildVaccinationSessionResponse`
```typescript
{
  child: {
    id: string;
    fullName: string;
    healthId: string;
    birthCertificateNo: string;
    dateOfBirth: string;
    ageInYears: number;
    ageInMonths: number;
    motherName: string;
    facilityName: string;
  };
  dueVaccines: Array<{
    id: string;
    vaccineName: string;
    doseLabel: string;
    status: 'PENDING' | 'ADMINISTERED' | 'MISSED' | 'OVERDUE';
    dueDate: string;
    administeredDate?: string | null;
    note?: string;
  }>;
  searchedBy: 'healthId' | 'birthCertificateNo';
}
```

### 2. Get Child Vaccination Session
**Endpoint:** `GET /api/v1/children/{childId}/vaccinations`

**Description:** Retrieve the complete vaccination schedule for a specific child.

**Usage:**
```typescript
import { getChildVaccinationSession } from '@/lib/api/children';

const response = await getChildVaccinationSession('child-123');
```

### 3. Administer Vaccination
**Endpoint:** `PUT /api/v1/vaccinations/{vaccinationId}/administer`

**Description:** Mark a vaccine as administered with lot number tracking for audit trail.

**Request Body:**
```typescript
{
  lotNumber: string; // Required: Vaccine lot number for tracking
}
```

**Usage:**
```typescript
import { administerVaccination } from '@/lib/api/children';

const response = await administerVaccination('vax-001', {
  lotNumber: 'VAX-LOT-2025-001'
});
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

### 4. Register Child (with Vaccination Schedule)
**Endpoint:** `POST /api/v1/children`

**Description:** Register a new child and receive their initial vaccination schedule.

**Request Body:**
```typescript
{
  mother_health_id: string;
  first_name: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth: string; // ISO date format
  birth_weight: number; // in kg
  delivery_type: 'NORMAL' | 'CAESAREAN' | 'ASSISTED';
  birth_certificate_number?: string;
}
```

**Usage:**
```typescript
import { registerChild } from '@/lib/api/children';

const response = await registerChild({
  mother_health_id: 'MTH-001',
  first_name: 'Baby',
  gender: 'MALE',
  date_of_birth: '2025-01-15',
  birth_weight: 3.2,
  delivery_type: 'NORMAL',
  birth_certificate_number: 'BC-2025-001'
});
```

**Response:** `ChildRegistrationResponse`
```typescript
{
  child: ChildDTO;
  vaccination_schedule: VaccinationScheduleDTO[];
}
```

### 5. Search Mothers
**Endpoint:** `GET /api/v1/mothers/search?search_term={query}`

**Description:** Search for mothers by health ID or name (used during child registration).

**Usage:**
```typescript
import { searchMothers } from '@/lib/api/children';

const mothers = await searchMothers('MTH-001');
// or
const mothers = await searchMothers('Marie Uwimana');
```

**Response Type:** `MotherSearchResult[]`
```typescript
Array<{
  health_id: string;
  name: string;
  phone: string;
}>
```

## React Query Hooks

The application uses React Query for data fetching and caching. Available hooks:

### useVaccinationSessionSearch
```typescript
import { useVaccinationSessionSearch } from '@/features/child/hooks';

const { data, isLoading, error } = useVaccinationSessionSearch(searchTerm);
```

### useAdministerVaccination
```typescript
import { useAdministerVaccination } from '@/features/child/hooks';

const mutation = useAdministerVaccination();

// Usage
mutation.mutate({
  vaccinationId: 'vax-001',
  lotNumber: 'VAX-LOT-2025-001'
}, {
  onSuccess: () => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  }
});
```

## Error Handling

The API client automatically handles errors and throws `ApiError` instances with:
- HTTP status code
- Error message from backend
- Original error response (if available)

Example error handling:
```typescript
try {
  const result = await searchChildVaccinationSession('CHILD-001');
} catch (error) {
  if (isApiError(error)) {
    if (error.isUnauthorized()) {
      // Handle 401 - redirect to login
    } else if (error.isForbidden()) {
      // Handle 403 - insufficient permissions
    } else if (error.isClientError()) {
      // Handle 4xx errors
    } else if (error.isServerError()) {
      // Handle 5xx errors
    }
  }
}
```

## Authentication

All API requests automatically include the bearer token from the authentication state. The token is retrieved from:
1. Zustand auth store (`useAuth.getState()`)
2. Local storage fallback (`localStorage.getItem('auth_token')`)

No additional configuration is needed - authentication is handled automatically by the API client.

## Testing the Integration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Vaccination Session Search
1. Navigate to the vaccination session page
2. Enter a child health ID or birth certificate number
3. Verify that the child's vaccination data loads from the backend

### 3. Test Administer Vaccination
1. Search for a child with due vaccines
2. Click "Mark administered" on a vaccine
3. Enter a lot number
4. Verify the vaccination is marked as administered

### 4. Test Child Registration
1. Navigate to child registration
2. Search for a mother
3. Fill in child details
4. Submit the form
5. Verify the child is registered and vaccination schedule is generated

## Key Features Implemented

✅ **Age-Validated**: Vaccination schedules are calculated based on child's age
✅ **Audit-Trailed**: All vaccinations include lot number tracking
✅ **Real-time Updates**: React Query automatically invalidates and refetches data
✅ **Error Handling**: Comprehensive error handling with user-friendly messages
✅ **Authentication**: Automatic bearer token attachment
✅ **Type Safety**: Full TypeScript support with proper types

## Troubleshooting

### Issue: "NEXT_PUBLIC_API_URL is not configured"
**Solution:** Ensure `.env.local` file exists and contains the API URL.

### Issue: "Network error" or "Failed to fetch"
**Solution:** 
1. Verify the backend server is running
2. Check the API URL in `.env.local`
3. Ensure CORS is properly configured on the backend

### Issue: "401 Unauthorized"
**Solution:** Ensure you are logged in and have a valid authentication token.

### Issue: "403 Forbidden"
**Solution:** Verify that your user account has the necessary permissions to access vaccination features.

## API Documentation Reference

For complete API documentation, visit the Swagger UI:
https://motherhoodjourneybackend-production.up.railway.app/swagger-ui/index.html

## Support

For issues or questions:
1. Check the Swagger documentation
2. Review the error messages in the browser console
3. Verify network requests in browser DevTools
4. Contact the backend team for API-related issues