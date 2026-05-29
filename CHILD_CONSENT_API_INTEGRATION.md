# Child & Consent API Integration Guide

## Overview
This document covers the complete API integration for Child management (registration, immunization schedules, growth tracking) and Consent management (data-sharing consent under Rwanda Law No. 058/2021).

## Backend Configuration

### Base URL
```env
NEXT_PUBLIC_API_URL=https://motherhoodjourneybackend-production.up.railway.app
```

### Authentication
All API requests automatically include bearer token authentication via the API client (`src/lib/api/client.ts`).

---

## Child Management APIs

### 1. Register Child
**Endpoint:** `POST /api/v1/children`

**Description:** Register a new child and automatically generate their immunization schedule.

**Request Body:**
```typescript
{
  mother_health_id: string;
  first_name: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth: string; // ISO format (YYYY-MM-DD)
  birth_weight: number; // in kilograms
  delivery_type: 'NORMAL' | 'CAESAREAN' | 'ASSISTED';
  birth_certificate_number?: string;
}
```

**Usage:**
```typescript
import { registerChild } from '@/lib/api/children';

const result = await registerChild({
  mother_health_id: 'MTH-2024-001',
  first_name: 'Uwase',
  gender: 'FEMALE',
  date_of_birth: '2024-01-15',
  birth_weight: 3.2,
  delivery_type: 'NORMAL',
  birth_certificate_number: 'BC-2024-00123'
});
```

**Response:**
```typescript
{
  child: {
    id: string;
    mother_id: string;
    first_name: string;
    gender: 'MALE' | 'FEMALE';
    date_of_birth: string;
    birth_weight: number;
    delivery_type: 'NORMAL' | 'CAESAREAN' | 'ASSISTED';
    birth_certificate_number?: string;
    created_at: string;
  };
  vaccination_schedule: Array<{
    id: string;
    vaccine_name: string;
    due_date: string;
    status: 'pending' | 'administered' | 'missed';
  }>;
}
```

### 2. Search Mothers
**Endpoint:** `GET /api/v1/mothers/search?search_term={query}`

**Description:** Search for mothers by health ID or name (used during child registration to link child to mother).

**Usage:**
```typescript
import { searchMothers } from '@/lib/api/children';

// Search by health ID
const mothers = await searchMothers('MTH-2024-001');

// Search by name
const mothers = await searchMothers('Marie Uwimana');
```

**Response:**
```typescript
Array<{
  health_id: string;
  name: string;
  phone: string;
}>
```

### 3. Search Child Vaccination Session
**Endpoint:** `GET /api/v1/children/search?search_term={healthIdOrBirthCert}`

**Description:** Search for a child by health ID or birth certificate number to load their vaccination session.

**Usage:**
```typescript
import { searchChildVaccinationSession } from '@/lib/api/children';

const session = await searchChildVaccinationSession('CHILD-2024-001');
```

**Response:**
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

### 4. Get Child Vaccination Session
**Endpoint:** `GET /api/v1/children/{childId}/vaccinations`

**Description:** Retrieve the complete vaccination schedule for a specific child.

**Usage:**
```typescript
import { getChildVaccinationSession } from '@/lib/api/children';

const session = await getChildVaccinationSession('child-123');
```

### 5. Administer Vaccination
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

const result = await administerVaccination('vax-001', {
  lotNumber: 'VAX-LOT-2024-001'
});
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

## Consent Management APIs

### 1. Get All Consents
**Endpoint:** `GET /api/v1/consent?patientId={patientId}`

**Description:** Retrieve all consent records for a specific patient under Rwanda Law No. 058/2021.

**Usage:**
```typescript
import { getAllConsents } from '@/lib/api/consent';

const consents = await getAllConsents('patient-001');
```

**Response:**
```typescript
Array<{
  id: string;
  patientId: string;
  consentType: 'GOV_DATA_SHARE' | 'SMS_REMINDERS' | 'RESEARCH_PARTICIPATION' | 'FACILITY_TRANSFER';
  status: 'GRANTED' | 'REVOKED';
  grantedDate: string;
  legalBasis: string; // Always "Rwanda Law No. 058/2021"
  expiryDate?: string;
  description: string;
}>
```

### 2. Grant Consent
**Endpoint:** `POST /api/v1/consent`

**Description:** Grant a new consent for data sharing under Rwanda Law No. 058/2021.

**Request Body:**
```typescript
{
  patientId: string;
  consentType: 'GOV_DATA_SHARE' | 'SMS_REMINDERS' | 'RESEARCH_PARTICIPATION' | 'FACILITY_TRANSFER';
  grantedDate: string; // ISO format
  expiryDate?: string; // Optional, ISO format
}
```

**Usage:**
```typescript
import { grantConsent } from '@/lib/api/consent';

const consent = await grantConsent('patient-001', {
  consentType: 'GOV_DATA_SHARE',
  grantedDate: new Date().toISOString(),
  expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString() // 2 years
});
```

**Response:**
```typescript
{
  id: string;
  patientId: string;
  consentType: string;
  status: 'GRANTED';
  grantedDate: string;
  legalBasis: 'Rwanda Law No. 058/2021';
  expiryDate?: string;
  description: string;
}
```

### 3. Revoke Consent
**Endpoint:** `DELETE /api/v1/consent/{consentId}`

**Description:** Revoke a previously granted consent under Rwanda Law No. 058/2021.

**Usage:**
```typescript
import { revokeConsent } from '@/lib/api/consent';

await revokeConsent('consent-001');
```

**Response:** `void` (204 No Content)

---

## React Query Hooks

### Child Management Hooks

#### useVaccinationSessionSearch
```typescript
import { useVaccinationSessionSearch } from '@/features/child/hooks';

const { data, isLoading, error } = useVaccinationSessionSearch(searchTerm);
```

#### useAdministerVaccination
```typescript
import { useAdministerVaccination } from '@/features/child/hooks';

const mutation = useAdministerVaccination();

mutation.mutate({
  vaccinationId: 'vax-001',
  lotNumber: 'VAX-LOT-2024-001'
}, {
  onSuccess: () => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  }
});
```

### Consent Management Hooks

You can use React Query directly with the consent API functions:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllConsents, grantConsent, revokeConsent } from '@/lib/api/consent';

// Fetch consents
const { data: consents } = useQuery({
  queryKey: ['consents', patientId],
  queryFn: () => getAllConsents(patientId)
});

// Grant consent mutation
const grantMutation = useMutation({
  mutationFn: (consentType: ConsentType) =>
    grantConsent(patientId, {
      consentType,
      grantedDate: new Date().toISOString()
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['consents'] });
  }
});

// Revoke consent mutation
const revokeMutation = useMutation({
  mutationFn: (consentId: string) => revokeConsent(consentId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['consents'] });
  }
});
```

---

## Error Handling

The API client automatically handles errors and throws `ApiError` instances:

```typescript
import { isApiError } from '@/lib/api/client';

try {
  const result = await registerChild(childData);
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

---

## Testing the Integration

### 1. Child Registration
1. Navigate to `/health-worker/children/register`
2. Search for a mother by health ID or name
3. Fill in child details
4. Submit the form
5. Verify child is registered and vaccination schedule is generated

### 2. Vaccination Session
1. Navigate to `/health-worker/vaccinations`
2. Enter child health ID or birth certificate number
3. Verify vaccination session loads
4. Mark a vaccine as administered with lot number
5. Verify success

### 3. Consent Management
1. Navigate to `/patient/consent`
2. Toggle consent switches
3. Verify consent records are created/revoked
4. Check that GOV_DATA_SHARE shows warning before revocation

---

## Key Features

✅ **Child Registration** - Complete child registration with automatic vaccination schedule generation  
✅ **Immunization Tracking** - Real-time vaccination status and due dates  
✅ **Growth Monitoring** - Track child growth metrics  
✅ **Consent Management** - Full CRUD operations under Rwanda Law No. 058/2021  
✅ **Audit Trail** - Lot number tracking for all vaccinations  
✅ **Real-time Updates** - React Query automatic caching and invalidation  
✅ **Error Handling** - Comprehensive error handling with user-friendly messages  
✅ **Authentication** - Automatic bearer token attachment  
✅ **Type Safety** - Full TypeScript support  

---

## API Documentation Reference

For complete API documentation, visit the Swagger UI:  
https://motherhoodjourneybackend-production.up.railway.app/swagger-ui/index.html

---

## Support

For issues or questions:
1. Check the Swagger documentation
2. Review network requests in browser DevTools
3. Verify authentication token is valid
4. Contact the backend team for API-related issues